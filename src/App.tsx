import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Home from "./pages/Home.tsx";
import Collection from "./pages/Collection.tsx";
import Product from "./pages/Product.tsx";
import Quadro from "./pages/Quadro.tsx";
import Vaso from "./pages/Vaso.tsx";
import Lupa from "./pages/Lupa.tsx";
import NotFound from "./pages/NotFound.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import { useCartSync } from "@/hooks/useCartSync";
import { trackMeta } from "@/lib/metaPixel";

const queryClient = new QueryClient();

const AppShell = () => {
  useCartSync();
  const location = useLocation();
  useEffect(() => {
    trackMeta("PageView");
  }, [location.pathname]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/colecao/:slug" element={<Collection />} />
      <Route path="/produto/caixa-decorativa-terracota-e-dourado-de-luxo" element={<Index />} />
      <Route path="/produto/quadro-sol-da-manha" element={<Quadro />} />
      <Route path="/produto/vaso-medio-sol-da-manha" element={<Vaso slug="vaso-medio-sol-da-manha" />} />
      <Route path="/produto/vaso-baixo-sol-da-manha" element={<Vaso slug="vaso-baixo-sol-da-manha" />} />
      <Route path="/produto/lupa-polirresina-sol-da-manha" element={<Lupa slug="lupa-polirresina-sol-da-manha" />} />
      <Route path="/produto/:slug" element={<Product />} />
      <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
      <Route path="/termos-de-servico" element={<TermsOfService />} />
      <Route path="/politica-de-reembolso" element={<RefundPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
