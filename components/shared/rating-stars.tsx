import { Star } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-0.5 text-brand">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4" fill={i < rounded ? "currentColor" : "none"} strokeWidth={1.5} />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-[13px] text-muted">
          {formatNumber(rating)} · {formatNumber(count)} دیدگاه
        </span>
      )}
    </div>
  );
}
