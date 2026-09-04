import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductCard } from "@/components/shared/product-card";
import { ProductPurchasePanel } from "@/components/shop/product-purchase-panel";
import { ReviewsSection } from "@/components/shop/reviews-section";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 4);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "فروشگاه", href: "/shop" },
          { label: product.name },
        ]}
      />

      <ProductPurchasePanel
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          code: product.sku ?? product.id.slice(0, 8).toUpperCase(),
        }}
        description={product.description}
        images={product.images}
        colors={product.colors}
        sizeOptions={product.sizeOptions}
        variants={product.variants}
        ratingAverage={product.ratingAverage}
        ratingCount={product.ratingCount}
      />

      

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="mb-6 text-2xl font-black">محصولات مشابه</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <ReviewsSection productId={product.id} reviews={product.reviews} />
    </main>
  );
}
