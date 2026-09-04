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
  description,
  images,
  colors,
  sizeOptions,
  variants,
  ratingAverage,
  ratingCount,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compareAtPrice: number | null;
    code: string;
  };
  description: string;
  images: Img[];
  colors: Color[];
  sizeOptions: SizeOption[];
  variants: Variant[];
  ratingAverage: number;
  ratingCount: number;
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
                  onClick={() => setColorId(c.id)}
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
              {sizeOptions.map((s) => (
                <button
                  key={s.id}
                  disabled={!s.inStock}
                  onClick={() => setSizeId(s.id)}
                  className={cn(
                    "flex h-[46px] min-w-[52px] items-center justify-center rounded-xl border px-2 text-sm font-bold transition-colors",
                    !s.inStock &&
                      "cursor-not-allowed border-border text-muted/40 line-through",
                    s.inStock &&
                      sizeId === s.id &&
                      "border-brand bg-brand/[0.14] text-brand-hover",
                    s.inStock &&
                      sizeId !== s.id &&
                      "border-border hover:border-brand",
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
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
