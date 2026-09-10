import type { Metadata } from "next";
import { ProductImage } from "@/components/shared/product-image";
import { siteConfig } from "@/lib/content";
import { listActiveHeroImages } from "@/lib/queries/settings";
import { Mail, Phone, MapPin, Clock, Navigation } from "lucide-react";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: `راه‌های تماس با ${siteConfig.site.name}: ${siteConfig.site.phone}، ${siteConfig.site.address}.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const heroImages = await listActiveHeroImages();
  const contacts = [
    { k: "تلفن", v: siteConfig.site.phone },
    { k: "ایمیل", v: siteConfig.site.email },
    { k: "نشانی", v: siteConfig.site.address },
    { k: "ساعات کاری", v: siteConfig.site.hours },
  ];
  const ROWS = [
    {
      icon: Phone,
      label: "تلفن",
      value: siteConfig.site.phone,
      href: `tel:${siteConfig.site.phone}`,
    },
    {
      icon: Mail,
      label: "ایمیل",
      value: siteConfig.site.email,
      href: `mailto:${siteConfig.site.email}`,
    },
    { icon: MapPin, label: "آدرس", value: siteConfig.site.address },
    {
      icon: Navigation,
      label: "لوکیشن حضوری فروشگاه",
      value: "مشاهده مسیر روی نقشه",
      href: siteConfig.site.mapUrl,
      external: true,
    },
    {
      icon: Clock,
      label: "ساعات پاسخ‌گویی",
      value: siteConfig.site.workingHours,
    },
  ];

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 md:px-10 md:py-14">
      <h1 className="mb-3 text-[30px] font-black tracking-tight md:text-[48px]">
        تماس با ما
      </h1>
      <p className="mb-9 text-[15px] leading-8 text-muted">
        سوالی درباره سایز، موجودی یا سفارشتان دارید؟ هر روز از ۹ صبح تا ۲۳ شب
        پاسخگوییم.
      </p>

      <div className="flex items-start gap-5.5">
        <div className="flex w-full flex-1 basis-[260px] flex-col gap-3">
          {ROWS.map(({ icon: Icon, label, value, href, external }) => (
            <div
              key={label}
              className="rounded-[18px] border border-border bg-surface p-5 transition-colors hover:border-brand"
            >
              <div className="mb-2 text-xs text-muted">{label}</div>
              <div className="flex gap-2 text-[15px] font-bold leading-7">
                <Icon className="size-5 shrink-0 text-accent" strokeWidth={1.6} />
                {href ? (
                  <a
                    href={href}
                    dir={external ? undefined : "ltr"}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="text-sm text-foreground hover:underline"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm text-foreground">{value}</p>
                )}
              </div>
            </div>
          ))}
          <div className="relative h-[190px] overflow-hidden rounded-[18px] border border-border">
            <ProductImage
              src={heroImages[0]?.url}
              alt="نشانی فروشگاه سیترین"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
