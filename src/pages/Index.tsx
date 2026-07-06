import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Lock,
  Loader2,
  User,
  Instagram,
  Youtube,
  CreditCard,
} from "lucide-react";
import logoPientro from "@/assets/logo-pientro.png";
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";
import hero4 from "@/assets/hero-4.png";
import productOpen from "@/assets/product-open.svg";
import useCoffee from "@/assets/use-coffee-table.jpg";
import useConsole from "@/assets/use-console.jpg";
import useShelf from "@/assets/use-shelf.jpg";
import useNightstand from "@/assets/use-nightstand.jpg";
import founderImg from "@/assets/founder.png";
import { cn } from "@/lib/utils";
import { fetchProductByHandle, fetchShopPolicies, formatBRL, type ShopPolicies } from "@/lib/yampi";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";
import { trackMeta } from "@/lib/metaPixel";
import { MarqueeBar } from "@/components/MarqueeBar";
import { CountdownBanner } from "@/components/CountdownBanner";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { LeadBanner } from "@/components/LeadBanner";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { PaymentBadges } from "@/components/PaymentBadges";
import { ProductCard } from "@/components/ProductCard";
import { getProductsByCollection } from "@/data/products";
import { toast } from "sonner";

const PRODUCT_HANDLE = "caixa-decorativa-terracota-e-dourado-de-luxo";

interface Variant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  checkoutUrl: string | null;
}

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: Variant }> };
  options: Array<{ name: string; values: string[] }>;
}

const scrollToBuy = () =>
  document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth", block: "start" });

const HERO_VIDEO = "/video/hero.mp4";
const HERO_SLIDES = [hero1, hero2, hero3, hero4];
const HERO_TOTAL = HERO_SLIDES.length + 1;

const Index = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [policies, setPolicies] = useState<ShopPolicies | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  useEffect(() => {
    fetchProductByHandle(PRODUCT_HANDLE)
      .then((p) => {
        setProduct(p);
        const edges = p?.variants?.edges ?? [];
        const medio = edges.find((e: { node: Variant }) =>
          /m[ée]dio/i.test(e.node.title) ||
          e.node.selectedOptions?.some((o) => /m[ée]dio/i.test(o.value)),
        )?.node;
        const firstAvailable =
          medio ??
          edges.find((e: { node: Variant }) => e.node.availableForSale)?.node ??
          edges[0]?.node;
        if (firstAvailable) setSelectedVariantId(firstAvailable.id);
        if (p) {
          trackMeta("ViewContent", {
            content_ids: [p.id],
            content_name: p.title,
            content_type: "product",
            currency: "BRL",
            value: firstAvailable ? parseFloat(firstAvailable.price.amount) : undefined,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (heroSlide === 0) return; // video controls its own duration
    const t = setInterval(() => setHeroSlide((s) => (s === 0 ? 0 : ((s - 1 + 1) % HERO_SLIDES.length) + 1)), 5000);
    return () => clearInterval(t);
  }, [heroSlide]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (heroSlide === 0) {
      video.currentTime = 0;
      video.play().catch(() => {
        setTimeout(() => {
          if (heroVideoRef.current && heroSlide === 0) {
            heroVideoRef.current.play().catch(() => {});
          }
        }, 300);
      });
    } else {
      video.pause();
    }
  }, [heroSlide]);

  useEffect(() => {
    fetchShopPolicies().then((p) => p && setPolicies(p)).catch(() => {});
  }, []);

  const variants = product?.variants.edges.map((e) => e.node) ?? [];
  const images = product?.images.edges.map((e) => e.node) ?? [];
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0];

  // Exibe só o sufixo da variante (ex.: "Caixa Decorativa ... médio" -> "Médio")
  const shortVariantTitle = (title?: string) => {
    if (!title) return "";
    const base = product?.title?.toLowerCase() ?? "";
    let t = title.trim();
    if (base && t.toLowerCase().startsWith(base)) {
      t = t.slice(base.length).trim();
    } else {
      const parts = t.split(/\s+/);
      t = parts[parts.length - 1];
    }
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const shopifyCompare = selectedVariant?.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice.amount) : 0;
  // Promoção de Lançamento: 20% off em cima do preço cheio; PIX: 5% extra sobre o já descontado
  const FLASH_OFF = 0.2;
  const PIX_OFF = 0.05;
  const fullPrice = shopifyCompare > price ? shopifyCompare : price;
  const compare = fullPrice;
  const discountedUnit = fullPrice * (1 - FLASH_OFF);
  const total = discountedUnit * qty;
  const pixPrice = total * (1 - PIX_OFF);
  const discountPct = Math.round(FLASH_OFF * 100);

  const handleAddToCart = async (openCheckoutAfter = false) => {
    if (!product || !selectedVariant) return;
    if (!selectedVariant.availableForSale) {
      toast.error("Variante indisponível no momento");
      return;
    }
    await addItem({
      productId: product.id,
      productTitle: product.title,
      productImage: images[0]?.url ?? "",
      productHandle: product.handle,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: qty,
      selectedOptions: selectedVariant.selectedOptions,
      checkoutUrl: selectedVariant.checkoutUrl,
    });
    trackMeta("AddToCart", {
      content_ids: [selectedVariant.id],
      content_name: product.title,
      content_type: "product",
      currency: "BRL",
      value: price * qty,
      contents: [{ id: selectedVariant.id, quantity: qty, item_price: price }],
    });
    if (openCheckoutAfter) {
      const url = useCartStore.getState().getCheckoutUrl();
      trackMeta("InitiateCheckout", {
        content_ids: [selectedVariant.id],
        currency: "BRL",
        value: total,
        num_items: qty,
      });
      if (url) window.open(url, "_blank");
    }
  };

  const galleryImages = useMemo(() => images.slice(0, 5), [images]);

  return (
    <main className="bg-cream text-ink overflow-x-hidden">
      <MarqueeBar />
      <CountdownBanner />

      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" aria-label="Pientro Casa" className="flex items-center">
            <img src={logoPientro} alt="Pientro Casa" className="h-6 md:h-8 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={scrollToBuy}
              className="hidden md:inline text-[0.7rem] uppercase tracking-[0.28em] text-terracotta hover:text-ink transition-colors font-medium mr-2"
            >
              Comprar
            </button>
            <button
              aria-label="Minha conta"
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              onClick={() => {
                localStorage.removeItem("pientro:lead-dismissed");
                window.dispatchEvent(new Event("pientro:open-account"));
              }}
            >
              <User className="w-5 h-5 text-ink" />
            </button>
            <CartDrawer />
          </div>
        </div>
      </header>


      {/* PDP */}
      <section id="comprar" className="py-12 md:py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="bg-secondary aspect-square overflow-hidden">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                </div>
              ) : galleryImages[activeImg] ? (
                <img
                  src={galleryImages[activeImg].url}
                  alt={galleryImages[activeImg].altText ?? product?.title ?? ""}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2 md:gap-3 mt-3">
                {galleryImages.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "aspect-square overflow-hidden border transition-all",
                      activeImg === i ? "border-terracotta" : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <img src={g.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            <div className="flex items-center gap-2 mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-terracotta font-medium">
              <span className="inline-block w-6 h-px bg-terracotta" /> Curadoria de arquiteta
            </div>

            <h2 className="font-display text-3xl md:text-5xl leading-[1.1] mb-4">
              {product?.title ?? "Caixas Decorativas Terracota & Dourado"}
            </h2>

            <p className="text-ink/75 leading-relaxed mb-6 text-[0.95rem]">
              Mais do que organizar, peças pensadas para{" "}
              <strong className="font-medium">compor ambientes com elegância e intenção</strong>. São
              peças versáteis que funcionam tanto como apoio visual quanto como solução prática para
              o dia a dia.
            </p>

            {/* Preço — Promoção de Lançamento + PIX extra */}
            <div className="mb-6 space-y-2">
              {fullPrice * qty > total && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground/70 uppercase tracking-[0.2em] text-[0.6rem]">De</span>
                  <span className="text-muted-foreground line-through">{formatBRL(fullPrice * qty)}</span>
                </div>
              )}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-muted-foreground uppercase tracking-[0.2em] text-[0.6rem] self-center">Por</span>
                <span className="font-display text-5xl md:text-6xl text-terracotta leading-none">
                  {formatBRL(total)}
                </span>
                {discountPct > 0 && (
                  <span className="bg-terracotta text-cream text-[0.6rem] uppercase tracking-[0.2em] px-2 py-1 font-medium">
                    -{discountPct}% Promoção de Lançamento
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-2 bg-terracotta/10 border border-terracotta/30 text-terracotta px-2.5 py-1 rounded-sm">
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] font-semibold">No PIX</span>
                  <span className="text-base font-medium tabular-nums">{formatBRL(pixPrice)}</span>
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] font-semibold opacity-80">-5% extra</span>
                </div>
              </div>
              <p className="text-[0.7rem] text-ink/55 leading-relaxed">
                Já com {discountPct > 0 ? `${discountPct}% de desconto` : "promoção"} aplicado · pagando no PIX você ganha mais 5% à vista
              </p>
            </div>


            {/* Escassez ética / urgência leve */}
            <div className="flex items-center gap-2 mb-6 text-[0.7rem] uppercase tracking-[0.2em] text-terracotta">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta" />
              </span>
              Edição limitada · Despacho em até 2 dias úteis
            </div>

            {variants.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.7rem] uppercase tracking-[0.25em] text-ink/70 font-medium">
                    Tamanho: <span className="text-ink">{shortVariantTitle(selectedVariant?.title)}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {variants.map((v) => {
                    const active = selectedVariantId === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        disabled={!v.availableForSale}
                        className={cn(
                          "relative border p-3 text-left transition-all",
                          active ? "border-terracotta bg-terracotta/5" : "border-border hover:border-ink/40",
                          !v.availableForSale && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="font-display text-base md:text-lg leading-tight">{shortVariantTitle(v.title)}</div>
                        <div className="text-sm font-medium text-terracotta mt-2">
                          {formatBRL(v.price.amount)}
                        </div>
                        {!v.availableForSale && (
                          <div className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                            Esgotado
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-4 hover:bg-secondary transition-colors"
                  aria-label="Diminuir"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-4 hover:bg-secondary transition-colors"
                  aria-label="Aumentar"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => handleAddToCart(false)}
                disabled={isAdding || loading || !selectedVariant?.availableForSale}
                className="flex-1 bg-terracotta text-cream py-4 px-6 text-[0.78rem] uppercase tracking-[0.3em] font-medium hover:bg-[hsl(var(--terracotta-soft))] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : `Adicionar · ${formatBRL(total)}`}
              </button>
            </div>

            <button
              onClick={() => handleAddToCart(true)}
              disabled={isAdding || loading || !selectedVariant?.availableForSale}
              className="w-full bg-ink text-cream py-4 px-6 text-[0.78rem] uppercase tracking-[0.3em] font-medium hover:bg-ink/85 transition-colors disabled:opacity-60"
            >
              Comprar agora
            </button>
          </div>
        </div>

        {/* Faixa única (atravessa as duas colunas) — bullets do produto */}
        <div className="max-w-7xl mx-auto mt-10 md:mt-14 border-t border-border pt-6">
          <ul className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-x-6 gap-y-3 text-sm text-ink/80 text-left">
            {[
              "PU (couro sintético) sobre estrutura em MDF",
              "Forro interno encorpado — protege e dura mais",
              "Acabamento refinado para qualquer ambiente",
              "Despacho em até 2 dias úteis",
            ].map((b) => (
              <li key={b} className="flex gap-2 items-start md:items-center">
                <Check className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5 md:mt-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Faixa única — trust strip em uma linha */}
        <div className="max-w-7xl mx-auto mt-4 border-t border-border pt-5">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-3 text-xs text-ink/75">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-terracotta" /> Entrega em todo Brasil
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-terracotta" /> 7 dias para troca
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-terracotta" /> Até 12× no cartão
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-terracotta" /> Compra segura · SSL
            </div>
          </div>
        </div>

        {/* Pagamento & Garantia */}
        <div className="max-w-4xl mx-auto mt-10 grid md:grid-cols-2 gap-4 md:gap-5">
          <div className="border border-border p-5 flex flex-col">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-ink/55 mb-3">
              Formas de pagamento
            </p>
            <PaymentBadges />
            <p className="text-[0.65rem] text-ink/55 mt-3 leading-relaxed">
              Pix, boleto e cartões em até 12×. Pagamento processado com criptografia SSL.
            </p>
          </div>
          <div className="bg-secondary/60 border border-border p-5 flex gap-3 items-start">
            <RotateCcw className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-display text-base text-ink leading-tight">
                Garantia de satisfação · 7 dias
              </p>
              <p className="text-xs text-ink/65 mt-1 leading-relaxed">
                Não amou? Devolva em até 7 dias após a coleta e devolvemos seu dinheiro.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Detalhes do produto — 60% texto / 40% foto (full-bleed) */}
      <section className="bg-cream">
        <div className="grid md:grid-cols-5 items-stretch">
          <div className="md:col-span-3 order-2 md:order-1 px-5 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-center">
            <span className="eyebrow mb-4 block">Ficha técnica</span>
            <h2 className="font-display text-3xl md:text-5xl mb-8 leading-tight">
              Detalhes do produto
            </h2>
            <div className="space-y-3 text-[0.95rem] text-ink/85 mb-10">
              <p><span className="font-semibold text-ink">Cor:</span> Terracota & Dourado</p>
              <p><span className="font-semibold text-ink">Material:</span> MDF com revestimento PU</p>
              <p><span className="font-semibold text-ink">Forro interno:</span> Tecido encorpado</p>
              <p><span className="font-semibold text-ink">Dimensões (Médio):</span> 7,5 × 26,5 × 13,5 cm (A×L×P)</p>
              <p><span className="font-semibold text-ink">Dimensões (Grande):</span> 7,5 × 36,5 × 18,5 cm (A×L×P)</p>
              <p><span className="font-semibold text-ink">Acabamento:</span> Fosco com detalhe em folha dourada</p>
            </div>
            <h3 className="font-display text-xl md:text-2xl text-terracotta mb-3">
              Descrição adicional
            </h3>
            <p className="text-ink/75 leading-relaxed text-[0.95rem]">
              Peças pensadas com olhar de arquiteta — feitas para organizar, compor e permanecer.
              O acabamento em terracota fosco com detalhe em folha dourada traz calor e sofisticação
              a qualquer ambiente, do console da sala ao criado-mudo do quarto.
            </p>
          </div>
          <div className="md:col-span-2 order-1 md:order-2 bg-secondary">
            <img
              src={images[1]?.url ?? hero2}
              alt="Caixa decorativa terracota e dourado — detalhes"
              loading="lazy"
              className="w-full h-full object-cover min-h-[60vh] md:min-h-full"
            />
          </div>
        </div>
      </section>

      {/* Cuidados — 60% foto / 40% texto (full-bleed) */}
      <section className="bg-secondary">
        <div className="grid md:grid-cols-5 items-stretch">
          <div className="md:col-span-3 bg-cream">
            <img
              src={images[2]?.url ?? hero3}
              alt="Caixa decorativa em uso na composição"
              loading="lazy"
              className="w-full h-full object-cover min-h-[60vh] md:min-h-full"
            />
          </div>
          <div className="md:col-span-2 px-5 md:px-16 lg:px-20 py-16 md:py-24 flex flex-col justify-center">
            <span className="eyebrow mb-4 block">Como cuidar</span>
            <h2 className="font-display text-3xl md:text-5xl mb-8 leading-tight">
              Cuidados com o produto
            </h2>
            <p className="text-ink/75 leading-relaxed text-[0.95rem] mb-8">
              Limpar apenas com pano seco ou levemente umedecido. Evitar contato prolongado
              com água, produtos químicos e exposição direta ao sol. Não usar esponjas
              abrasivas ou álcool sobre o acabamento dourado.
            </p>

            <h3 className="font-display text-xl md:text-2xl text-terracotta mb-3">
              Recomendações de uso
            </h3>
            <p className="text-ink/75 leading-relaxed text-[0.95rem] mb-8">
              Ideal para console, aparador, mesa de centro, estante e criado-mudo. Combine
              com livros, bandejas e objetos decorativos para arranjos equilibrados.
            </p>

            <h3 className="font-display text-xl md:text-2xl text-terracotta mb-3">
              Encante-se
            </h3>
            <p className="text-ink/75 leading-relaxed text-[0.95rem]">
              Com acabamento em terracota fosco e detalhes em folha dourada aplicados à mão,
              a coleção Sol da Manhã traz calor, presença e identidade à sua casa.
            </p>
          </div>
        </div>
      </section>


      {/* Coleção — mais peças */}
      <section className="bg-cream py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <span className="eyebrow mb-3 block">Coleção Sol da Manhã</span>
            <h2 className="font-display text-3xl md:text-5xl">Peças que combinam</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Outras peças da mesma coleção, pensadas para conversar entre si.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 md:gap-x-8">
            {getProductsByCollection("sol-da-manha")
              .filter((p) => !p.redirectTo)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
        </div>
      </section>





      {/* CTA final */}
      <section className="bg-ink text-cream py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block w-12 h-px bg-cream/50 mb-6" />
          <h2 className="font-display text-3xl md:text-5xl mb-6 leading-tight">
            Sua casa pede uma peça
            <br />
            <span className="italic">que seja bonita — e usada.</span>
          </h2>
          <p className="text-cream/75 mb-8 max-w-lg mx-auto">
            Estoque limitado da edição Terracota & Dourado. Despacho em 2 dias úteis.
          </p>
          <button
            onClick={scrollToBuy}
            className="bg-terracotta text-cream px-10 py-4 text-[0.75rem] uppercase tracking-[0.3em] hover:bg-[hsl(var(--terracotta-soft))] transition-colors"
          >
            Comprar agora →
          </button>
          <p className="text-xs text-cream/50 mt-5 uppercase tracking-[0.25em]">
            Frete grátis para todo o Brasil · 7 dias para troca · Compra segura
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cream border-t border-border pt-14 pb-8 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-14 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-2xl text-ink mb-2">
              Pientro <span className="text-terracotta tracking-[0.25em] text-base ml-1">Casa</span>
            </p>
            <p className="text-sm text-ink/70 max-w-xs leading-relaxed">
              Curadoria de decoração com olhar de arquiteta. Beleza que se usa.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com/pientrocasa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 border border-border hover:border-terracotta hover:text-terracotta transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com/pientrocasa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="p-2 border border-border hover:border-terracotta hover:text-terracotta transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                  <path d="M12 0a12 12 0 0 0-4.4 23.16c-.06-.94-.11-2.4.02-3.43.12-.93 1.32-5.94 1.32-5.94s-.34-.68-.34-1.69c0-1.58.92-2.77 2.06-2.77.97 0 1.44.73 1.44 1.6 0 .98-.62 2.44-.94 3.79-.27 1.13.57 2.05 1.69 2.05 2.03 0 3.59-2.14 3.59-5.22 0-2.73-1.96-4.64-4.77-4.64-3.25 0-5.16 2.44-5.16 4.96 0 .98.38 2.04.85 2.61.09.11.11.21.08.32-.09.37-.29 1.13-.33 1.29-.05.21-.17.26-.4.16-1.5-.7-2.43-2.88-2.43-4.64 0-3.78 2.74-7.25 7.91-7.25 4.15 0 7.38 2.96 7.38 6.91 0 4.13-2.6 7.45-6.21 7.45-1.21 0-2.36-.63-2.75-1.37l-.75 2.86c-.27 1.04-1 2.34-1.49 3.13A12 12 0 1 0 12 0z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@pientrocasa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 border border-border hover:border-terracotta hover:text-terracotta transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@pientrocasa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="p-2 border border-border hover:border-terracotta hover:text-terracotta transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.79 20.34a6.34 6.34 0 0 0 10.86-4.43V8.97a8.16 8.16 0 0 0 4.77 1.52V7.04a4.85 4.85 0 0 1-1.83-.35z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-ink/60 mb-4">Informações</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/politica-de-privacidade"
                  className="text-ink/80 hover:text-terracotta transition-colors"
                >
                  Política de privacidade
                </a>
              </li>
              <li>
                <a
                  href="/termos-de-servico"
                  className="text-ink/80 hover:text-terracotta transition-colors"
                >
                  Termos de serviço
                </a>
              </li>
              <li>
                <a
                  href="/politica-de-reembolso"
                  className="text-ink/80 hover:text-terracotta transition-colors"
                >
                  Política de reembolso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-ink/60 mb-4">Contato</p>
            <ul className="space-y-2 text-sm text-ink/80">
              <li><a href="mailto:contato@pientrocasa.com.br" className="hover:text-terracotta transition-colors break-all">contato@pientrocasa.com.br</a></li>
              <li><a href="https://wa.me/5545999893299" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">WhatsApp: (45) 99989-3299</a></li>
              {policies?.contact && (
                <li>
                  <a
                    href={policies.contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-terracotta transition-colors"
                  >
                    Página de contato
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-8">
          <p className="text-xs text-ink/60 text-center px-4">
            Atendimento: Seg a Sex 09h às 18h · Sáb 09h às 12h
          </p>
        </div>

        <div className="max-w-7xl mx-auto border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Pientro Casa LTDA · CNPJ 66.790.219/0001-40 · Curadoria com olhar de arquiteta
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-ink/50">Pagamento</span>
            <PaymentBadges />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 flex items-center justify-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-ink/50">
          <Lock className="w-3 h-3" /> Compra 100% segura · SSL · Dados protegidos (LGPD)
        </div>
      </footer>

      <WhatsAppFloat />
      <LeadBanner />
      <StickyBuyBar
        productTitle={product?.title ?? "Caixas Decorativas"}
        productImage={images[0]?.url}
        price={total}
        variantTitle={selectedVariant?.title}
        isAdding={isAdding}
        available={!!selectedVariant?.availableForSale}
        onAdd={() => {
          document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />
    </main>
  );
};

export default Index;
