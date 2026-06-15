import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";
import hero4 from "@/assets/hero-4.png";
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

const HERO_VIDEO = "/video/hero.mp4";
const HERO_SLIDES = [hero1, hero2, hero3, hero4];
const HERO_TOTAL = HERO_SLIDES.length + 1;

const Home = () => {
  const [heroSlide, setHeroSlide] = useState(0);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const collection = COLLECTIONS[0];
  const products = getProductsByCollection(collection.slug);

  useEffect(() => {
    if (heroSlide === 0) return;
    const t = setInterval(
      () => setHeroSlide((s) => (s === 0 ? 0 : ((s - 1 + 1) % HERO_SLIDES.length) + 1)),
      5000,
    );
    return () => clearInterval(t);
  }, [heroSlide]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (heroSlide === 0) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [heroSlide]);

  const scrollToCollection = () =>
    document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="bg-cream text-ink overflow-x-hidden">
      <MarqueeBar />
      <SiteHeader />

      {/* HERO cinematográfico */}
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
              if (video && heroSlide === 0) video.play().catch(() => {});
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
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/70 z-20 pointer-events-none" />

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
              onClick={scrollToCollection}
              className="cursor-pointer text-cream text-[0.42rem] md:text-[0.49rem] uppercase tracking-[0.32em] font-medium underline underline-offset-[4px] decoration-1 hover:decoration-2 transition-all pointer-events-auto"
            >
              Ver coleção
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
