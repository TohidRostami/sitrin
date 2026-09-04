"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PriceRangeSlider } from "@/components/shop/price-range-slider";
import { buildShopHref, toggleSize, type ShopSearchParams } from "@/lib/shop-query";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const activeSizes = current.sizes ? current.sizes.split(",").filter(Boolean) : [];
  const [range, setRange] = useState<[number, number]>([
    current.min ? Number(current.min) : PRICE_MIN,
    current.max ? Number(current.max) : PRICE_MAX,
  ]);

  function applyPrice() {
    router.push(buildShopHref(current, { min: String(range[0]), max: String(range[1]) }));
  }

  return (
    <aside className="hidden lg:block sticky top-[92px] w-full max-w-[320px] flex-1 basis-[240px] rounded-[20px] border border-border bg-surface p-5">
      <div className="mb-4.5 text-[15px] font-extrabold">فیلترها</div>

      <div className="mb-2.5 text-xs font-bold text-muted">دسته‌بندی</div>
      <div className="mb-6 flex flex-col gap-0.5">
        <Link
          href={buildShopHref(current, { category: undefined })}
          className={cn(
            "rounded-[10px] px-3 py-2.5 text-sm transition-colors hover:bg-surface-sunken",
            !current.category ? "bg-brand/[0.14] text-brand-hover" : "text-ink"
          )}
        >
          همه
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={buildShopHref(current, { category: c.slug })}
            className={cn(
              "flex items-center justify-between rounded-[10px] px-3 py-2.5 text-sm transition-colors hover:bg-surface-sunken",
              current.category === c.slug ? "bg-brand/[0.14] text-brand-hover" : "text-ink"
            )}
          >
            <span>{c.title}</span>
            <span className="text-[11px] text-muted">{c.productCount} مدل</span>
          </Link>
        ))}
      </div>

      {sizes.length > 0 && (
        <>
          <div className="mb-3 text-xs font-bold text-muted">سایز</div>
          <div className="mb-6 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <Link
                key={s.id}
                href={buildShopHref(current, { sizes: toggleSize(activeSizes, s.name).join(",") || undefined })}
                className={cn(
                  "flex h-[38px] min-w-[44px] items-center justify-center rounded-[10px] border px-2 text-[13px] font-semibold transition-colors",
                  activeSizes.includes(s.name)
                    ? "border-brand bg-brand/[0.14] text-brand-hover"
                    : "border-border hover:border-brand hover:text-brand-hover"
                )}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="mb-3 text-xs font-bold text-muted">محدوده قیمت (تومان)</div>
      <PriceRangeSlider min={PRICE_MIN} max={PRICE_MAX} value={range} onChange={setRange} />

      <Button onClick={applyPrice} className="mt-5 w-full">
        اعمال فیلتر
      </Button>
    </aside>
  );
}
