"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";

// import { ProductPlaceholder } from "@/components/shared/product-placeholder";
// import type { GarmentVariant } from "@/components/shared/garment-glyph";
import type { CategoryDTO } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductImage } from "../shared/product-image";
import { formatNumber } from "@/lib/format";

export function CategoriesCarousel({
  categories,
  title,
}: {
  categories: CategoryDTO[];
  title: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      direction: "rtl",
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
    },
    [
      Autoplay({
        delay: 3000,
      }),
    ],
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="text-[26px] font-black tracking-tight md:text-[34px]">
          دسته‌بندی‌ها
        </h2>
        <Link
          href="/shop"
          className="text-sm font-semibold text-muted hover:text-brand-hover"
        >
          مشاهده همه
        </Link>
      </div>

      <div ref={emblaRef} className="mt-6 py-2 overflow-hidden">
        <div className="flex -ml-4">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="shrink-0 basis-[44%] pl-4 sm:basis-[30%] lg:basis-[20%]"
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group block overflow-hidden rounded-[18px] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand"
              >
                <div className="relative h-[118px] bg-surface-sunken">
                  <ProductImage src={cat.image} alt={cat.title} />
                </div>

                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-sm font-bold">{cat.title}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
