import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { buildYampiCheckoutUrl, getYampiAlias } from "@/lib/yampi";

export interface CartItem {
  lineId: string | null;
  productId: string;
  productTitle: string;
  productImage: string;
  productHandle: string;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
  checkoutUrl?: string | null;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),

      addItem: async (item) => {
        set({ isLoading: true });
        try {
          const items = get().items;
          const existing = items.find((i) => i.variantId === item.variantId);
          const next = existing
            ? items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i,
              )
            : [...items, { ...item, lineId: null }];
          set({ items: next, isOpen: true });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        set({
          items: get().items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        });
      },

      removeItem: async (variantId) => {
        const next = get().items.filter((i) => i.variantId !== variantId);
        set({ items: next });
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),

      // Yampi checkout is URL-based — build it on demand from current local cart.
      getCheckoutUrl: () => {
        const items = get().items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
          checkoutUrl: i.checkoutUrl,
        }));
        return buildYampiCheckoutUrl(items, getYampiAlias() ?? undefined);
      },

      // No server-side cart to sync — no-op (kept for API compat with useCartSync).
      syncCart: async () => {},
    }),
    {
      name: "yampi-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
