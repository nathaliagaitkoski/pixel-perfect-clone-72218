import { Instagram, Youtube, Lock } from "lucide-react";
import { PaymentBadges } from "@/components/PaymentBadges";

export const SiteFooter = () => (
  <footer className="bg-cream border-t border-border pt-14 pb-8 px-5 md:px-8">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-14 mb-10">
      <div className="col-span-2 md:col-span-1">
        <p className="font-display text-2xl text-ink mb-2">
          Pientro <span className="text-terracotta tracking-[0.25em] text-base ml-1">Casa</span>
        </p>
        <p className="text-sm text-ink/70 max-w-xs leading-relaxed">
          Curadoria de decoração com olhar de arquiteta. Beleza que se usa.
        </p>
        <div className="flex gap-3 mt-5">
          <a
            href="https://instagram.com/pientrocasa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="p-2 border border-border hover:border-terracotta hover:text-terracotta transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com/@pientrocasa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="p-2 border border-border hover:border-terracotta hover:text-terracotta transition-colors"
          >
            <Youtube className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-ink/60 mb-4">Informações</p>
        <ul className="space-y-2 text-sm">
          <li><a href="/politica-de-privacidade" className="text-ink/80 hover:text-terracotta transition-colors">Política de privacidade</a></li>
          <li><a href="/termos-de-servico" className="text-ink/80 hover:text-terracotta transition-colors">Termos de serviço</a></li>
          <li><a href="/politica-de-reembolso" className="text-ink/80 hover:text-terracotta transition-colors">Política de reembolso</a></li>
        </ul>
      </div>

      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-ink/60 mb-4">Contato</p>
        <ul className="space-y-2 text-sm text-ink/80">
          <li><a href="mailto:contato@pientrocasa.com.br" className="hover:text-terracotta transition-colors break-all">contato@pientrocasa.com.br</a></li>
          <li><a href="https://wa.me/5545999893299" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">WhatsApp: (45) 99989-3299</a></li>
        </ul>
      </div>
    </div>

    <div className="max-w-7xl mx-auto border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground text-center md:text-left">
        © {new Date().getFullYear()} Pientro Casa LTDA · CNPJ 66.790.219/0001-40
      </p>
      <div className="flex items-center gap-3">
        <span className="text-[0.6rem] uppercase tracking-[0.25em] text-ink/50">Pagamento</span>
        <PaymentBadges />
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-4 flex items-center justify-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-ink/50">
      <Lock className="w-3 h-3" /> Compra 100% segura · SSL · Dados protegidos (LGPD)
    </div>
  </footer>
);
