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

      <div ref={emblaRef} className="mt-6 overflow-hidden py-2">
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
                <div className="relative h-[190px] w-full overflow-hidden bg-surface-sunken">
                  {/* Category image */}
                  <ProductImage
                    src={cat.image}
                    alt={cat.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Bottom gradient for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Category name */}
                  <div className="absolute inset-x-0 bottom-4 flex justify-center px-3">
                    <span
                      className="text-center text-base font-bold text-white"
                      style={{
                        textShadow:
                          "0 2px 4px rgba(80, 80, 80, 0.9), 0 4px 10px rgba(80, 80, 80, 0.6)",
                      }}
                    >
                      {cat.title}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
