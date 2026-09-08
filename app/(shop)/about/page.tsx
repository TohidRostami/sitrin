import { ProductImage } from "@/components/shared/product-image";
import { siteConfig } from "@/lib/content";
import { listActiveHeroImages } from "@/lib/queries/settings";

export const metadata = { title: "درباره ما" };

export default async function AboutPage() {
  const heroImages = await listActiveHeroImages();
  const { about } = siteConfig;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 100% at 80% 0%, #707070 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1000px] px-4 py-14 sm:px-6 md:px-10 md:py-24">
          <div className="mb-4.5 text-xs font-extrabold tracking-[0.12em] text-brand-hover">
            {about.eyebrow}
          </div>
          <h1 className="mb-6 text-[32px] font-black leading-[1.1] tracking-tight text-balance md:text-[56px] lg:text-[64px]">
            {about.title}
          </h1>
          <p className="max-w-[62ch] text-[15px] leading-8 text-muted md:text-lg">
            {about.body}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {about.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[20px] border border-border bg-surface p-6"
            >
              <div className="text-[28px] font-black tracking-tight text-brand md:text-[36px]">
                {s.value}
              </div>
              <div className="mt-2 text-[13px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-12 sm:px-6 md:px-10 md:pb-20">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-border">
            <ProductImage
              src={heroImages[1]?.url ?? heroImages[0]?.url}
              alt="فروشگاه سیترین"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-6.5">
            {about.values.map((v) => (
              <div key={v.title}>
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="h-0.5 w-6.5 bg-brand" />
                  <span className="text-base font-extrabold">{v.title}</span>
                </div>
                <p className="text-sm leading-8 text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
