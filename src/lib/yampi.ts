import { supabase } from "@/integrations/supabase/client";

export const formatBRL = (value: number | string) => {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);
};

// ---- Types compatible with previous Shopify shape (drop-in for Index.tsx) ----
export interface YampiVariantShape {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  checkoutUrl: string | null;
}

export interface YampiProductShape {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: YampiVariantShape }> };
  options: Array<{ name: string; values: string[] }>;
}

// Alias is public (appears in the checkout URL). Cache it so cart can build links.
let cachedAlias: string | null = null;
export const getYampiAlias = () => cachedAlias;

function stripHtml(html: string) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export async function fetchProductByHandle(slug: string): Promise<YampiProductShape | null> {
  const { data, error } = await supabase.functions.invoke("yampi-product", {
    body: null,
    method: "GET",
    // Pass slug as query string by using the URL builder fallback:
    headers: {},
  } as never);

  // supabase.functions.invoke doesn't easily support query params; fall back to fetch:
  const url = `https://elyweuifzmvlaofxrxso.supabase.co/functions/v1/yampi-product?slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url, {
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
  });
  if (!res.ok) {
    console.error("yampi-product fetch failed", res.status);
    return null;
  }
  const json = await res.json();
  if (json?.alias) cachedAlias = json.alias;
  const p = json?.product;
  if (!p) return null;

  // Map Yampi shape -> Shopify-like shape for Index.tsx compatibility
  return {
    id: p.id,
    title: p.title,
    description: stripHtml(p.description),
    handle: p.slug,
    images: {
      edges: p.images.map((img: { url: string; alt: string | null }) => ({
        node: { url: img.url, altText: img.alt },
      })),
    },
    options: [{ name: "Tamanho", values: p.skus.map((s: { title: string }) => s.title) }],
    variants: {
      edges: p.skus.map((sku: {
        id: string;
        title: string;
        price: number;
        comparePrice: number;
        available: boolean;
        purchaseUrl: string | null;
      }) => ({
        node: {
          id: sku.id,
          title: sku.title,
          price: { amount: String(sku.price), currencyCode: "BRL" },
          compareAtPrice:
            sku.comparePrice > sku.price
              ? { amount: String(sku.comparePrice), currencyCode: "BRL" }
              : null,
          availableForSale: sku.available,
          selectedOptions: [{ name: "Tamanho", value: sku.title }],
          checkoutUrl: sku.purchaseUrl ?? null,
        },
      })),
    },
  };
}

// Yampi has no Storefront "policies" API like Shopify — return null so the site falls back
// to its local policy pages (PrivacyPolicy.tsx, TermsOfService.tsx, RefundPolicy.tsx).
export interface ShopPolicies {
  privacyPolicy: { url: string; title: string } | null;
  termsOfService: { url: string; title: string } | null;
  refundPolicy: { url: string; title: string } | null;
  shippingPolicy: { url: string; title: string } | null;
  contact: { url: string; title: string } | null;
}
export async function fetchShopPolicies(): Promise<ShopPolicies | null> {
  return null;
}

/**
 * Build a Yampi checkout URL from the cart items. Yampi returns an official
 * per-SKU `purchase_url` (e.g. https://{alias}.pay.yampi.com.br/r/TOKEN).
 *
 * Multiple items: the /r/ link is single-SKU; we fall back to the first item's
 * URL with combined quantity. For mixed-SKU carts, use Yampi "Link de Pagamento" API.
 */
export function buildYampiCheckoutUrl(
  items: Array<{ variantId: string; quantity: number; checkoutUrl?: string | null }>,
  _aliasOverride?: string,
): string | null {
  if (items.length === 0) return null;
  const first = items[0];
  if (!first.checkoutUrl) return null;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const url = new URL(first.checkoutUrl);
  if (totalQty > 1) url.searchParams.set("quantity", String(totalQty));
  return url.toString();
}
