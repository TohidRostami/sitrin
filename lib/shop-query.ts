import type { ProductSort } from "@/lib/queries/products";

export type ShopSearchParams = {
  category?: string;
  sizes?: string; // comma-separated size names
  min?: string;
  max?: string;
  sort?: string;
  page?: string;
};

export function parseShopFilters(sp: ShopSearchParams) {
  return {
    categorySlug: sp.category || undefined,
    sizeNames: sp.sizes ? sp.sizes.split(",").filter(Boolean) : [],
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sort: (sp.sort as ProductSort) || "newest",
    page: sp.page ? Number(sp.page) : 1,
  };
}

/** merges the given overrides into the current params and returns a "/shop?..." href. صفحه‌بندی همیشه ریست می‌شود مگر خودِ page override شده باشد. */
export function buildShopHref(current: ShopSearchParams, overrides: Partial<ShopSearchParams>) {
  const next: Record<string, string> = { ...current, ...overrides } as Record<string, string>;
  if (!("page" in overrides)) delete next.page;

  Object.keys(next).forEach((key) => {
    if (!next[key]) delete next[key];
  });

  const qs = new URLSearchParams(next).toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function toggleSize(current: string[], size: string): string[] {
  return current.includes(size) ? current.filter((s) => s !== size) : [...current, size];
}
