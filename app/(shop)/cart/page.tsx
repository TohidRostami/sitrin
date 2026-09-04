"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { ProductImage } from "@/components/shared/product-image";
import { EmptyState } from "@/components/shared/empty-state";
import { formatToman } from "@/lib/format";
import { checkDiscountCode } from "@/lib/actions/discount";
import { previewShipping } from "@/lib/actions/shipping";
import type { DiscountValidationResult } from "@/lib/queries/discount";

export default function CartPage() {
  const mounted = useHasMounted();

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);
  const discountCode = useCartStore((s) => s.discountCode);
  const setDiscountCode = useCartStore((s) => s.setDiscountCode);

  const [codeInput, setCodeInput] = useState("");
  const [discountResult, setDiscountResult] = useState<DiscountValidationResult | null>(null);
  const [shipping, setShipping] = useState<{ cost: number; isFree: boolean; freeShippingThreshold: number | null } | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!mounted) return;
    previewShipping(subtotal).then(setShipping);
  }, [mounted, subtotal]);

  useEffect(() => {
    if (!mounted || !discountCode) return;
    checkDiscountCode(discountCode, subtotal).then(setDiscountResult);
  }, [mounted, discountCode, subtotal]);

  function applyDiscount() {
    startTransition(async () => {
      const result = await checkDiscountCode(codeInput, subtotal);
      setDiscountResult(result);
      if (result.ok) {
        setDiscountCode(codeInput.trim().toUpperCase());
        toast.success("کد تخفیف اعمال شد.");
      } else {
        toast.error(result.message);
      }
    });
  }

  function removeDiscount() {
    setDiscountCode(null);
    setDiscountResult(null);
    setCodeInput("");
  }

  const discountAmount = discountResult?.ok ? discountResult.discountAmount : 0;
  const shippingCost = shipping?.cost ?? 0;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 md:px-10">
        <EmptyState
          icon={ShoppingBag}
          title="سبد خرید شما خالی است"
          description="محصولی برای نمایش وجود ندارد — از فروشگاه شروع کنید."
          actionLabel="مشاهده فروشگاه"
          actionHref="/shop"
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <h1 className="mb-7 text-[28px] font-black tracking-tight md:text-[38px]">سبد خرید</h1>

      <div className="flex flex-wrap items-start gap-5.5">
        <div className="min-w-0 flex-[999_1_400px] space-y-3">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex flex-wrap items-center gap-3.5 rounded-[18px] border border-border bg-surface p-3.5"
            >
              <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[14px] bg-surface-sunken">
                <ProductImage src={item.image} alt={item.name} />
              </div>
              <div className="min-w-[140px] flex-1">
                <Link href={`/product/${item.slug}`} className="mb-1.5 block text-[15px] font-bold">
                  {item.name}
                </Link>
                <div className="mb-2.5 text-xs text-muted">
                  {item.size && `سایز ${item.size}`} {item.size && item.color && "·"} {item.color}
                </div>
                <div className="text-base font-extrabold text-brand">
                  {formatToman(item.price)} <span className="text-[11px] font-medium text-muted">تومان</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <QuantityStepper
                  quantity={item.quantity}
                  onIncrement={() => increment(item.variantId)}
                  onDecrement={() => decrement(item.variantId)}
                />
                <button
                  onClick={() => remove(item.variantId)}
                  className="text-muted transition-colors hover:text-brand"
                  aria-label="حذف از سبد خرید"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2.5 rounded-[18px] border border-dashed border-border bg-surface p-3.5">
            {discountCode ? (
              <div className="flex flex-1 items-center justify-between rounded-xl bg-surface-sunken px-3.5 py-3">
                <span className="text-sm">
                  کد <b>{discountCode}</b> اعمال شد {discountResult?.ok && `(${discountResult.label})`}
                </span>
                <button onClick={removeDiscount} className="text-muted hover:text-brand">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="کد تخفیف"
                  className="h-[46px] flex-1 basis-[150px]"
                />
                <Button onClick={applyDiscount} disabled={pending || !codeInput} variant="secondary" className="h-[46px]">
                  اعمال
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="sticky top-[92px] w-full max-w-[380px] flex-1 basis-[280px] rounded-[20px] border border-border bg-surface p-6">
          <div className="mb-5 text-base font-extrabold">خلاصه سفارش</div>
          <div className="mb-4.5 flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">جمع کالاها</span>
              <span className="font-semibold">{formatToman(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted">تخفیف</span>
                <span className="font-semibold text-brand-hover">-{formatToman(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted">هزینه ارسال</span>
              <span className={shipping?.isFree ? "font-semibold text-brand-hover" : "font-semibold"}>
                {shipping ? (shipping.isFree ? "رایگان" : formatToman(shippingCost)) : "…"}
              </span>
            </div>
          </div>
          <div className="mb-5.5 flex items-baseline justify-between border-t border-border pt-4.5">
            <span className="text-[15px] font-extrabold">مبلغ نهایی</span>
            <span className="text-xl font-black text-brand">{formatToman(total)}</span>
          </div>
          <Button asChild className="w-full">
            <Link href="/checkout">ادامه و تسویه حساب</Link>
          </Button>
          <Link href="/shop" className="mt-3.5 block text-center text-[13px] text-muted">
            ادامه خرید
          </Link>
        </div>
      </div>
    </main>
  );
}
