"use client";

import {
  buildShopHref,
  toggleSize,
  type ShopSearchParams,
} from "@/lib/shop-query";
import { cn } from "@/lib/utils";
import { TransitionLink } from "../shared/transition-link";

const PRICE_MIN = 0;
const PRICE_MAX = 20_000_000;

export function FilterSidebar({
  current,
  categories,
  sizes,
}: {
  current: ShopSearchParams;
  categories: { slug: string; title: string; productCount: number }[];
  sizes: { id: string; name: string }[];
}) {
  const activeSizes = current.sizes
    ? current.sizes.split(",").filter(Boolean)
    : [];

  return (
    <aside className="hidden lg:block sticky top-[92px] w-full max-w-[320px] flex-1 basis-[240px] rounded-[20px] border border-border bg-surface p-5">
      <div className="mb-4.5 text-[15px] font-extrabold">فیلترها</div>

      <div className="mb-2.5 text-xs font-bold text-muted">دسته‌بندی</div>
      <div className="mb-6 flex flex-col gap-0.5">
        <TransitionLink
          href={buildShopHref(current, { category: undefined })}
          className={cn(
            "rounded-[10px] px-3 py-2.5 text-sm transition-colors hover:bg-surface-sunken",
            !current.category ? "bg-brand/[0.14] text-brand-hover" : "text-ink",
          )}
        >
          همه
        </TransitionLink>
        {categories.map((c) => (
          <TransitionLink
            key={c.slug}
            href={buildShopHref(current, { category: c.slug })}
            className={cn(
              "flex items-center justify-between rounded-[10px] px-3 py-2.5 text-sm transition-colors hover:bg-surface-sunken",
              current.category === c.slug
                ? "bg-brand/[0.14] text-brand-hover"
                : "text-ink",
            )}
          >
            <span>{c.title}</span>
            <span className="text-[11px] text-muted">{c.productCount} مدل</span>
          </TransitionLink>
        ))}
      </div>

      {sizes.length > 0 && (
        <>
          <div className="mb-3 text-xs font-bold text-muted">سایز</div>
          <div className="mb-6 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <TransitionLink
                key={s.id}
                href={buildShopHref(current, {
                  sizes: toggleSize(activeSizes, s.name).join(",") || undefined,
                })}
                className={cn(
                  "flex h-[38px] min-w-[44px] items-center justify-center rounded-[10px] border px-2 text-[13px] font-semibold transition-colors",
                  activeSizes.includes(s.name)
                    ? "border-brand bg-brand/[0.14] text-brand-hover"
                    : "border-border hover:border-brand hover:text-brand-hover",
                )}
              >
                {s.name}
              </TransitionLink>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
