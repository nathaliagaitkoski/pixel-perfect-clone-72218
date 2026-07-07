import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Check, Truck, RotateCcw, Lock, CreditCard, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { MarqueeBar } from "@/components/MarqueeBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ProductCard } from "@/components/ProductCard";
import { PaymentBadges } from "@/components/PaymentBadges";
import { formatBRL } from "@/lib/yampi";
import { cn } from "@/lib/utils";
import { getProductBySlug, getProductsByCollection } from "@/data/products";
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";

const scrollToBuy = () =>
  document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Ficha técnica por slug (mock — trocar por dados reais depois). */
const SPECS: Record<string, { dimensoes: string; capacidade: string; peso: string }> = {
  "vaso-medio-sol-da-manha": {
    dimensoes: "21 × 17 × 17 cm (A × L × Ø)",
    capacidade: "Aprox. 2,3 L",
    peso: "Aprox. 950 g",
  },
  "vaso-baixo-sol-da-manha": {
    dimensoes: "13 × 16,5 × 16,5 cm (A × L × Ø)",
    capacidade: "Aprox. 1,4 L",
    peso: "Aprox. 720 g",
  },
};

const Vaso = ({ slug: slugProp }: { slug?: string } = {}) => {
  const params = useParams();
  const slug = slugProp ?? params.slug ?? "";
  const product = getProductBySlug(slug);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setQty(1);
    setActiveImg(0);
  }, [slug]);

  if (!product || product.category !== "vaso") {
    return <Navigate to="/" replace />;
  }

  // Preço com desconto de lançamento (compareAt → price = 20% OFF já aplicado) + 5% no PIX
  const PIX_OFF = 0.05;
  const unit = product.price;
  const compare = product.compareAt ?? 0;
  const total = unit * qty;
  const compareTotal = compare * qty;
  const pixPrice = total * (1 - PIX_OFF);
  const savings = compareTotal - total;

  const specs = SPECS[slug] ?? SPECS["vaso-medio-sol-da-manha"];

  // Galeria — 1 foto real do produto + 2 lifestyle fictícias
  const gallery = [product.images[0], hero2, hero1, hero3].filter(Boolean) as string[];

  const related = getProductsByCollection("sol-da-manha")
    .filter((p) => p.slug !== product.slug && !p.redirectTo)
    .slice(0, 4);

  const handleBuy = () => {
    toast.info("Em breve disponível para compra", {
      description: "Esta peça ainda não está com checkout ativo.",
    });
  };

  return (
    <main className="bg-cream text-ink overflow-x-hidden">
      <MarqueeBar />
      <SiteHeader />

      {/* PDP */}
      <section id="comprar" className="py-12 md:py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="bg-secondary aspect-square overflow-hidden">
              <img
                src={gallery[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2 md:gap-3 mt-3">
                {gallery.map((g, i) => (
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
                    <img src={g} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            <div className="flex items-center gap-2 mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-terracotta font-medium">
              <span className="inline-block w-6 h-px bg-terracotta" /> Curadoria de arquiteta
            </div>

            <h1 className="font-display text-3xl md:text-5xl leading-[1.1] mb-4">
              {product.name}
            </h1>

            <p className="text-ink/75 leading-relaxed mb-6 text-[0.95rem]">
              {product.description}
            </p>

            {/* Preço — com desconto de lançamento (20% OFF) + PIX extra 5% */}
            <div className="mb-6 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                {compareTotal > total && (
                  <span className="text-ink/40 line-through text-lg tabular-nums">
                    {formatBRL(compareTotal)}
                  </span>
                )}
                <span className="text-muted-foreground uppercase tracking-[0.2em] text-[0.6rem] self-center">
                  Por
                </span>
                <span className="font-display text-5xl md:text-6xl text-terracotta leading-none tabular-nums">
                  {formatBRL(total)}
                </span>
                {savings > 0 && (
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] font-semibold bg-terracotta text-cream px-2 py-1">
                    Economize {formatBRL(savings)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-2 bg-terracotta/10 border border-terracotta/30 text-terracotta px-2.5 py-1 rounded-sm">
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] font-semibold">No PIX</span>
                  <span className="text-base font-medium tabular-nums">{formatBRL(pixPrice)}</span>
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] font-semibold opacity-80">
                    -5% extra
                  </span>
                </div>
              </div>
              <p className="text-[0.7rem] text-ink/55 leading-relaxed">
                Promoção de lançamento com 20% OFF · Pagando no PIX você ganha mais 5% à vista.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6 text-[0.7rem] uppercase tracking-[0.2em] text-terracotta">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta" />
              </span>
              Peça artesanal · Despacho em até 3 dias úteis
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-4 hover:bg-secondary transition-colors"
                  aria-label="Diminuir"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-4 hover:bg-secondary transition-colors"
                  aria-label="Aumentar"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={handleBuy}
                className="flex-1 bg-terracotta text-cream py-4 px-6 text-[0.78rem] uppercase tracking-[0.3em] font-medium hover:bg-[hsl(var(--terracotta-soft))] transition-colors"
              >
                Adicionar · {formatBRL(total)}
              </button>
            </div>

            <button
              onClick={handleBuy}
              className="w-full bg-ink text-cream py-4 px-6 text-[0.78rem] uppercase tracking-[0.3em] font-medium hover:bg-ink/85 transition-colors"
            >
              Comprar agora
            </button>

            {/* Pagamento & Garantia — desktop only */}
            <div className="hidden lg:grid mt-5 grid-cols-2 gap-3">
              <div className="border border-border p-3.5 flex flex-col">
                <p className="text-[0.55rem] uppercase tracking-[0.22em] text-ink/55 mb-2">
                  Formas de pagamento
                </p>
                <PaymentBadges />
                <p className="text-[0.6rem] text-ink/55 mt-2 leading-relaxed">
                  Pix, boleto e cartões em até 12×.
                </p>
              </div>
              <div className="bg-secondary/60 border border-border p-3.5 flex gap-2 items-start">
                <RotateCcw className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-display text-sm text-ink leading-tight">Garantia · 7 dias</p>
                  <p className="text-[0.65rem] text-ink/65 mt-1 leading-relaxed">
                    Não amou? Devolva em até 7 dias e devolvemos seu dinheiro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bullets */}
        <div className="max-w-7xl mx-auto mt-10 md:mt-14 border-t border-border pt-6">
          <ul className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-x-6 gap-y-3 text-sm text-ink/80 text-left">
            {product.highlights.map((b) => (
              <li key={b} className="flex gap-2 items-start md:items-center">
                <Check className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5 md:mt-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust strip */}
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

        {/* Pagamento & Garantia — mobile */}
        <div className="lg:hidden max-w-4xl mx-auto mt-10 grid md:grid-cols-2 gap-4 md:gap-5">
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

      {/* Detalhes do produto — 60% texto / 40% foto */}
      <section className="bg-cream">
        <div className="grid md:grid-cols-5 items-stretch">
          <div className="md:col-span-3 order-2 md:order-1 px-5 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-center">
            <span className="eyebrow mb-4 block">Ficha técnica</span>
            <h2 className="font-display text-3xl md:text-5xl mb-8 leading-tight">
              Detalhes do produto
            </h2>
            <div className="space-y-3 text-[0.95rem] text-ink/85 mb-10">
              <p><span className="font-semibold text-ink">Material:</span> Vidro soprado transparente</p>
              <p><span className="font-semibold text-ink">Acabamento:</span> Borda em fio dourado aplicado à mão</p>
              <p><span className="font-semibold text-ink">Dimensões:</span> {specs.dimensoes}</p>
              <p><span className="font-semibold text-ink">Capacidade:</span> {specs.capacidade}</p>
              <p><span className="font-semibold text-ink">Peso:</span> {specs.peso}</p>
              <p><span className="font-semibold text-ink">Acabamento da base:</span> Plana, estável, para superfícies lisas</p>
              <p><span className="font-semibold text-ink">Origem:</span> Produção artesanal · peça única</p>
            </div>
            <h3 className="font-display text-xl md:text-2xl text-terracotta mb-3">
              Descrição adicional
            </h3>
            <p className="text-ink/75 leading-relaxed text-[0.95rem]">
              O vidro soprado à mão carrega pequenas variações de espessura e curvatura que dão
              caráter único a cada peça. O fio dourado na borda é aplicado manualmente — funciona
              como um contorno delicado que separa a transparência do ambiente ao redor. Uma peça
              que traz leveza para consoles, aparadores e mesas de centro, sozinha ou compondo
              dupla com o outro tamanho da coleção Sol da Manhã.
            </p>
          </div>
          <div className="md:col-span-2 order-1 md:order-2 bg-secondary">
            <img
              src={product.images[0]}
              alt={`${product.name} — detalhes`}
              loading="lazy"
              className="w-full h-full object-cover min-h-[60vh] md:min-h-full"
            />
          </div>
        </div>
      </section>

      {/* Cuidados — 60% foto / 40% texto */}
      <section className="bg-secondary">
        <div className="grid md:grid-cols-5 items-stretch">
          <div className="md:col-span-3 bg-cream">
            <img
              src={hero3}
              alt="Vaso em composição de ambiente"
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
              Limpe apenas com pano macio úmido e sabão neutro. Evite esponjas abrasivas,
              produtos químicos agressivos e mudanças bruscas de temperatura. Ao lavar
              internamente, seque com pano de microfibra para preservar a transparência do vidro.
              A borda em fio dourado é aplicada à mão — não esfregue diretamente sobre ela.
            </p>

            <h3 className="font-display text-xl md:text-2xl text-terracotta mb-3">
              Recomendações de uso
            </h3>
            <p className="text-ink/75 leading-relaxed text-[0.95rem] mb-8">
              Ideal para arranjos com flores frescas, galhos secos, pampas ou como objeto solo.
              Sobre consoles, mesas de centro, aparadores ou nichos. Combine o Vaso Médio com o
              Vaso Baixo para criar uma composição em dupla — o contraste de alturas dá ritmo ao
              conjunto.
            </p>

            <h3 className="font-display text-xl md:text-2xl text-terracotta mb-3">
              Encante-se
            </h3>
            <p className="text-ink/75 leading-relaxed text-[0.95rem]">
              Cada vaso é único — pequenas variações no vidro e no traço do dourado são a
              assinatura do processo artesanal. Uma peça pensada para atravessar tendências,
              feita para estar na sua casa por muitos anos.
            </p>
          </div>
        </div>
      </section>

      {/* Coleção — mais peças */}
      {related.length > 0 && (
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
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="bg-ink text-cream py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block w-12 h-px bg-cream/50 mb-6" />
          <h2 className="font-display text-3xl md:text-5xl mb-6 leading-tight">
            Um objeto simples
            <br />
            <span className="italic">que muda o ambiente.</span>
          </h2>
          <p className="text-cream/75 mb-8 max-w-lg mx-auto">
            Peça artesanal em vidro soprado. Despacho em até 3 dias úteis para todo o Brasil.
          </p>
          <button
            onClick={scrollToBuy}
            className="bg-terracotta text-cream px-10 py-4 text-[0.75rem] uppercase tracking-[0.3em] hover:bg-[hsl(var(--terracotta-soft))] transition-colors"
          >
            Comprar agora →
          </button>
          <p className="text-xs text-cream/50 mt-5 uppercase tracking-[0.25em]">
            Frete para todo o Brasil · 7 dias para troca · Compra segura
          </p>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
    </main>
  );
};

export default Vaso;
