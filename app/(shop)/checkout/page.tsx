import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { listAddressesForUser } from "@/lib/queries/addresses";
import { CheckoutForm } from "@/components/shop/checkout-form";

export const metadata = { title: "تسویه حساب" };

export default async function CheckoutPage() {
  const session = await getServerSession();
  if (!session) redirect("/login?next=/checkout");

  const addresses = await listAddressesForUser(session.user.id);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <h1 className="mb-2 text-[28px] font-black tracking-tight md:text-[38px]">تسویه حساب</h1>
      <div className="mb-7 flex items-center gap-2.5 text-[13px]">
        <span className="flex items-center gap-2 text-brand-hover">
          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-brand bg-brand font-extrabold text-ink">
            ۱
          </span>
          اطلاعات
        </span>
        <span className="h-px w-6 bg-border" />
        <span className="flex items-center gap-2 text-muted">
          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-border font-extrabold">
            ۲
          </span>
          پرداخت
        </span>
      </div>

      <CheckoutForm addresses={addresses} />
    </main>
  );
}
