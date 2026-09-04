"use client";

import { Minus, Plus } from "lucide-react";
import { formatNumber } from "@/lib/format";

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  disabled,
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-border text-muted transition-colors hover:border-brand hover:text-ink disabled:opacity-40"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[26px] text-center text-sm font-bold">{formatNumber(quantity)}</span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-border text-muted transition-colors hover:border-brand hover:text-ink disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
