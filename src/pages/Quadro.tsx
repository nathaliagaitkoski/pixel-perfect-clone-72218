import { useState } from "react";
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
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";

const SLUG = "quadro-sol-da-manha";

const scrollToBuy = () =>
  document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth", block: "start" });

const Quadro = () => {
  const product = getProductBySlug(SLUG)!;
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // Preço único — sem promoção, sem De/Por, sem PIX extra.
  const unit = product.price;
  const total = unit * qty;

  const gallery = [product.images[0], hero2, hero3].filter(Boolean) as string[];

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

            {/* Preço único — sem desconto */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-5xl md:text-6xl text-terracotta leading-none tabular-nums">
                  {formatBRL(total)}
                </span>
              </div>
              <p className="text-[0.75rem] text-ink/60 mt-2">
                Ou em até 12× no cartão · pagamento no PIX, boleto e cartão.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6 text-[0.7rem] uppercase tracking-[0.2em] text-terracotta">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta" />
              </span>
              Edição limitada e numerada · Despacho em até 3 dias úteis
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

      {/* Detalhes do produto — 60% texto / 40% foto */}
      <section className="bg-cream">
        <div className="grid md:grid-cols-5 items-stretch">
          <div className="md:col-span-3 order-2 md:order-1 px-5 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-center">
            <span className="eyebrow mb-4 block">Ficha técnica</span>
            <h2 className="font-display text-3xl md:text-5xl mb-8 leading-tight">
              Detalhes do produto
            </h2>
            <div className="space-y-3 text-[0.95rem] text-ink/85 mb-10">
              <p><span className="font-semibold text-ink">Técnica:</span> Impressão fine art sobre papel algodão 310g/m²</p>
              <p><span className="font-semibold text-ink">Moldura:</span> Carvalho natural com acabamento fosco</p>
              <p><span className="font-semibold text-ink">Passepartout:</span> Cru, sem ácido</p>
              <p><span className="font-semibold text-ink">Vidro:</span> Antirreflexo</p>
              <p><span className="font-semibold text-ink">Dimensões:</span> 50 × 70 cm (moldura inclusa)</p>
              <p><span className="font-semibold text-ink">Edição:</span> Limitada e numerada · assinada em série</p>
            </div>
            <h3 className="font-display text-xl md:text-2xl text-terracotta mb-3">
              Descrição adicional
            </h3>
            <p className="text-ink/75 leading-relaxed text-[0.95rem]">
              Uma composição abstrata em terracota e dourado, pensada para dialogar com a coleção
              Sol da Manhã. Ideal como ponto focal em salas, halls e escritórios — traz calor,
              profundidade e uma leitura contemporânea a paredes neutras.
            </p>
          </div>
          <div className="md:col-span-2 order-1 md:order-2 bg-secondary">
            <img
              src={product.images[0]}
              alt="Quadro Sol da Manhã — detalhes"
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
              alt="Quadro em uso na composição"
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
              Limpar o vidro apenas com pano seco de microfibra. Evitar produtos químicos e água
              em excesso. Não expor à luz solar direta para preservar a fidelidade das cores da
              impressão fine art.
            </p>

            <h3 className="font-display text-xl md:text-2xl text-terracotta mb-3">
              Recomendações de uso
            </h3>
            <p className="text-ink/75 leading-relaxed text-[0.95rem] mb-8">
              Ideal para sala de estar, hall de entrada, escritório e quarto. Combine com peças
              da coleção Sol da Manhã ou use como ponto focal em paredes neutras.
            </p>

            <h3 className="font-display text-xl md:text-2xl text-terracotta mb-3">
              Encante-se
            </h3>
            <p className="text-ink/75 leading-relaxed text-[0.95rem]">
              Uma peça de edição limitada, numerada e assinada em série — pensada para carregar
              a mesma linguagem editorial da coleção Sol da Manhã em uma parede.
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
            Uma parede
            <br />
            <span className="italic">que conta uma história.</span>
          </h2>
          <p className="text-cream/75 mb-8 max-w-lg mx-auto">
            Edição limitada e numerada. Despacho em até 3 dias úteis.
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

export default Quadro;
