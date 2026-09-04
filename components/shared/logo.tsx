import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/content";
import Image from "next/image";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const badge = size === "sm" ? "h-7 w-7" : "h-[34px] w-[34px]";
  const dot = size === "sm" ? "h-2.5 w-2.5" : "h-[11px] w-[11px]";
  const text = size === "sm" ? "text-base" : "text-[21px]";

  return (
    <span className={cn("flex shrink-0 items-center gap-2.5", className)}>
      {/* <span
        className={cn("flex items-center justify-center bg-brand", badge)}
        style={{ clipPath: "polygon(50% 0, 100% 26%, 100% 74%, 50% 100%, 0 74%, 0 26%)" }}
      >
        <span className={cn("rotate-45 bg-canvas", dot)} />
      </span>
      <span className={cn("font-wordmark leading-none tracking-[0.06em]", text)}>
        {siteConfig.site.nameEn}
      </span> */}
      <Image alt="Sitrin Logo" src={"/sitrin_logo.png"} width={90} height={90}/>
    </span>
  );
}
