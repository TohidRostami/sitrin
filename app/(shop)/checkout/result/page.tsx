import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export const metadata = { title: "نتیجه پرداخت" };

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; status?: string }>;
}) {
  const { order: orderId, status } = await searchParams;
  const session = await getServerSession();
  const order = orderId && session ? await prisma.order.findFirst({ where: { id: orderId, userId: session.user.id } }) : null;

  const success = status === "success";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-14 text-center">
      {success ? (
        <CheckCircle2 className="mb-5 h-16 w-16 text-brand" strokeWidth={1.3} />
      ) : (
        <XCircle className="mb-5 h-16 w-16 text-muted" strokeWidth={1.3} />
      )}
      <h1 className="mb-2 text-2xl font-black">{success ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}</h1>
      <p className="mb-8 max-w-xs text-sm leading-7 text-muted">
        {success
          ? `سفارش ${order?.orderNumber ?? ""} ثبت شد. جزئیات را می‌توانید از حساب کاربری‌تان پیگیری کنید.`
          : "مبلغی از حساب شما کسر نشده. می‌توانید دوباره تلاش کنید یا با پشتیبانی تماس بگیرید."}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {success ? (
          <Button asChild>
            <Link href="/account/orders">مشاهده سفارش‌ها</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/checkout">تلاش دوباره</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/shop">بازگشت به فروشگاه</Link>
        </Button>
      </div>
    </main>
  );
}
