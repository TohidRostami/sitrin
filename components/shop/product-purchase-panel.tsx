"use client";

import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { ProductGallery } from "@/components/shop/product-gallery";
import { PriceTag } from "@/components/shared/price-tag";
import { RatingStars } from "@/components/shared/rating-stars";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { useFavoritesStore } from "@/lib/favorites-store";

type Color = { id: string; name: string; hexValue: string | null };
type SizeOption = { id: string; name: string; inStock: boolean };
type Variant = {
  id: string;
  sizeId: string | null;
  colorId: string | null;
  stock: number;
};
type Img = { url: string; alt: string | null; colorId: string | null };

export function ProductPurchasePanel({
  product,
  images,
  colors,
  sizeOptions,
  variants,
  ratingAverage,
  ratingCount,
  description,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compareAtPrice: number | null;
    code: string;
  };
  images: Img[];
  colors: Color[];
  sizeOptions: SizeOption[];
  variants: Variant[];
  ratingAverage: number;
  ratingCount: number;
  description: string;
}) {
  const [colorId, setColorId] = useState<string | null>(colors[0]?.id ?? null);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const add = useCartStore((s) => s.add);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(product.id));

  const selectedVariant = useMemo(
    () =>
      variants.find(
        (v) =>
          v.sizeId === sizeId && (colors.length === 0 || v.colorId === colorId),
      ),
    [variants, sizeId, colorId, colors.length],
  );

  // موجودی هر سایز مخصوصِ رنگ فعلاً انتخاب‌شده — نه موجودیِ کلی محصول.
  const sizeAvailability = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const s of sizeOptions) {
      const inStock = variants.some(
        (v) =>
          v.sizeId === s.id &&
          (colors.length === 0 || v.colorId === colorId) &&
          v.stock > 0,
      );
      map.set(s.id, inStock);
    }
    return map;
  }, [sizeOptions, variants, colorId, colors.length]);

  function handleSelectColor(id: string) {
    setColorId(id);
    setSizeId(null); // سایزِ رنگ قبلی لزوماً برای رنگ جدید معتبر نیست
  }

  function handleSelectSize(id: string) {
    setSizeId(id);
    setQuantity(1); // تعداد مال سایز قبلی دیگه برای سایز جدید معتبر نیست
  }

  const needsSize = sizeOptions.length > 0;
  const canAdd =
    !needsSize || (sizeId && selectedVariant && selectedVariant.stock > 0);

  function handleAddToCart() {
    if (needsSize && !sizeId) {
      toast.error("لطفاً یک سایز انتخاب کنید.");
      return;
    }
    if (!selectedVariant || selectedVariant.stock <= 0) {
      toast.error("این ترکیب سایز/رنگ فعلاً موجود نیست.");
      return;
    }

    add(
      {
        productId: product.id,
        variantId: selectedVariant.id,
        slug: product.slug,
        name: product.name,
        image: images[0]?.url ?? null,
        price: product.price,
        size: sizeOptions.find((s) => s.id === sizeId)?.name ?? null,
        color: colors.find((c) => c.id === colorId)?.name ?? null,
        maxStock: selectedVariant.stock,
      },
      quantity,
    );
    toast.success("به سبد خرید اضافه شد.");
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12">
      <ProductGallery
        images={images}
        selectedColorId={colorId}
        productName={product.name}
      />

      <div>
        <div className="mb-3.5 flex items-center gap-2.5 text-[12px] text-muted">
          <span className="rounded-full border border-brand-muted bg-brand/[0.12] px-3 py-1 font-extrabold text-brand-hover">
            {product.name}
          </span>
          <span>کد: {product.code}</span>
        </div>

        <h1 className="mb-3 text-[28px] font-black leading-tight tracking-tight md:text-[36px]">
          {product.name}
        </h1>

        {ratingCount > 0 && (
          <RatingStars
            rating={ratingAverage}
            count={ratingCount}
            className="mb-5"
          />
        )}

        <PriceTag
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="lg"
          className="mb-6"
        />

        {colors.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 text-[13px] font-bold">
              رنگ
              {colorId ? `: ${colors.find((c) => c.id === colorId)?.name}` : ""}
            </div>
            <div className="flex gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectColor(c.id)}
                  className={cn(
                    "h-[38px] w-[38px] rounded-full ring-2 ring-offset-2 ring-offset-canvas transition-all",
                    colorId === c.id ? "ring-ink" : "ring-border",
                  )}
                  style={{ background: c.hexValue ?? "#2C2A29" }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>
        )}

        {needsSize && (
          <div className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] font-bold">سایز</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((s) => {
                const inStock = sizeAvailability.get(s.id) ?? false;
                return (
                  <button
                    key={s.id}
                    disabled={!inStock}
                    onClick={() => handleSelectSize(s.id)}
                    className={cn(
                      "relative flex h-[46px] min-w-[52px] items-center justify-center overflow-hidden rounded-xl border px-2 text-sm font-bold transition-colors",
                      !inStock &&
                        "cursor-not-allowed border-border text-muted/40",
                      inStock &&
                        sizeId === s.id &&
                        "border-brand bg-brand/[0.14] text-brand-hover",
                      inStock &&
                        sizeId !== s.id &&
                        "border-border hover:border-brand",
                    )}
                  >
                    {s.name}
                    {!inStock && (
                      <span
                        className="pointer-events-none absolute left-[-8px] top-1/2 h-[1px] w-[calc(100%+16px)] -translate-y-1/2 -rotate-45 bg-muted/60"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {sizeId && selectedVariant && (
              <p
                className={cn(
                  "mt-2.5 text-xs",
                  selectedVariant.stock <= 3
                    ? "text-brand-hover"
                    : "text-muted",
                )}
              >
                {selectedVariant.stock <= 3
                  ? `فقط ${formatNumber(selectedVariant.stock)} عدد در انبار باقی مانده`
                  : `${formatNumber(selectedVariant.stock)} عدد در انبار موجود است`}
              </p>
            )}
          </div>
        )}

        <div className="mb-2 flex flex-wrap items-center gap-3">
          <div className="flex h-14 items-center rounded-2xl border border-border px-4">
            <QuantityStepper
              quantity={quantity}
              onIncrement={() =>
                setQuantity((q) =>
                  Math.min(q + 1, selectedVariant?.stock ?? 10),
                )
              }
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className="h-14 flex-1 min-w-[200px]"
          >
            افزودن به سبد خرید
          </Button>
          <button
            onClick={() =>
              toggleFavorite({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: images[0]?.url ?? null,
                price: product.price,
              })
            }
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors",
              isFavorite
                ? "border-brand text-brand"
                : "border-border text-ink hover:border-brand",
            )}
            aria-label="افزودن به علاقه‌مندی‌ها"
          >
            <Heart
              className="h-5 w-5"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 border-y-1 border-border">
          <div className="my-2">
            <h2 className="mb-3 text-lg font-extrabold">توضیحات محصول</h2>
            <p className="whitespace-pre-line text-[15px] leading-8 text-muted">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
