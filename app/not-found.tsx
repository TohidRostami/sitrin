import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/footer";
import { ServerHeader } from "@/components/shared/ServerHeader";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <ServerHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-3 font-wordmark text-[120px] leading-none text-surface-sunken">۴۰۴</div>
        <h1 className="mb-2 text-2xl font-black">این صفحه پیدا نشد</h1>
        <p className="mb-8 max-w-xs text-sm text-muted">شاید لینک اشتباه بوده یا محصول دیگر موجود نیست.</p>
        <Button asChild>
          <Link href="/">بازگشت به خانه</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
