"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { formatNumber } from "@/lib/format";

export function CartBadge() {
  const totalQuantity = useCartStore((s) => s.totalQuantity());
  // برای جلوگیری از mismatch هیدریشن (سرور همیشه ۰ می‌بیند، کلاینت مقدار واقعی از localStorage).
  const mounted = useHasMounted();
  const count = mounted ? totalQuantity : 0;

  return (
    <Link
      href="/cart"
      className="flex h-[38px] items-center gap-2 rounded-full bg-brand px-3.5 text-ink transition-colors hover:bg-brand-hover"
    >
      <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.7} />
      <span className="text-[13px] font-bold">{formatNumber(count)}</span>
    </Link>
  );
}
