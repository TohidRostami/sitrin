import Link from "next/link";
import { Package } from "lucide-react";
import { getServerSession } from "@/lib/session";
import { ProductImage } from "@/components/shared/product-image";
import { EmptyState } from "@/components/shared/empty-state";
import { listOrdersForUser, orderStatusLabel } from "@/lib/queries/orders";
import { formatToman, formatJalaliDate, formatNumber } from "@/lib/format";

export const metadata = { title: "سفارش‌های من" };

export default async function OrdersPage() {
  const session = await getServerSession();
  const orders = await listOrdersForUser(session!.user.id);

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="هنوز سفارشی ثبت نکرده‌اید"
        actionLabel="مشاهده فروشگاه"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="rounded-[20px] border border-border bg-surface p-6">
      <div className="mb-5 text-base font-extrabold">سفارش‌های من</div>
      <div className="flex flex-col gap-3">
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/account/orders/${o.id}`}
            className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-border p-4 transition-colors hover:border-brand"
          >
            <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
              <ProductImage src={o.items[0]?.product.images[0]?.url} alt={o.items[0]?.name ?? ""} />
            </div>
            <div className="min-w-[130px] flex-1">
              <div className="mb-1 text-sm font-bold">
                {o.items[0]?.name}
                {o.items.length > 1 && ` + ${formatNumber(o.items.length - 1)} کالای دیگر`}
              </div>
              <div className="text-[11.5px] text-muted">
                سفارش {o.orderNumber} · {formatJalaliDate(o.createdAt)}
              </div>
            </div>
            <span className="whitespace-nowrap rounded-full bg-border px-3 py-1.5 text-[11.5px] font-bold">
              {orderStatusLabel(o.status)}
            </span>
            <div className="text-sm font-extrabold">{formatToman(o.total)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
