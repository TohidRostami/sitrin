import { siteConfig } from "@/lib/content";

export function PerkGrid() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
      <div className="mx-auto grid grid-cols-1 gap-6 px-4 py-9 sm:grid-cols-2 sm:px-6 md:px-10 md:py-14 lg:grid-cols-4 border border-border rounded-[26px]  bg-surface-sunken">
        {siteConfig.perks.map((f) => (
          <div key={f.number} className="flex items-start gap-3.5">
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-brand-muted bg-brand/[0.12] text-lg font-black text-brand">
              {f.number}
            </div>
            <div>
              <div className="mb-1.5 text-[15px] font-bold">{f.title}</div>
              <div className="text-[13px] leading-7 text-muted">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
