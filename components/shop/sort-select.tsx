"use client";

import { useRouteTransition } from "@/components/shared/route-transition-provider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { buildShopHref, type ShopSearchParams } from "@/lib/shop-query";

const OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "featured", label: "پرفروش‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

export function SortSelect({ current }: { current: ShopSearchParams }) {
  const { push } = useRouteTransition();

  return (
    <div className="hidden sm:flex items-center gap-2.5">
      <span className="shrink-0 text-xs text-muted-foreground">
        مرتب سازی بر اساس:
      </span>
      <Select
        value={current.sort || "newest"}
        onValueChange={(value) =>
          push(buildShopHref(current, { sort: value }))
        }
      >
        <SelectTrigger
          aria-label="مرتب سازی"
          className="!h-10 w-[168px] rounded-full !bg-surface text-[13px]"
          dir="rtl"
        >
          <SelectValue placeholder="جدید ترین" />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((sort) => (
            <SelectItem
              key={sort.value}
              value={sort.value}
              className="justify-end text-right text-xs"
            >
              {sort.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
