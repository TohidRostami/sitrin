import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { ProductImage } from "@/components/shared/product-image";
import { listOrdersForUser, orderStatusLabel } from "@/lib/queries/orders";
import { prisma } from "@/lib/db";
import { formatToman, formatJalaliDate, formatNumber } from "@/lib/format";

export const metadata = { title: "داشبورد" };

export default async function AccountDashboardPage() {
  const session = await getServerSession();
  const userId = session!.user.id;

  const [orders, favoriteCount] = await Promise.all([
    listOrdersForUser(userId),
    Promise.resolve(0), // علاقه‌مندی‌ها فقط سمت مرورگر است — تعداد واقعی در کامپوننت کلاینت صفحه favorites نمایش داده می‌شود.
  ]);

  const addressCount = await prisma.address.count({ where: { userId } });

  const stats = [
    { v: formatNumber(orders.length), k: "سفارش ثبت‌شده" },
    { v: formatNumber(addressCount), k: "آدرس ذخیره‌شده" },
    { v: formatNumber(favoriteCount), k: "علاقه‌مندی" },
  ];

  return (
    <div>
      <div className="mb-5.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.k} className="rounded-[18px] border border-border bg-surface p-5">
            <div className="mb-1.5 text-[26px] font-black text-brand">{s.v}</div>
            <div className="text-[12.5px] text-muted">{s.k}</div>
          </div>
        ))}
      </div>

      <div className="rounded-[20px] border border-border bg-surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-base font-extrabold">سفارش‌های اخیر</div>
          <Link href="/account/orders" className="text-[13px] font-semibold text-muted hover:text-brand-hover">
            مشاهده همه
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">هنوز سفارشی ثبت نکرده‌اید.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.slice(0, 3).map((o) => (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-border p-4 transition-colors hover:border-brand"
              >
                <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                  <ProductImage src={o.items[0]?.product.images[0]?.url} alt={o.items[0]?.name ?? ""} />
                </div>
                <div className="min-w-[130px] flex-1">
                  <div className="mb-1 text-sm font-bold">{o.items[0]?.name}{o.items.length > 1 && ` + ${formatNumber(o.items.length - 1)} کالای دیگر`}</div>
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
        )}
      </div>
    </div>
  );
}
