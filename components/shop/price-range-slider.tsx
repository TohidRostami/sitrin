"use client";

import { formatNumber } from "@/lib/format";

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const loPct = ((lo - min) / (max - min || 1)) * 100;
  const hiPct = ((hi - min) / (max - min || 1)) * 100;

  return (
    <div>
      <div className="relative my-4 h-1 rounded-full bg-border">
        <div
          className="absolute top-0 h-1 rounded-full bg-brand"
          style={{ right: `${loPct}%`, left: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - 1), hi])}
          className="range-thumb-only pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + 1)])}
          className="range-thumb-only pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>{formatNumber(lo)}</span>
        <span>{formatNumber(hi)}</span>
      </div>

      <style jsx>{`
        .range-thumb-only::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: var(--color-ink);
          cursor: pointer;
          box-shadow: 0 0 0 1px var(--color-border);
        }
        .range-thumb-only::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border: none;
          border-radius: 999px;
          background: var(--color-ink);
          cursor: pointer;
          box-shadow: 0 0 0 1px var(--color-border);
        }
      `}</style>
    </div>
  );
}
