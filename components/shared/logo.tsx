import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <Image
        alt="Sitrin Logo"
        src={"/sitrin_logo.png"}
        width={90}
        height={90}
      />
    </span>
  );
}
