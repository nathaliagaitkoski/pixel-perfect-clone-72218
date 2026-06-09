import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logoPientro from "@/assets/logo-pientro.png";

interface PolicyPageProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export const PolicyPage = ({ title, updatedAt, children }: PolicyPageProps) => {
  useEffect(() => {
    document.title = `${title} · Pientro Casa`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <main className="bg-cream text-ink min-h-screen">
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" aria-label="Pientro Casa" className="flex items-center">
            <img src={logoPientro} alt="Pientro Casa" className="h-6 md:h-8 w-auto object-contain" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-ink/70 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-terracotta font-medium mb-3">
          Pientro Casa
        </p>
        <h1 className="font-display text-3xl md:text-5xl leading-tight mb-3">{title}</h1>
        <p className="text-sm text-ink/60 mb-10">Última atualização: {updatedAt}</p>

        <div className="prose-policy space-y-5 text-[0.95rem] leading-relaxed text-ink/85">
          {children}
        </div>

        <div className="mt-14 pt-8 border-t border-border text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-terracotta hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a loja
          </Link>
        </div>
      </article>
    </main>
  );
};

export const PSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section>
    <h2 className="font-display text-xl md:text-2xl text-ink mt-8 mb-3">{title}</h2>
    <div className="space-y-3">{children}</div>
  </section>
);

export const PList = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc pl-5 space-y-1.5 marker:text-terracotta">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);
