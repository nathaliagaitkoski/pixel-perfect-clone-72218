import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Check, Minus, Plus, Truck, RotateCcw, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/yampi";
import { MarqueeBar } from "@/components/MarqueeBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, getProductsByCollection } from "@/data/products";

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

  // Caso especial: as caixas redirecionam pra LP real
  if (product.redirectTo) {
    return <Navigate to={product.redirectTo} replace />;
  }

  const selectedVariant =
    product.variants?.find((v) => v.id === variantId) ?? product.variants?.[0];
  const unitPrice = selectedVariant?.price ?? product.price;
  const unitCompare = selectedVariant?.compareAt ?? product.compareAt ?? 0;
  const total = unitPrice * qty;
  const compareTotal = unitCompare * qty;
  const pixPrice = total * 0.95;
  const discountPct = unitCompare > unitPrice
    ? Math.round(((unitCompare - unitPrice) / unitCompare) * 100)
    : 0;

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

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-6">
        <Link
          to="/colecao/sol-da-manha"
          className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-ink/60 hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Coleção Sol da Manhã
        </Link>
      </div>

      {/* PDP */}
      <section className="py-8 md:py-14 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="bg-secondary aspect-square overflow-hidden">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 md:gap-3 mt-3">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "aspect-square overflow-hidden border transition-all",
                      activeImg === i
                        ? "border-terracotta"
                        : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            <div className="flex items-center gap-2 mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-terracotta font-medium">
              <span className="inline-block w-6 h-px bg-terracotta" /> {product.tagline}
            </div>

            <h1 className="font-display text-3xl md:text-5xl leading-[1.1] mb-4">
              {product.name}
            </h1>

            <p className="text-ink/75 leading-relaxed mb-6 text-[0.95rem]">
              {product.description}
            </p>

            {/* Preço */}
            <div className="mb-6 space-y-2">
              {compareTotal > total && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground/70 uppercase tracking-[0.2em] text-[0.6rem]">De</span>
                  <span className="text-muted-foreground line-through">{formatBRL(compareTotal)}</span>
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
            </div>

            {/* Variações */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <span className="text-[0.7rem] uppercase tracking-[0.25em] text-ink/70 font-medium mb-3 block">
                  Opção: <span className="text-ink">{selectedVariant?.label}</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      className={cn(
                        "border px-4 py-3 text-sm transition-all",
                        v.id === variantId
                          ? "border-terracotta bg-terracotta/5 text-terracotta"
                          : "border-border hover:border-ink/40",
                      )}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade */}
            <div className="mb-6">
              <span className="text-[0.7rem] uppercase tracking-[0.25em] text-ink/70 font-medium mb-3 block">
                Quantidade
              </span>
              <div className="inline-flex items-center border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                  aria-label="Diminuir"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-base font-medium tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="p-3 hover:bg-secondary transition-colors"
                  aria-label="Aumentar"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleBuy}
                className="w-full bg-ink text-cream py-4 text-sm uppercase tracking-[0.3em] font-medium hover:bg-terracotta transition-colors"
              >
                Comprar agora
              </button>
              <button
                onClick={handleBuy}
                className="w-full border border-ink text-ink py-4 text-sm uppercase tracking-[0.3em] font-medium hover:bg-ink hover:text-cream transition-colors"
              >
                Adicionar ao carrinho
              </button>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 py-5 border-y border-border text-center">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-4 h-4 text-terracotta" />
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink/70">Frete grátis</p>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-terracotta" />
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink/70">7 dias troca</p>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Lock className="w-4 h-4 text-terracotta" />
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink/70">Compra segura</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-8">
              <p className="eyebrow mb-4">Detalhes</p>
              <ul className="space-y-3">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-ink/80">
                    <Check className="w-4 h-4 text-terracotta mt-0.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Outras peças da coleção */}
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
