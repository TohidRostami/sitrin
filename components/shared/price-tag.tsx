import { formatToman } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  compareAtPrice,
  size = "md",
  className,
}: {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className="min-h-[2.5rem] shrink-0 text-start text-sm sm:flex sm:min-h-0 sm:items-center">
      {compareAtPrice && (
        <>
          <span className="block text-xs text-muted-foreground line-through">
            {formatToman(compareAtPrice)}
          </span>
          <span className="px-1 hidden sm:flex">-</span>
        </>
      )}
      <div className="flex flex-wrap">
      <span className="text-foreground">{formatToman(price)}</span>
      <span className="text-muted-foreground pr-1"> تومان</span>
      </div>
    </div>
  );
}
