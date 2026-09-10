import type { Metadata } from "next";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { SortSelect } from "@/components/shop/sort-select";
import { ActiveFilterChips } from "@/components/shop/active-filter-chips";
import { ProductCard } from "@/components/shared/product-card";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { PackageSearch } from "lucide-react";
import { listProducts, listAllSizes } from "@/lib/queries/products";
import {
  listCategoriesWithCounts,
  getCategoryBySlug,
} from "@/lib/queries/categories";
import {
  parseShopFilters,
  buildShopHref,
  type ShopSearchParams,
} from "@/lib/shop-query";
import { formatNumber } from "@/lib/format";
import { MobileProductFilters } from "@/components/shop/mobile-product-filters";
import { SortOption } from "@/lib/product-constants";
import { TransitionRegion } from "@/components/shared/transition-region";

const SORTS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "featured", label: "پرفروش‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const category = sp.category ? await getCategoryBySlug(sp.category) : null;

  const title = category ? `${category.title} | فروشگاه` : "فروشگاه";
  const description = category
    ? `خرید ${category.title} اورجینال از سیترین — ${category.description ?? "با ضمانت اصالت کالا و ارسال سریع."}`
    : "همه‌ی مدل‌های اسنیکر سیترین — دویدن، بسکتبال، لایف‌استایل، اسکیت و تمرین، با ضمانت اصالت کالا.";

  // sort/page/min/max روی canonical نمی‌آید — این‌ها signal رتبه‌بندی جدایی
  // ندارند، فقط باعث محتوای تکراری می‌شوند اگر جدا ایندکس شوند.
  const canonical = category ? `/shop?category=${category.slug}` : "/shop";

  return {
    title,
    description,
    alternates: { canonical },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseShopFilters(sp);

  const [{ items, total, page, pageCount }, categories, sizes, activeCategory] =
    await Promise.all([
      listProducts(filters),
      listCategoriesWithCounts(),
      listAllSizes(),
      filters.categorySlug
        ? getCategoryBySlug(filters.categorySlug)
        : Promise.resolve(null),
    ]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <div className="mb-3.5 text-[13px] text-muted">
        خانه / <span className="text-ink">فروشگاه</span>
      </div>
      <h1 className="mb-2 text-[30px] font-black tracking-tight md:text-[44px]">
        {activeCategory ? activeCategory.title : "همه اسنیکرها"}
      </h1>
      <p className="mb-7 text-sm text-muted">
        {formatNumber(total)} محصول موجود
      </p>

      <div className="flex flex-wrap items-start gap-6">
        <FilterSidebar current={sp} categories={categories} sizes={sizes} />

        <div className="min-w-0 flex-[999_1_420px]">
          <div className="mb-4.5 flex flex-col items-start justify-between gap-3">
            <SortSelect current={sp}/>
            <MobileProductFilters
              categories={categories}
              sorts={SORTS}
              activeCategorySlug={filters.categorySlug}
              activeSort={filters.sort}
            />
            <ActiveFilterChips
              current={sp}
              categoryTitle={activeCategory?.title}
            />
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="محصولی با این فیلترها پیدا نشد"
              description="فیلترها را تغییر دهید یا همه دسته‌بندی‌ها را ببینید."
              actionLabel="پاک‌کردن فیلترها"
              actionHref="/shop"
            />
          ) : (
            <>
              <TransitionRegion className="rounded-2xl">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </TransitionRegion>
              <Pagination
                page={page}
                pageCount={pageCount}
                buildHref={(p) => buildShopHref(sp, { page: String(p) })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
