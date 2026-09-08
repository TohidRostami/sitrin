import { siteConfig } from "@/lib/content";
import { Button } from "../ui/button";
import Link from "next/link";
import { ProductImage } from "../shared/product-image";
import { prisma } from "@/lib/db";

export async function LimitedSection({
  url,
  alt,
}: {
  url: string;
  alt: string;
}) {
  const limitedProduct = siteConfig.home.limitedBanner.productSlug
    ? await prisma.product.findUnique({
        where: { slug: siteConfig.home.limitedBanner.productSlug },
        select: {
          slug: true,
          images: { take: 1, select: { url: true, alt: true } },
        },
      })
    : null;
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
      <div
        className="grid grid-cols-1 items-center overflow-hidden rounded-[26px] border border-border md:grid-cols-2"
        style={{
          background: "linear-gradient(110deg, #f07824 0%, #eeeeee 58%)",
        }}
      >
        <div className="p-7 md:p-14">
          <div className="mb-3.5 text-xs font-extrabold tracking-[0.1em] text-brand-hover">
            {siteConfig.home.limitedBanner.eyebrow}
          </div>
          <h3 className="mb-3.5 text-[28px] font-black leading-[1.1] tracking-tight md:text-[44px]">
            {siteConfig.home.limitedBanner.title}
            <br />
            {siteConfig.home.limitedBanner.titleHighlight}
          </h3>
          <p className="mb-6 max-w-[40ch] text-[15px] leading-8 text-muted">
            {siteConfig.home.limitedBanner.description}
          </p>
          <Button asChild variant="inverted">
            <Link
              href={
                limitedProduct ? `/product/${limitedProduct.slug}` : "/shop"
              }
            >
              {siteConfig.home.limitedBanner.ctaLabel}
            </Link>
          </Button>
        </div>
        <div className="relative min-h-[220px] md:h-full">
          <ProductImage src={url} alt={alt} className="object-contain" />
        </div>
      </div>
    </section>
  );
}
