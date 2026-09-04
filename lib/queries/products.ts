import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/db";

export const PAGE_SIZE = 12;

export type ProductSort = "newest" | "price-asc" | "price-desc" | "featured";

export type ProductListFilters = {
  categorySlug?: string;
  sizeNames?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  page?: number;
  search?: string;
};

/** بج‌های روی کارت محصول — فقط از سیگنال‌های واقعی دیتابیس مشتق می‌شود
 * (isNew / compareAtPrice / isFeatured)؛ چیزی مثل «نسخه محدود» در schema
 * وجود ندارد، پس اینجا تولید نمی‌شود. */
export function productTag(p: { isNew: boolean; isFeatured: boolean; price: number; compareAtPrice: number | null }) {
  if (p.compareAtPrice && p.compareAtPrice > p.price) {
    const pct = Math.round((1 - p.price / p.compareAtPrice) * 100);
    return { label: `٪${pct} تخفیف`, kind: "discount" as const };
  }
  if (p.isNew) return { label: "جدید", kind: "new" as const };
  if (p.isFeatured) return { label: "پرفروش", kind: "featured" as const };
  return null;
}

const cardSelect = {
  id: true,
  slug: true,
  name: true,
  price: true,
  compareAtPrice: true,
  isNew: true,
  isFeatured: true,
  category: { select: { title: true, slug: true } },
  images: { orderBy: { sortOrder: "asc" as const }, take: 1, select: { url: true, alt: true } },
} satisfies Prisma.ProductSelect;

export type ProductCardData = Prisma.ProductGetPayload<{ select: typeof cardSelect }>;

export async function listProducts(filters: ProductListFilters) {
  const page = Math.max(1, filters.page ?? 1);

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    isArchived: false,
  };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }
  if (filters.sizeNames?.length) {
    where.variants = { some: { size: { name: { in: filters.sizeNames } } } };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.search) {
    where.name = { contains: filters.search };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] = (() => {
    switch (filters.sort) {
      case "price-asc":
        return [{ price: "asc" }];
      case "price-desc":
        return [{ price: "desc" }];
      case "featured":
        return [{ isFeatured: "desc" }, { createdAt: "desc" }];
      default:
        return [{ createdAt: "desc" }];
    }
  })();

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      select: cardSelect,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function listFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isPublished: true, isArchived: false, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: cardSelect,
  });
}

export async function listAllSizes() {
  return prisma.size.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, isPublished: true, isArchived: false },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: { orderBy: { sortOrder: "asc" } },
      variants: { include: { size: true, color: true } },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!product) return null;

  const ratingCount = product.reviews.length;
  const ratingAverage = ratingCount
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
    : 0;

  // سایزهای موجود روی این محصول، صرف‌نظر از رنگ — برای نمایش دکمه‌های سایز.
  const sizeMap = new Map<string, { id: string; name: string; inStock: boolean }>();
  for (const v of product.variants) {
    if (!v.size || sizeMap.has(v.size.id)) continue;
    const inStock = product.variants.some((vv) => vv.sizeId === v.sizeId && vv.stock > 0);
    sizeMap.set(v.size.id, { id: v.size.id, name: v.size.name, inStock });
  }
  const sizeOptions = Array.from(sizeMap.values()).sort((a, b) => a.name.localeCompare(b.name, "fa"));

  return { ...product, ratingCount, ratingAverage, sizeOptions };
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 4) {
  return prisma.product.findMany({
    where: {
      categoryId,
      isPublished: true,
      isArchived: false,
      id: { not: excludeProductId },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: cardSelect,
  });
}

export async function findVariant(productId: string, sizeId: string | null, colorId: string | null) {
  return prisma.productVariant.findFirst({
    where: { productId, sizeId: sizeId ?? null, colorId: colorId ?? null },
  });
}
