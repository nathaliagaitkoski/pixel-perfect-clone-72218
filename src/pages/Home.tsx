import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroColecao1 from "@/assets/hero-colecao-1.png.asset.json";
import heroColecao2 from "@/assets/hero-colecao-2.png.asset.json";
import heroColecao3 from "@/assets/hero-colecao-3.png.asset.json";
import founderImg from "@/assets/founder.png";
import { cn } from "@/lib/utils";
import { MarqueeBar } from "@/components/MarqueeBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { LeadBanner } from "@/components/LeadBanner";
import { COLLECTIONS } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";

const HERO_SLIDES = [heroColecao1.url, heroColecao2.url, heroColecao3.url];

const Home = () => {
  const [heroSlide, setHeroSlide] = useState(0);

  const collection = COLLECTIONS[0];
  const products = getProductsByCollection(collection.slug);

  useEffect(() => {
    const t = setInterval(
      () => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  const scrollToCollection = () =>
    document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="bg-cream text-ink overflow-x-hidden">
      <MarqueeBar />
      <SiteHeader />

      {/* HERO split 50/50 */}
      <section className="bg-cream">
        <div className="grid md:grid-cols-2 min-h-[80vh] md:min-h-[85vh]">
          {/* Bloco de texto */}
          <div className="order-2 md:order-1 flex flex-col justify-center bg-[#5a3524] text-cream px-6 py-14 md:px-16 md:py-20 lg:px-24">
            <span className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.4em] text-cream/80 mb-5 md:mb-6">
              Coleção Sol da Manhã
            </span>
            <h1 className="font-display leading-[0.95] mb-6 md:mb-8">
              <span className="block text-4xl md:text-5xl lg:text-6xl">nova</span>
              <span className="block italic text-6xl md:text-7xl lg:text-[6.5rem] text-[#e8c9a0]">
                coleção
              </span>
            </h1>
            <p className="text-cream/85 leading-relaxed text-[0.95rem] md:text-base max-w-md mb-8 md:mb-10">
              Uma composição que reúne madeira natural, couro, vidro e detalhes dourados
              para criar ambientes acolhedores, sofisticados e atemporais.
            </p>
            <button
              type="button"
              onClick={scrollToCollection}
              className="self-start inline-flex items-center gap-3 bg-cream text-ink px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.3em] font-medium hover:bg-[#e8c9a0] transition-colors"
            >
              Comprar a coleção <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2 mt-10 md:mt-14">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={cn(
                    "h-1 transition-all cursor-pointer",
                    i === heroSlide ? "w-10 bg-cream" : "w-4 bg-cream/30 hover:bg-cream/50",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Bloco de imagem */}
          <div className="order-1 md:order-2 relative min-h-[55vh] md:min-h-full overflow-hidden bg-ink">
            {HERO_SLIDES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
                  i === heroSlide ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </div>
      </section>


      {/* Coleção Sol da Manhã */}
      <section id="colecao" className="py-16 md:py-24 px-5 md:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <div className="flex items-center gap-2 justify-center mb-4 text-[0.65rem] uppercase tracking-[0.3em] text-terracotta font-medium">
              <span className="inline-block w-6 h-px bg-terracotta" />
              {collection.tagline}
              <span className="inline-block w-6 h-px bg-terracotta" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05] mb-5">
              Coleção <span className="italic">{collection.name}</span>
            </h2>
            <p className="text-ink/70 leading-relaxed text-[0.95rem]">
              {collection.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-14">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          <div className="mt-12 md:mt-16 text-center">
            <Link
              to={`/colecao/${collection.slug}`}
              className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-ink hover:text-terracotta transition-colors font-medium border-b border-ink/40 hover:border-terracotta pb-1"
            >
              Conhecer a coleção completa <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre a marca */}
      <section className="py-16 md:py-24 px-5 md:px-8 bg-secondary/40">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-secondary">
            <img src={founderImg} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <p className="eyebrow mb-4">Pientro Casa</p>
            <h2 className="font-display text-3xl md:text-4xl leading-[1.1] mb-5">
              Curadoria com <span className="italic">olhar de arquiteta</span>
            </h2>
            <p className="text-ink/75 leading-relaxed mb-4 text-[0.95rem]">
              A Pientro Casa nasce da vontade de levar pra casas reais o cuidado de composição
              que arquitetos passam horas montando. Cada coleção é pensada como um conjunto —
              peças que conversam entre si e elevam o ambiente sem complicação.
            </p>
            <p className="text-ink/75 leading-relaxed text-[0.95rem]">
              Sem fragilidade, sem peças que ficam intocáveis. Beleza que se usa, todos os dias.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
      <LeadBanner />
    </main>
  );
};

export default Home;
