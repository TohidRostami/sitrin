"use client";

import { X } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { buildShopHref, toggleSize, type ShopSearchParams } from "@/lib/shop-query";
import { TransitionLink } from "../shared/transition-link";

export function ActiveFilterChips({
  current,
  categoryTitle,
}: {
  current: ShopSearchParams;
  categoryTitle?: string;
}) {
  const sizes = current.sizes ? current.sizes.split(",").filter(Boolean) : [];
  const chips: { label: string; href: string }[] = [];

  if (current.category && categoryTitle) {
    chips.push({ label: categoryTitle, href: buildShopHref(current, { category: undefined }) });
  }
  sizes.forEach((s) => {
    chips.push({ label: `سایز ${s}`, href: buildShopHref(current, { sizes: toggleSize(sizes, s).join(",") || undefined }) });
  });
  if (current.min || current.max) {
    chips.push({
      label: `${formatNumber(Number(current.min || 0))} تا ${formatNumber(Number(current.max || 0))} تومان`,
      href: buildShopHref(current, { min: undefined, max: undefined }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <TransitionLink
          key={chip.label}
          href={chip.href}
          className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-[12.5px] text-muted"
        >
          {chip.label} <X className="h-3 w-3 text-brand" />
        </TransitionLink>
      ))}
    </div>
  );
}
