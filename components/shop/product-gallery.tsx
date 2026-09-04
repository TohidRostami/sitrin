"use client";

import { useState, useMemo } from "react";
import { ProductImage } from "@/components/shared/product-image";
import { cn } from "@/lib/utils";

type Img = { url: string; alt: string | null; colorId: string | null };

export function ProductGallery({
  images,
  selectedColorId,
  productName,
}: {
  images: Img[];
  selectedColorId: string | null;
  productName: string;
}) {
  const filtered = useMemo(() => {
    const byColor = selectedColorId ? images.filter((i) => i.colorId === selectedColorId) : [];
    return byColor.length > 0 ? byColor : images;
  }, [images, selectedColorId]);

  const [active, setActive] = useState(0);
  const activeImage = filtered[Math.min(active, filtered.length - 1)];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[24px] border border-border bg-surface">
        <ProductImage src={activeImage?.url} alt={activeImage?.alt ?? productName} sizes="(min-width: 1024px) 40vw, 90vw" />
      </div>
      {filtered.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {filtered.slice(0, 4).map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-[14px] border bg-surface",
                i === active ? "border-brand" : "border-border"
              )}
            >
              <ProductImage src={img.url} alt={img.alt ?? productName} sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
