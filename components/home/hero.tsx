import { siteConfig } from "@/lib/content";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductImage } from "../shared/product-image";
import { listActiveHeroImages } from "@/lib/queries/settings";

export async function Hero() {
  const [heroImages] = await Promise.all([listActiveHeroImages()]);
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 20% 0%, #640E0E 0%, transparent 55%), radial-gradient(90% 70% at 90% 100%, #1a0808 0%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute left-[5%] top-[8%] select-none font-wordmark text-[90px] leading-[0.8] tracking-[-0.04em] text-transparent [-webkit-text-stroke:2px_#2c2a29] sm:text-[180px] md:top-[12%] md:text-[280px] lg:text-[340px]">
        {siteConfig.site.nameEn}
      </div>

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-9 px-4 py-8 sm:px-6 md:px-10 md:py-15 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 animate-sitrin-rise lg:order-1">
          <h1 className="mb-5 text-[36px] font-black leading-[1.02] tracking-tight text-balance text-center sm:text-right sm:text-[56px] md:text-[72px] lg:text-[82px]">
            {siteConfig.home.heroTitleLine1}
            <br className="hidden sm:block" />
            <span className="text-brand">
              {" "}
              {siteConfig.home.heroTitleHighlight}
            </span>{" "}
            {siteConfig.home.heroTitleRest}
          </h1>
          <p className="mb-8 max-w-[44ch] text-[18px] text-center sm:text-right leading-8 text-muted md:text-lg">
            {siteConfig.home.heroDescription}
          </p>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <Button asChild>
              <Link href="/shop">
                از فروشگاه ما دیدن کنید
                <ArrowLeft className="h-[17px] w-[17px]" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="order-1 relative animate-sitrin-rise [animation-delay:150ms] lg:order-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-[24px] animate-sitrin-float">
            <ProductImage
              src={heroImages[0]?.url}
              alt="عکس اصلی سیترین"
              className="object-contain -rotate-45"
            />
          </div>
          <div
            className="pointer-events-none absolute -bottom-3.5 left-1/2 h-[26px] w-[62%] -translate-x-1/2 animate-sitrin-glow rounded-full"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, #C61E1C 0%, transparent 70%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
