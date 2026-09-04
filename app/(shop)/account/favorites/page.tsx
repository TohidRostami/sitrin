"use client";

import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useFavoritesStore } from "@/lib/favorites-store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { ProductImage } from "@/components/shared/product-image";
import { EmptyState } from "@/components/shared/empty-state";
import { formatToman } from "@/lib/format";

export default function FavoritesPage() {
  const mounted = useHasMounted();

  const items = useFavoritesStore((s) => s.items);
  const remove = useFavoritesStore((s) => s.remove);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="لیست علاقه‌مندی‌های شما خالی است"
        description="با زدن آیکون قلب روی هر محصول، آن را اینجا نگه دارید."
        actionLabel="مشاهده فروشگاه"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="rounded-[20px] border border-border bg-surface p-6">
      <div className="mb-1 text-base font-extrabold">علاقه‌مندی‌ها</div>
      <p className="mb-5 text-xs text-muted">این لیست فقط روی همین مرورگر ذخیره می‌شود.</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.productId} className="group relative overflow-hidden rounded-2xl border border-border bg-surface-sunken">
            <button
              onClick={() => remove(item.productId)}
              className="absolute left-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-canvas/70 text-ink backdrop-blur"
              aria-label="حذف از علاقه‌مندی‌ها"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <Link href={`/product/${item.slug}`}>
              <div className="relative aspect-square">
                <ProductImage src={item.image} alt={item.name} />
              </div>
              <div className="p-3.5">
                <div className="mb-1.5 truncate text-sm font-bold">{item.name}</div>
                <div className="text-[13px] font-extrabold text-brand">{formatToman(item.price)} <span className="text-[11px] font-medium text-muted">تومان</span></div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
