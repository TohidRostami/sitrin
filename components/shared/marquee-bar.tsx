import { siteConfig } from "@/lib/content";

export function MarqueeBar() {
  const items = [...siteConfig.home.marqueeItems, ...siteConfig.home.marqueeItems];

  return (
    <div className="overflow-hidden whitespace-nowrap py-3.5">
      <div className="inline-flex animate-sitrin-marquee gap-11 text-sm font-extrabold tracking-[0.1em]">
        {[...items, ...items].map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
