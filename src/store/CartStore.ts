import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/products";
import { getDiscountedPrice } from "@/lib/api/products";

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

interface CartStore {
  items: CartItem[];

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  // Computed helpers (called as functions)
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const existing = get().items.find(
          (item) => item.product.id === product.id,
        );

        const unitPrice = getDiscountedPrice(
          product.price,
          product.discountPercentage,
        );

        if (existing) {
          // Increment quantity, respect stock limit
          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + 1, product.stock),
                  }
                : item,
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { product, quantity: 1, unitPrice }],
          }));
        }
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.min(quantity, item.product.stock),
                }
              : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return parseFloat(
          get()
            .items.reduce(
              (sum, item) => sum + item.unitPrice * item.quantity,
              0,
            )
            .toFixed(2),
        );
      },
    }),
    {
      name: "shopwave-cart", // localStorage key
    },
  ),
);
