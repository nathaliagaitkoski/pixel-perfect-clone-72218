import { Navigate, useParams } from "react-router-dom";
import { MarqueeBar } from "@/components/MarqueeBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { getCollectionBySlug } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";

const Collection = () => {
  const { slug = "" } = useParams();
  const collection = getCollectionBySlug(slug);
  if (!collection) return <Navigate to="/" replace />;
  const products = getProductsByCollection(collection.slug);

  return (
    <main className="bg-cream text-ink overflow-x-hidden">
      <MarqueeBar />
      <SiteHeader />

      {/* Hero da coleção */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-ink">
        <img
          src={collection.heroImage}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/10 to-ink/70" />
        <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-6 pb-14 md:pb-20">
          <span className="text-[0.5rem] uppercase tracking-[0.4em] text-cream/90 mb-3">
            {collection.tagline}
          </span>
          <h1 className="font-display text-cream text-3xl md:text-5xl lg:text-6xl leading-[1.05] max-w-3xl">
            Coleção <span className="italic">{collection.name}</span>
          </h1>
        </div>
      </section>

      {/* Texto editorial */}
      <section className="py-14 md:py-20 px-5 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-ink/75 leading-relaxed text-[0.95rem] md:text-base">
            {collection.longDescription}
          </p>
        </div>
      </section>

      {/* Grid de produtos */}
      <section className="pb-20 md:pb-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display text-2xl md:text-3xl">As peças</h2>
            <span className="text-[0.7rem] uppercase tracking-[0.3em] text-ink/60">
              {products.length} peças
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-14">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
    </main>
  );
};

export default Collection;
