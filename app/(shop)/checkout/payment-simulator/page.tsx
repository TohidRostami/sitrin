import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatToman } from "@/lib/format";
import { PaymentSimulatorActions } from "@/components/shop/payment-simulator-actions";

export const metadata = { title: "درگاه شبیه‌سازی‌شده" };

export default async function PaymentSimulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const session = await getServerSession();
  if (!session || !orderId) redirect("/cart");

  const order = await prisma.order.findFirst({ where: { id: orderId, userId: session.user.id } });
  if (!order) redirect("/cart");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-14 text-center">
      <div className="mb-2 rounded-full border border-brand-muted bg-brand/10 px-3.5 py-1.5 text-xs font-bold text-brand-hover">
        درگاه شبیه‌سازی‌شده
      </div>
      <h1 className="mb-2 text-2xl font-black">پرداخت سفارش {order.orderNumber}</h1>
      <p className="mb-1 text-sm text-muted">
        درگاه پرداخت واقعی هنوز به این پروژه وصل نشده (به NOTES.md مراجعه کنید)، پس این صفحه جای آن را می‌گیرد.
      </p>
      <p className="mb-8 text-3xl font-black text-brand">{formatToman(order.total)} <span className="text-sm text-muted">تومان</span></p>

      <PaymentSimulatorActions orderId={order.id} />
    </main>
  );
}
