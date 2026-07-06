import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ShieldCheck, RotateCcw, Minus, Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/yampi";
import { MarqueeBar } from "@/components/MarqueeBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, getProductsByCollection } from "@/data/products";

const collectionLabel: Record<string, string> = {
  "sol-da-manha": "Sol da Manhã",
};

const categoryLabel: Record<string, string> = {
  caixa: "Caixas",
  vaso: "Vasos & Objetos",
  quadro: "Quadros",
  objeto: "Objetos",
};

const Product = () => {
  const { slug = "" } = useParams();
  const product = getProductBySlug(slug);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(null);

  useEffect(() => {
    setQty(1);
    setActiveImg(0);
    setVariantId(product?.variants?.[0]?.id ?? null);
  }, [slug, product]);

  if (!product) return <Navigate to="/" replace />;
  if (product.redirectTo) return <Navigate to={product.redirectTo} replace />;

  const selectedVariant =
    product.variants?.find((v) => v.id === variantId) ?? product.variants?.[0];
  const unitPrice = selectedVariant?.price ?? product.price;
  const unitCompare = selectedVariant?.compareAt ?? product.compareAt ?? 0;
  const total = unitPrice * qty;
  const compareTotal = unitCompare * qty;
  const pixPrice = total * 0.95;

  const related = getProductsByCollection(product.collection)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const handleBuy = () => {
    toast.info("Em breve disponível para compra", {
      description: "Esta peça ainda não está com checkout ativo.",
    });
  };

  return (
    <main className="bg-cream text-ink overflow-x-hidden">
      <MarqueeBar />
      <SiteHeader />

      <section className="py-8 md:py-14 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Thumbnails */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-4">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "aspect-[3/4] w-full bg-secondary border overflow-hidden transition-colors",
                  activeImg === i
                    ? "border-terracotta"
                    : "border-transparent hover:border-terracotta/60 opacity-70 hover:opacity-100",
                )}
              >
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="lg:col-span-6">
            <div className="aspect-[4/5] w-full bg-secondary border border-border overflow-hidden group">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Mobile thumbs */}
            {product.images.length > 1 && (
              <div className="lg:hidden grid grid-cols-5 gap-2 mt-3">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "aspect-square overflow-hidden border transition-all",
                      activeImg === i ? "border-terracotta" : "border-transparent opacity-70",
                    )}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info column */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-0">
            <nav className="text-[10px] uppercase tracking-[0.25em] text-terracotta font-semibold mb-4">
              <Link to="/" className="hover:opacity-70">Home</Link>
              <span className="mx-2 opacity-60">/</span>
              <Link to={`/colecao/${product.collection}`} className="hover:opacity-70">
                {collectionLabel[product.collection] ?? "Coleção"}
              </Link>
              <span className="mx-2 opacity-60">/</span>
              <span className="opacity-80">{categoryLabel[product.category]}</span>
            </nav>

            <h1 className="font-display text-4xl md:text-5xl font-medium leading-[1.1] mb-4">
              {product.name}
            </h1>

            <p className="text-ink/70 leading-relaxed mb-6 text-[0.95rem] font-light">
              {product.tagline}
            </p>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              {compareTotal > total && (
                <span className="text-sm text-ink/30 line-through font-light tabular-nums">
                  {formatBRL(compareTotal)}
                </span>
              )}
              <span className="text-2xl font-light tabular-nums">{formatBRL(total)}</span>
              <span className="text-[0.65rem] text-terracotta font-semibold tracking-wide bg-cream px-2 py-1 border border-terracotta uppercase">
                {formatBRL(pixPrice)} no PIX · 5% OFF
              </span>
            </div>

            <div className="w-full h-px bg-border mb-8" />

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <span className="text-[11px] uppercase tracking-widest block mb-4 font-semibold text-ink/60">
                  {product.category === "caixa" ? "Tamanho" : "Acabamento"}
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      className={cn(
                        "px-6 py-2 border text-[13px] transition-all",
                        v.id === variantId
                          ? "border-ink bg-ink text-cream"
                          : "border-border text-ink hover:border-ink",
                      )}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border bg-white/50">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-cream transition-colors"
                    aria-label="Diminuir"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center text-sm font-semibold tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-cream transition-colors"
                    aria-label="Aumentar"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleBuy}
                  className="flex-1 h-12 bg-terracotta text-cream text-[13px] uppercase tracking-[0.2em] font-semibold hover:brightness-110 transition-all"
                >
                  Adicionar à Sacola
                </button>
              </div>
              <button
                onClick={handleBuy}
                className="w-full h-12 border border-ink text-ink text-[13px] uppercase tracking-[0.2em] font-semibold hover:bg-ink hover:text-cream transition-all"
              >
                Comprar Agora
              </button>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 gap-4 mb-10 py-4 border-y border-border/60">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-terracotta" strokeWidth={1} />
                <span className="text-[11px] uppercase tracking-wider font-medium">Entrega Segura</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-terracotta" strokeWidth={1} />
                <span className="text-[11px] uppercase tracking-wider font-medium">Troca 7 dias</span>
              </div>
            </div>

            {/* Accordion */}
            <div>
              <details className="group border-b border-border py-4" open>
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-[13px] uppercase tracking-widest font-semibold">Detalhes do Produto</span>
                  <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform duration-300 text-ink/60" />
                </summary>
                <div className="pt-4 text-[14px] leading-relaxed text-ink/70 font-light">
                  <p className="mb-3">{product.description}</p>
                  {product.highlights.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 opacity-80">
                      {product.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>

              <details className="group border-b border-border py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-[13px] uppercase tracking-widest font-semibold">Envio e Devolução</span>
                  <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform duration-300 text-ink/60" />
                </summary>
                <div className="pt-4 text-[14px] leading-relaxed text-ink/70 font-light">
                  Frete calculado no checkout. Enviamos com embalagem protetora para todo o Brasil. Trocas em até 7 dias após o recebimento.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 md:py-24 px-5 md:px-8 bg-secondary/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="eyebrow mb-3">Combina com</p>
              <h2 className="font-display text-2xl md:text-4xl">Outras peças da coleção</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 md:gap-x-8">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
      <WhatsAppFloat />
    </main>
  );
};

export default Product;
