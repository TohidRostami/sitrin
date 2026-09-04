"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * علاقه‌مندی‌ها فعلاً فقط سمت مرورگر (localStorage) نگه‌داری می‌شود، چون
 * schema.prisma فعلاً مدلی برای Wishlist ندارد. اگر بعداً لازم شد بین
 * دستگاه‌ها سینک شود، باید یک مدل جدید (مثلاً FavoriteProduct با رابطه به
 * User) به schema اضافه و این store با API واقعی جایگزین شود.
 */
export type FavoriteItem = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
};

type FavoritesState = {
  items: FavoriteItem[];
  toggle: (item: FavoriteItem) => void;
  isFavorite: (productId: string) => boolean;
  remove: (productId: string) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          return {
            items: exists
              ? state.items.filter((i) => i.productId !== item.productId)
              : [...state.items, item],
          };
        });
      },
      isFavorite: (productId) => get().items.some((i) => i.productId === productId),
      remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
    }),
    { name: "sitrin-favorites" }
  )
);
