import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { formatBRL } from "@/lib/yampi";

interface Props {
  productTitle: string;
  productImage?: string;
  price: number;
  variantTitle?: string;
  isAdding: boolean;
  available: boolean;
  onAdd: () => void;
}

export const StickyBuyBar = ({
  productTitle,
  productImage,
  price,
  variantTitle,
  isAdding,
  available,
  onAdd,
}: Props) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => {
      const buy = document.getElementById("comprar");
      if (!buy) return;
      const rect = buy.getBoundingClientRect();
      // mostra quando o bloco de compra sai da tela (passou do topo) e ainda não chegou no footer
      const footer = document.querySelector("footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
      const passedBuy = rect.bottom < 80;
      const notAtFooter = footerTop > window.innerHeight - 100;
      setShow(passedBuy && notAtFooter);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-cream/98 backdrop-blur border-t border-border shadow-[0_-8px_30px_-12px_rgba(51,39,27,0.18)] animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
        {productImage && (
          <img
            src={productImage}
            alt=""
            className="w-12 h-12 object-cover hidden sm:block flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm md:text-base text-ink leading-tight truncate">
            {productTitle}
          </p>
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ink/60 truncate">
            {variantTitle ?? ""} · <span className="text-terracotta font-medium">{formatBRL(price)}</span>
          </p>
        </div>
        <button
          onClick={onAdd}
          disabled={isAdding || !available}
          className="bg-terracotta text-cream px-5 md:px-8 py-3 text-[0.7rem] md:text-[0.75rem] uppercase tracking-[0.25em] font-medium hover:bg-[hsl(var(--terracotta-soft))] transition-colors disabled:opacity-60 flex items-center gap-2 flex-shrink-0"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Comprar"}
        </button>
      </div>
    </div>
  );
};
