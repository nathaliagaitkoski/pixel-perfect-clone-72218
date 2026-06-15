import { Link } from "react-router-dom";
import type { MockProduct } from "@/data/products";
import { formatBRL } from "@/lib/yampi";

interface Props {
  product: MockProduct;
}

export const ProductCard = ({ product }: Props) => {
  const to = product.redirectTo ?? `/produto/${product.slug}`;
  return (
    <Link
      to={to}
      className="group block"
      aria-label={product.name}
    >
      <div className="bg-secondary aspect-[4/5] overflow-hidden mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="px-1">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-terracotta mb-1.5">
          {product.category === "caixa"
            ? "Caixa decorativa"
            : product.category === "vaso"
              ? "Vaso"
              : product.category === "quadro"
                ? "Quadro"
                : "Objeto"}
        </p>
        <h3 className="font-display text-xl md:text-2xl text-ink leading-tight mb-1.5 group-hover:text-terracotta transition-colors">
          {product.shortName}
        </h3>
        <p className="text-[0.8rem] text-ink/60 leading-relaxed mb-3 line-clamp-2">
          {product.tagline}
        </p>
        <div className="flex items-baseline gap-2">
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-xs text-ink/40 line-through tabular-nums">
              {formatBRL(product.compareAt)}
            </span>
          )}
          <span className="text-base font-medium text-ink tabular-nums">
            {formatBRL(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
};
