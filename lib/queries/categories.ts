import { prisma } from "@/lib/db";
import { CategoryDTO } from "../types";

export async function listCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: { where: { isPublished: true, isArchived: false } } },
      },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    image: c.image,
    productCount: c._count.products,
  }));
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getCategories(): Promise<CategoryDTO[]> {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return categories as unknown as CategoryDTO[];
}
