import { siteConfig } from "@/lib/content";

type ProductJsonLdProps = {
  name: string;
  description: string;
  slug: string;
  sku: string;
  images: string[];
  price: number;
  inStock: boolean;
  ratingAverage: number;
  ratingCount: number;
};

/**
 * schema.org Product — برای rich result (قیمت/موجودی/امتیاز) در نتایج گوگل.
 *
 * نکته‌ی واحد پول: قیمت‌های دیتابیس به «تومان» ذخیره و نمایش داده می‌شوند،
 * ولی تنها کد ISO 4217 معتبر برای ایران «IRR» (ریال) است — کد رسمی جداگانه‌ای
 * برای تومان وجود ندارد. همان عدد تومان را با IRR اعلام کرده‌ایم چون گوگل
 * قیمتِ JSON-LD را با قیمت *نمایش‌داده‌شده* روی صفحه مقایسه می‌کند، نه با
 * ارزش واقعی ارزی — یعنی اگر ۱۰ برابرش کنیم (برای بازگرداندن ریال واقعی)،
 * با عدد روی صفحه ناسازگار می‌شود که مشکل‌سازتر است.
 */
export function ProductJsonLd({
  name,
  description,
  slug,
  sku,
  images,
  price,
  inStock,
  ratingAverage,
  ratingCount,
}: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku,
    image: images,
    url: `${siteConfig.site.url}/product/${slug}`,
    brand: { "@type": "Brand", name: siteConfig.site.name },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.site.url}/product/${slug}`,
      priceCurrency: "IRR",
      price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(ratingAverage.toFixed(1)),
            reviewCount: ratingCount,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
