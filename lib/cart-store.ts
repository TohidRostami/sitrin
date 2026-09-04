"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * سبد خرید سمت کلاینت (مهمان یا کاربر وارد‌شده) — در localStorage نگه‌داشته
 * می‌شود. قیمت و موجودی واقعی هیچ‌وقت از این store خوانده نمی‌شود؛ فقط برای
 * نمایش سریع در UI است. لحظه‌ی ثبت سفارش (lib/actions/checkout.ts)، سرور
 * دوباره از دیتابیس قیمت و موجودی واقعی هر variantId را می‌خواند.
 */
export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  discountCode: string | null;
  setDiscountCode: (code: string | null) => void;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  increment: (variantId: string) => void;
  decrement: (variantId: string) => void;
  clear: () => void;
  subtotal: () => number;
  totalQuantity: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      setDiscountCode: (code) => set({ discountCode: code }),

      add: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, existing.maxStock || 99);
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: nextQty } : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(quantity, item.maxStock || 99) }],
          };
        });
      },

      remove: (variantId) => {
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) }));
      },

      setQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.variantId === variantId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock || 99)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        }));
      },

      increment: (variantId) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (item) get().setQuantity(variantId, item.quantity + 1);
      },

      decrement: (variantId) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (item) get().setQuantity(variantId, item.quantity - 1);
      },

      clear: () => set({ items: [], discountCode: null }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "sitrin-cart" }
  )
);
