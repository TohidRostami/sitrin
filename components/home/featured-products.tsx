import { listFeaturedProducts } from "@/lib/queries/products";
import Link from "next/link";
import { ProductCard } from "../shared/product-card";

export async function FeaturedProducts() {
  const [featured] = await Promise.all([listFeaturedProducts(4)]);
  return (
    <>
      {featured.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-[26px] font-black tracking-tight md:text-[34px]">
              پرفروش‌ترین‌ها
            </h2>
            <Link
              href="/shop?sort=featured"
              className="text-sm font-semibold text-muted hover:text-brand-hover"
            >
              مشاهده همه
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4">
            {featured.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
