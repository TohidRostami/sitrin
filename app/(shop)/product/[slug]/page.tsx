import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductCard } from "@/components/shared/product-card";
import { ProductPurchasePanel } from "@/components/shop/product-purchase-panel";
import { ReviewsSection } from "@/components/shop/reviews-section";
import { ProductJsonLd } from "@/components/shared/product-json-ld";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { siteConfig } from "@/lib/content";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = product.metaTitle || product.name;
  const description =
    product.metaDescription || product.description.slice(0, 160);
  const image = product.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      type: "website",
      url: `${siteConfig.site.url}/product/${slug}`,
      title,
      description,
      images: image
        ? [{ url: image, width: 1200, height: 1200, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 4);
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <ProductJsonLd
        name={product.name}
        description={product.description}
        slug={product.slug}
        sku={product.sku ?? product.id}
        images={product.images.map((i) => i.url)}
        price={product.price}
        inStock={inStock}
        ratingAverage={product.ratingAverage}
        ratingCount={product.ratingCount}
      />
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
          {/* <h2 className="mb-6 text-2xl font-black"></h2> */}
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-[26px] font-black tracking-tight md:text-[34px]">
              محصولات مشابه
            </h2>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-sm font-semibold text-muted hover:text-brand-hover"
            >
              مشاهده همه
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <ReviewsSection productId={product.id} reviews={product.reviews} />
    </main>
  );
}
