import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getYampiAlias } from "@/lib/yampi";

type Mode = "signup" | "account";

const getAccountUrl = () => {
  const alias = getYampiAlias();
  return alias ? `https://seguro.${alias}.com.br/account` : "#";
};

export const LeadBanner = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signup");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!localStorage.getItem("pientro:lead-dismissed")) {
      const t = setTimeout(() => setOpen(true), 12000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setMode("account");
      setOpen(true);
    };
    window.addEventListener("pientro:open-account", handler);
    return () => window.removeEventListener("pientro:open-account", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem("pientro:lead-dismissed", "1");
    setOpen(false);
  };

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        source: "lead_banner",
      });
      if (error && error.code !== "23505") throw error;
      toast.success("Cadastro confirmado ✨", {
        description: "Você entrou na nossa lista. Em breve, novidades exclusivas.",
      });
      dismiss();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível concluir. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed bottom-24 sm:bottom-5 left-5 right-5 sm:right-auto z-40 sm:max-w-sm bg-cream border border-border shadow-xl p-5">
      <button
        onClick={dismiss}
        aria-label="Fechar"
        className="absolute top-2 right-2 p-1 hover:bg-secondary"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="eyebrow mb-2">Pientro Casa</p>

      {mode === "signup" ? (
        <>
          <h3 className="font-display text-xl text-ink mb-1 leading-tight">
            Entre para a lista Pientro.
          </h3>
          <p className="text-sm text-ink/70 mb-4">
            Receba lançamentos, edições limitadas e inspirações para viver a sua casa com propósito.
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              required
              value={form.name}
              onChange={update("name")}
              placeholder="Nome"
              className="w-full border border-border bg-cream px-3 py-2 text-sm focus:outline-none focus:border-terracotta"
            />
            <input
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="seu@email.com"
              className="w-full border border-border bg-cream px-3 py-2 text-sm focus:outline-none focus:border-terracotta"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              placeholder="WhatsApp (opcional)"
              className="w-full border border-border bg-cream px-3 py-2 text-sm focus:outline-none focus:border-terracotta"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-cream py-2.5 text-[0.7rem] uppercase tracking-[0.3em] font-medium hover:bg-[hsl(var(--terracotta-soft))] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Quero receber"}
            </button>
          </form>

          <button
            onClick={() => setMode("account")}
            className="mt-3 text-xs text-ink/60 hover:text-terracotta transition-colors w-full text-center"
          >
            Já é cliente? Acompanhar pedidos
          </button>
        </>
      ) : (
        <>
          <h3 className="font-display text-xl text-ink mb-1 leading-tight">
            Acompanhe seus pedidos
          </h3>
          <p className="text-sm text-ink/70 mb-4">
            Sua conta e o histórico de pedidos ficam no nosso sistema seguro. Acesse com o e-mail usado na compra.
          </p>
          <a
            href={getAccountUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full bg-terracotta text-cream py-2.5 text-[0.7rem] uppercase tracking-[0.3em] font-medium hover:bg-[hsl(var(--terracotta-soft))] transition-colors"
          >
            Acessar minha conta
          </a>
          <p className="text-[0.65rem] text-ink/55 mt-3 leading-relaxed">
            Você receberá um link de acesso por e-mail — sem necessidade de senha.
          </p>
          <button
            onClick={() => setMode("signup")}
            className="mt-3 text-xs text-ink/60 hover:text-terracotta transition-colors w-full text-center"
          >
            Entrar para a lista Pientro
          </button>
        </>
      )}
    </div>
  );
};
