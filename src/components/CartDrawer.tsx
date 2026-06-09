import { useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, Loader2, ExternalLink } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL } from "@/lib/yampi";

export const CartDrawer = () => {
  const { items, isLoading, isSyncing, isOpen, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Carrinho"
          className="relative p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ShoppingBag className="w-5 h-5 text-ink" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-terracotta text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-cream">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-ink">Seu carrinho</SheetTitle>
          <SheetDescription className="text-xs uppercase tracking-[0.25em] text-ink/60">
            {totalItems === 0 ? "Vazio" : `${totalItems} ite${totalItems !== 1 ? "ns" : "m"}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <ShoppingBag className="w-10 h-10 text-ink/30 mx-auto mb-3" />
                <p className="text-sm text-ink/60">Adicione peças para compor seu pedido.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 pb-4 border-b border-border">
                    <div className="w-20 h-20 bg-secondary overflow-hidden flex-shrink-0">
                      {item.productImage && (
                        <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-base text-ink leading-tight">{item.productTitle}</h4>
                      <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink/60 mt-1">
                        {item.variantTitle}
                      </p>
                      <p className="text-sm text-terracotta font-medium mt-1">
                        {formatBRL(parseFloat(item.price.amount) * item.quantity)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-7 h-7 border border-border flex items-center justify-center hover:bg-secondary"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-7 h-7 border border-border flex items-center justify-center hover:bg-secondary"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          aria-label="Remover"
                          className="ml-auto p-1 text-ink/50 hover:text-terracotta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[0.7rem] uppercase tracking-[0.25em] text-ink/70">Total</span>
                  <span className="font-display text-2xl text-ink">{formatBRL(totalPrice)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || isSyncing}
                  className="w-full bg-ink text-cream py-4 text-[0.7rem] uppercase tracking-[0.3em] hover:bg-ink/85 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" /> Finalizar compra
                    </>
                  )}
                </button>
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-ink/50 text-center">
                  Compra segura · SSL
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
