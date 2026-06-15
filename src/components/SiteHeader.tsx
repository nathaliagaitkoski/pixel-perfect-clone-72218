import { Link } from "react-router-dom";
import { User } from "lucide-react";
import logoPientro from "@/assets/logo-pientro.png";
import { CartDrawer } from "@/components/CartDrawer";

export const SiteHeader = () => (
  <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-border">
    <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
      <Link to="/" aria-label="Pientro Casa" className="flex items-center">
        <img src={logoPientro} alt="Pientro Casa" className="h-6 md:h-8 w-auto object-contain" />
      </Link>
      <nav className="hidden md:flex items-center gap-7 text-[0.7rem] uppercase tracking-[0.28em] text-ink/70">
        <Link to="/" className="hover:text-terracotta transition-colors">Início</Link>
        <Link to="/colecao/sol-da-manha" className="hover:text-terracotta transition-colors">
          Coleção
        </Link>
      </nav>
      <div className="flex items-center gap-2 md:gap-4">
        <button
          aria-label="Minha conta"
          className="p-2 hover:bg-secondary rounded-full transition-colors"
          onClick={() => {
            localStorage.removeItem("pientro:lead-dismissed");
            window.dispatchEvent(new Event("pientro:open-account"));
          }}
        >
          <User className="w-5 h-5 text-ink" />
        </button>
        <CartDrawer />
      </div>
    </div>
  </header>
);
