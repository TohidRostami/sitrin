import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { getOrderById, orderStatusLabel } from "@/lib/queries/orders";
import { ProductImage } from "@/components/shared/product-image";
import { formatToman, formatJalaliDateTime } from "@/lib/format";

export const metadata = { title: "جزئیات سفارش" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession();
  const order = await getOrderById(id, session!.user.id);
  if (!order) notFound();

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-border bg-surface p-6">
        <div className="mb-4.5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-base font-extrabold">سفارش {order.orderNumber}</div>
            <div className="mt-1 text-xs text-muted">{formatJalaliDateTime(order.createdAt)}</div>
          </div>
          <span className="rounded-full bg-border px-3.5 py-1.5 text-[12px] font-bold">
            {orderStatusLabel(order.status)}
          </span>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3.5">
              <div className="relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                <ProductImage src={item.product.images[0]?.url} alt={item.name} />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${item.product.slug}`} className="block truncate text-sm font-bold">
                  {item.name}
                </Link>
                <div className="mt-1 text-xs text-muted">
                  {item.size && `سایز ${item.size}`} {item.size && item.color && "·"} {item.color} · {item.quantity} عدد
                </div>
              </div>
              <div className="text-sm font-extrabold">{formatToman(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="mt-4.5 flex flex-col gap-2.5 border-t border-border pt-4.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">جمع کالاها</span>
            <span className="font-semibold">{formatToman(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted">تخفیف</span>
              <span className="font-semibold text-brand-hover">-{formatToman(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">هزینه ارسال</span>
            <span className="font-semibold">{order.shippingCost === 0 ? "رایگان" : formatToman(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2.5 text-base font-extrabold">
            <span>مبلغ نهایی</span>
            <span className="text-brand">{formatToman(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-border bg-surface p-6">
        <div className="mb-3 text-sm font-extrabold">آدرس تحویل</div>
        <div className="text-sm leading-7 text-muted">
          {order.address.fullName} · {order.address.phone}
          <br />
          {order.address.province}، {order.address.city}، {order.address.addressLine} — {order.address.postalCode}
        </div>
      </div>
    </div>
  );
}
