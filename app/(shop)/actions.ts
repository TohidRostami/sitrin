"use server";

import { prisma } from "@/lib/db";
// import { searchProducts } from "@/lib/queries/products";
import type { ProductDTO } from "@/lib/types";

export async function searchProductsAction(
  query: string,
): Promise<ProductDTO[]> {
  return searchProducts(query);
}

async function searchProducts(
  query: string,
  take = 8,
): Promise<ProductDTO[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      OR: [
        { name: { contains: trimmed } },
        { description: { contains: trimmed } },
      ],
    },
    include: { category: true, images: true },
    take,
  });
  return products as unknown as ProductDTO[];
}