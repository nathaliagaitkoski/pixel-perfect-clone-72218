import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const YAMPI_BASE = "https://api.dooki.com.br/v2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const ALIAS = Deno.env.get("YAMPI_ALIAS");
  const TOKEN = Deno.env.get("YAMPI_TOKEN");
  const SECRET = Deno.env.get("YAMPI_SECRET_KEY");

  if (!ALIAS || !TOKEN || !SECRET) {
    return new Response(
      JSON.stringify({ error: "Yampi credentials not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const productId = url.searchParams.get("id");

    let endpoint: string;
    if (productId) {
      endpoint = `${YAMPI_BASE}/${ALIAS}/catalog/products/${productId}?include=images,skus`;
    } else if (slug) {
      endpoint = `${YAMPI_BASE}/${ALIAS}/catalog/products?include=images,skus&search=slug:${encodeURIComponent(slug)}&searchFields=slug:=`;
    } else {
      // fallback: list first products
      endpoint = `${YAMPI_BASE}/${ALIAS}/catalog/products?include=images,skus&limit=1`;
    }

    const yampiRes = await fetch(endpoint, {
      headers: {
        "User-Token": TOKEN,
        "User-Secret-Key": SECRET,
        "Content-Type": "application/json",
      },
    });

    if (!yampiRes.ok) {
      const text = await yampiRes.text();
      console.error("Yampi API error", yampiRes.status, text);
      return new Response(
        JSON.stringify({ error: "upstream_error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const json = await yampiRes.json();
    // Normalize: if it's a list, return first; if single, return as-is
    const raw = Array.isArray(json?.data) ? json.data[0] : json?.data;
    if (!raw) {
      return new Response(JSON.stringify({ product: null, alias: ALIAS }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const images = (raw.images?.data ?? []).map((img: any) => ({
      url: img.large?.url ?? img.medium?.url ?? img.small?.url ?? img.url,
      alt: img.alt ?? raw.name ?? null,
    }));

    const skus = (raw.skus?.data ?? []).map((sku: any) => {
      const sale = Number(sku.price_sale ?? sku.prices?.sale_price ?? 0);
      const discount = Number(sku.price_discount ?? sku.prices?.discount_price ?? 0);
      const final = discount > 0 ? discount : sale;
      return {
        id: String(sku.id),
        title: sku.title ?? sku.sku ?? "",
        sku: sku.sku,
        price: final,
        comparePrice: discount > 0 && sale > discount ? sale : 0,
        available: (sku.blocked_sale === false) && (sku.availability !== 0),
        // Official Yampi purchase URL — uses the store's configured checkout domain.
        purchaseUrl: sku.purchase_url ?? null,
      };
    });

    const product = {
      id: String(raw.id),
      slug: raw.slug,
      title: raw.name,
      description: raw.description ?? raw.html_description ?? "",
      images,
      skus,
    };

    return new Response(JSON.stringify({ product, alias: ALIAS }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("yampi-product error", msg);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
