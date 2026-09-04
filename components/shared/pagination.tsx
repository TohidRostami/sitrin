import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageCount,
  buildHref,
}: {
  page: number;
  pageCount: number;
  buildHref: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1
  );

  return (
    <div className="mt-9 flex flex-wrap justify-center gap-2">
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-muted">…</span>}
          <Link
            href={buildHref(p)}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-xl border px-2 text-sm font-bold transition-colors",
              p === page ? "border-brand bg-brand text-ink" : "border-border text-muted hover:text-ink"
            )}
          >
            {formatNumber(p)}
          </Link>
        </span>
      ))}
    </div>
  );
}
