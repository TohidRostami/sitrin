import { ProductImage } from "@/components/shared/product-image";
import { ContactForm } from "@/components/shop/contact-form";
import { siteConfig } from "@/lib/content";
import { listActiveHeroImages } from "@/lib/queries/settings";

export const metadata = { title: "تماس با ما" };

export default async function ContactPage() {
  const heroImages = await listActiveHeroImages();
  const contacts = [
    { k: "تلفن", v: siteConfig.site.phone },
    { k: "ایمیل", v: siteConfig.site.email },
    { k: "نشانی", v: siteConfig.site.address },
    { k: "ساعات کاری", v: siteConfig.site.hours },
  ];

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 md:px-10 md:py-14">
      <h1 className="mb-3 text-[30px] font-black tracking-tight md:text-[48px]">تماس با ما</h1>
      <p className="mb-9 max-w-[52ch] text-[15px] leading-8 text-muted">
        سوالی درباره سایز، موجودی یا سفارشتان دارید؟ هر روز از ۹ صبح تا ۹ شب پاسخگوییم.
      </p>

      <div className="flex flex-wrap items-start gap-5.5">
        <div className="flex w-full max-w-[380px] flex-1 basis-[260px] flex-col gap-3">
          {contacts.map((c) => (
            <div key={c.k} className="rounded-[18px] border border-border bg-surface p-5 transition-colors hover:border-brand">
              <div className="mb-2 text-xs text-muted">{c.k}</div>
              <div className="text-[15px] font-bold leading-7">{c.v}</div>
            </div>
          ))}
          <div className="relative h-[190px] overflow-hidden rounded-[18px] border border-border">
            <ProductImage src={heroImages[0]?.url} alt="نشانی فروشگاه سیترین" />
          </div>
        </div>

        <div className="min-w-0 flex-[999_1_400px]">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
