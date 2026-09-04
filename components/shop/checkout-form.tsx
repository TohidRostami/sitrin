"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/shared/product-image";
import { EmptyState } from "@/components/shared/empty-state";
import { AddressForm } from "@/components/account/address-form";
import { useCartStore } from "@/lib/cart-store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { formatToman } from "@/lib/format";
import { checkDiscountCode } from "@/lib/actions/discount";
import { previewShipping } from "@/lib/actions/shipping";
import { createOrder } from "@/lib/actions/checkout";
import { cn } from "@/lib/utils";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  addressLine: string;
  isDefault: boolean;
};

export function CheckoutForm({ addresses: initialAddresses }: { addresses: Address[] }) {
  const router = useRouter();
  const mounted = useHasMounted();

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const discountCode = useCartStore((s) => s.discountCode);
  const clearCart = useCartStore((s) => s.clear);

  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialAddresses.find((a) => a.isDefault)?.id ?? initialAddresses[0]?.id
  );
  const [showNewAddress, setShowNewAddress] = useState(initialAddresses.length === 0);

  const [shipping, setShipping] = useState<{ cost: number; isFree: boolean } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [placing, startPlacing] = useTransition();

  useEffect(() => {
    if (!mounted) return;
    previewShipping(subtotal).then(setShipping);
  }, [mounted, subtotal]);

  useEffect(() => {
    if (!mounted || !discountCode) return;
    checkDiscountCode(discountCode, subtotal).then((r) => setDiscountAmount(r.ok ? r.discountAmount : 0));
  }, [mounted, discountCode, subtotal]);

  const shippingCost = shipping?.cost ?? 0;
  const effectiveDiscountAmount = discountCode ? discountAmount : 0;
  const total = Math.max(0, subtotal - effectiveDiscountAmount + shippingCost);

  const selectedAddress = useMemo(() => addresses.find((a) => a.id === selectedId), [addresses, selectedId]);

  function handlePlaceOrder() {
    if (!selectedId) {
      toast.error("یک آدرس تحویل انتخاب کنید.");
      return;
    }
    startPlacing(async () => {
      const result = await createOrder({
        addressId: selectedId,
        discountCode: discountCode ?? undefined,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      });
      if (result.ok) {
        clearCart();
        router.push(result.redirectUrl);
      } else {
        toast.error(result.message);
      }
    });
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="سبد خرید شما خالی است"
        description="برای تسویه حساب، ابتدا محصولی به سبد خرید اضافه کنید."
        actionLabel="مشاهده فروشگاه"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-5.5">
      <div className="min-w-0 flex-[999_1_400px] space-y-4">
        <section className="rounded-[20px] border border-border bg-surface p-6">
          <div className="mb-4.5 flex items-center justify-between">
            <div className="text-[15px] font-extrabold">آدرس تحویل</div>
            {!showNewAddress && (
              <button
                onClick={() => setShowNewAddress(true)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-hover"
              >
                <Plus className="h-3.5 w-3.5" /> آدرس جدید
              </button>
            )}
          </div>

          {!showNewAddress && addresses.length > 0 && (
            <div className="space-y-2.5">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                    selectedId === addr.id ? "border-brand bg-brand/[0.06]" : "border-border"
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1 accent-brand"
                    checked={selectedId === addr.id}
                    onChange={() => setSelectedId(addr.id)}
                  />
                  <div className="text-sm">
                    <div className="mb-1 font-bold">
                      {addr.fullName} · {addr.phone}
                    </div>
                    <div className="text-muted">
                      {addr.province}، {addr.city}، {addr.addressLine} — {addr.postalCode}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {showNewAddress && (
            <div>
              <AddressForm
                submitLabel="ذخیره و انتخاب این آدرس"
                onSuccess={(id, values) => {
                  setAddresses((prev) => [...prev, { id, ...values } as Address]);
                  setSelectedId(id);
                  setShowNewAddress(false);
                }}
              />
              {addresses.length > 0 && (
                <button
                  onClick={() => setShowNewAddress(false)}
                  className="mt-3 text-[13px] text-muted hover:text-ink"
                >
                  انصراف
                </button>
              )}
            </div>
          )}
        </section>

        <section className="rounded-[20px] border border-border bg-surface p-6">
          <div className="mb-4.5 text-[15px] font-extrabold">روش ارسال</div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-brand bg-brand/[0.08] p-4">
            <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-brand">
              <span className="h-2 w-2 rounded-full bg-brand" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-bold">{shipping?.isFree ? "ارسال رایگان" : "ارسال استاندارد"}</div>
              <div className="mt-1 text-xs text-muted">تحویل ۲ تا ۴ روز کاری</div>
            </div>
            <div className="text-[13px] font-bold text-brand-hover">
              {shipping ? (shipping.isFree ? "رایگان" : formatToman(shippingCost)) : "…"}
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border border-border bg-surface p-6">
          <div className="mb-4.5 text-[15px] font-extrabold">روش پرداخت</div>
          <div className="flex items-center gap-3.5 rounded-2xl border border-brand bg-brand/[0.08] p-4">
            <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-brand">
              <span className="h-2 w-2 rounded-full bg-brand" />
            </span>
            <div className="text-sm font-semibold">پرداخت اینترنتی (درگاه بانکی)</div>
          </div>
        </section>
      </div>

      <div className="sticky top-[92px] w-full max-w-[380px] flex-1 basis-[280px] rounded-[20px] border border-border bg-surface p-6">
        <div className="mb-4.5 text-base font-extrabold">سفارش شما</div>
        <div className="mb-4.5 flex flex-col gap-3">
          {items.map((i) => (
            <div key={i.variantId} className="flex items-center gap-2.5">
              <div className="relative h-[46px] w-[46px] shrink-0 overflow-hidden rounded-[10px] bg-surface-sunken">
                <ProductImage src={i.image} alt={i.name} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold">{i.name}</div>
                <div className="mt-0.5 text-[11px] text-muted">{i.quantity} عدد</div>
              </div>
              <div className="text-[13px] font-bold">{formatToman(i.price * i.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 border-t border-border pt-4">
          <div className="flex justify-between text-[13.5px]">
            <span className="text-muted">جمع کالاها</span>
            <span className="font-semibold">{formatToman(subtotal)}</span>
          </div>
          {effectiveDiscountAmount > 0 && (
            <div className="flex justify-between text-[13.5px]">
              <span className="text-muted">تخفیف</span>
              <span className="font-semibold text-brand-hover">-{formatToman(effectiveDiscountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[13.5px]">
            <span className="text-muted">هزینه ارسال</span>
            <span className="font-semibold">{shipping?.isFree ? "رایگان" : formatToman(shippingCost)}</span>
          </div>
        </div>
        <div className="mb-5 mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-[15px] font-extrabold">مبلغ نهایی</span>
          <span className="text-xl font-black text-brand">{formatToman(total)}</span>
        </div>
        <Button onClick={handlePlaceOrder} disabled={placing || !selectedAddress} className="w-full">
          ثبت و پرداخت سفارش
        </Button>
        <p className="mt-3.5 text-center text-[11px] text-muted">پرداخت امن با درگاه بانکی · SSL</p>
        <Link href="/cart" className="mt-2 block text-center text-[11px] text-muted hover:text-ink">
          بازگشت به سبد خرید
        </Link>
      </div>
    </div>
  );
}
