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

      {/* HERO */}
      <section className="bg-cream">
        <div className="relative h-[78vh] md:h-[82vh] overflow-hidden bg-ink">
          <video
            ref={heroVideoRef}
            src={HERO_VIDEO}
            muted
            playsInline
            autoPlay
            loop={false}
            preload="auto"
            onEnded={() => setHeroSlide(1)}
            onLoadedMetadata={() => {
              const video = heroVideoRef.current;
              if (video && heroSlide === 0) {
                video.play().catch(() => {});
              }
            }}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none",
              heroSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          />
          {HERO_SLIDES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                i + 1 === heroSlide ? "opacity-100 z-10" : "opacity-0 z-0",
              )}
            />
          ))}
          {/* overlay para legibilidade do texto */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/70 z-20 pointer-events-none" />

          {/* Conteúdo do hero */}
          <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-6 pb-16 md:pb-20 z-30">
            <span className="text-[0.45rem] md:text-[0.5rem] uppercase tracking-[0.4em] text-cream/90 mb-2">
              Curadoria de arquiteta
            </span>
            <h1 className="font-display text-cream text-xl md:text-3xl lg:text-4xl leading-[1.1] max-w-2xl mb-5 md:mb-6">
              Decoração bonita
              <br />
              <span className="italic">não precisa ser intocável.</span>
            </h1>
            <button
              type="button"
              onClick={scrollToBuy}
              className="cursor-pointer text-cream text-[0.42rem] md:text-[0.49rem] uppercase tracking-[0.32em] font-medium underline underline-offset-[4px] decoration-1 hover:decoration-2 transition-all pointer-events-auto"
            >
              Comprar agora
            </button>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-40">
            {Array.from({ length: HERO_TOTAL }).map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-1.5 transition-all pointer-events-auto cursor-pointer",
                  i === heroSlide ? "w-8 bg-cream" : "w-3 bg-cream/40 hover:bg-cream/60",
                )}
              />
            ))}
          </div>

        </div>
      </section>


      {/* Faixa de benefícios (trust strip) */}
      <section className="border-b border-border bg-cream">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { t: "Frete grátis", s: "Para todo o Brasil" },
            { t: "20% OFF", s: "Promoção de Lançamento" },
            { t: "Até 12× no cartão", s: "Parcelamento facilitado" },
            { t: "7 dias para troca", s: "Direito de arrependimento" },
          ].map((b) => (
            <div key={b.t}>
              <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-ink font-medium">
                {b.t}
              </p>
              <p className="text-[0.65rem] text-ink/60 mt-1">{b.s}</p>
            </div>
          ))}
        </div>
      </section>

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

      {/* Vídeo do produto — full-bleed estilo hero */}
      <section className="bg-ink">
        <div className="relative w-full h-[78vh] md:h-[82vh] overflow-hidden bg-ink">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[calc(100vw*16/9)] w-[177.77vh] min-h-full min-w-full"
            src="https://www.youtube.com/embed/WrM0HyUiyqk?autoplay=0&controls=1&modestbranding=1&playsinline=1&rel=0"
            title="Pientro Casa — Produto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* Como usar */}
      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <span className="eyebrow mb-3 block">Versatilidade</span>
            <h2 className="font-display text-3xl md:text-5xl">Em cada canto, uma composição</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Combine com livros, bandejas e objetos para criar arranjos equilibrados.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[
              { img: useCoffee, label: "Mesa de centro" },
              { img: useConsole, label: "Aparador" },
              { img: useShelf, label: "Estante" },
              { img: useNightstand, label: "Criado-mudo" },
            ].map((u) => (
              <figure key={u.label} className="group">
                <div className="overflow-hidden aspect-[4/5]">
                  <img
                    src={u.img}
                    alt={u.label}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-3 text-[0.7rem] uppercase tracking-[0.28em] text-ink/70 text-center">
                  {u.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Detalhes */}
      <section className="bg-secondary py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <img
            src={images[0]?.url ?? productOpen}
            alt="Caixa decorativa com tampa aberta"
            loading="lazy"
            className="w-full aspect-square object-cover"
          />
          <div>
            <span className="eyebrow mb-3 block">Por dentro do produto</span>
            <h2 className="font-display text-3xl md:text-5xl mb-6 leading-tight">
              No detalhe,
              <span className="italic"> a diferença.</span>
            </h2>
            <dl className="divide-y divide-border border-y border-border">
              {[
                ["Material", "MDF + revestimento PU"],
                ["Forro interno", "Tecido encorpado"],
                ["Médio", "7,5 × 26,5 × 13,5 cm (A×L×P)"],
                ["Grande", "7,5 × 36,5 × 18,5 cm (A×L×P)"],
                ["Cor", "Terracota & dourado"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-3.5 text-sm">
                  <dt className="text-[0.7rem] uppercase tracking-[0.25em] text-ink/60">{k}</dt>
                  <dd className="text-ink/85 text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Fundadora */}
      <section className="bg-terracotta text-cream py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10 md:gap-14 items-center">
          <div className="md:col-span-2">
            <div className="relative w-full aspect-[9/16] overflow-hidden bg-ink">
              <iframe
                src="https://www.youtube.com/embed/D14K_MYVA_g?autoplay=0&controls=1&modestbranding=1&playsinline=1&rel=0"
                title="Nathalia Gaitkoski — Arquiteta"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[177.77%] w-full"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-cream/70 mb-4">
              Nathalia Gaitkoski · Arquiteta
            </p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6">
              "Curadoria não parte só da estética.
              <span className="italic"> Parte da vida."</span>
            </h2>
            <p className="text-cream/85 leading-relaxed mb-4">
              A Pientro Casa nasceu da minha inquietação como arquiteta: encontrar peças que fossem
              além da estética — bonitas, mas também funcionais e pensadas para a vida real.
            </p>
            <p className="text-cream/85 leading-relaxed">
              Cada item aqui é escolhido para unir{" "}
              <span className="italic">beleza, função e vida real</span>.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="eyebrow mb-3 block">Dúvidas</span>
            <h2 className="font-display text-3xl md:text-5xl">Perguntas frequentes</h2>
          </div>

          {[
            {
              section: "Sobre a marca",
              items: [
                {
                  q: "A Pientro Casa é uma loja ou uma marca própria?",
                  a: "A Pientro Casa é uma curadoria de decoração feita por arquiteta. Cada peça é selecionada com base em critérios técnicos — não apenas estética, mas também funcionalidade, durabilidade e aplicação real no dia a dia.",
                },
                {
                  q: "As peças são exclusivas da marca?",
                  a: "Não são peças autorais, e sim curadas. O diferencial está na seleção: escolhemos produtos que funcionam na prática, que se mantêm bonitos com o uso e que ajudam a compor ambientes com mais identidade.",
                },
                {
                  q: "Qual o diferencial da Pientro Casa em relação a outras lojas?",
                  a: "Aqui, você não encontra apenas objetos decorativos — encontra peças pensadas para serem usadas. A curadoria parte de uma visão de projeto: proporção, material, cor e funcionalidade são considerados antes da estética.",
                },
              ],
            },
            {
              section: "Sobre os produtos",
              items: [
                {
                  q: "As peças são resistentes para uso no dia a dia?",
                  a: "Sim. A escolha dos produtos leva em conta justamente isso. Materiais frágeis ou de difícil manutenção são evitados. Priorizamos peças que possam ser usadas com tranquilidade, sem medo de \"estragar a decoração\".",
                },
                {
                  q: "Como sei se o produto vai combinar com a minha casa?",
                  a: "As peças são selecionadas pensando em versatilidade, com cores, materiais e proporções que se adaptam a diferentes estilos de ambiente. Se ainda tiver dúvida, você pode nos chamar no WhatsApp e enviar uma foto do seu espaço.",
                },
                {
                  q: "Os produtos são exatamente como nas fotos?",
                  a: "Sim. Trabalhamos para que as imagens representem fielmente cada peça. Pode haver pequenas variações de tonalidade devido à iluminação ou tela.",
                },
              ],
            },
            {
              section: "Compra e entrega",
              items: [
                {
                  q: "Qual o prazo de envio?",
                  a: "O prazo de envio pode variar conforme o produto e a região. Após a compra, você recebe todas as informações de rastreamento.",
                },
                { q: "Vocês entregam para todo o Brasil?", a: "Sim, realizamos entregas para todo o país." },
                {
                  q: "Posso comprar pelo Mercado Livre ou apenas pelo site?",
                  a: "Alguns produtos podem estar disponíveis também no Mercado Livre. Você pode escolher o canal mais conveniente.",
                },
              ],
            },
            {
              section: "Trocas, devoluções e suporte",
              items: [
                {
                  q: "Posso trocar ou devolver um produto?",
                  a: "Sim. Você pode solicitar a devolução em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor.",
                },
                {
                  q: "E se o produto chegar com algum problema?",
                  a: "Caso receba um produto com defeito ou avaria, entre em contato conosco. Vamos avaliar o caso e providenciar a solução da melhor forma possível.",
                },
                {
                  q: "Como entro em contato com a Pientro Casa?",
                  a: "Você pode falar conosco diretamente pelo WhatsApp. É o canal mais rápido para tirar dúvidas e acompanhar seu pedido.",
                },
              ],
            },
          ].map((group, gi) => (
            <div key={group.section} className="mb-10">
              <h3 className="font-display text-xl md:text-2xl text-terracotta mb-4">
                {group.section}
              </h3>
              <div className="divide-y divide-border border-y border-border">
                {group.items.map((f, i) => {
                  const idx = gi * 100 + i;
                  return (
                    <button
                      key={i}
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left py-5 flex items-start justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <h4 className="font-display text-base md:text-lg text-ink mb-2">{f.q}</h4>
                        {openFaq === idx && (
                          <p className="text-sm text-ink/75 leading-relaxed pr-6">{f.a}</p>
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-terracotta flex-shrink-0 mt-1 transition-transform",
                          openFaq === idx && "rotate-180",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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
