import Link from "next/link";
import { cn } from "@/lib/utils";
import { PhoneOtpDialog } from "@/components/auth/phone-otp-dialog";

export function AuthPanel({
  mode,
  next,
  children,
}: {
  mode: "login" | "register";
  next: string;
  children: React.ReactNode;
}) {
  const isLogin = mode === "login";

  return (
    <main className="grid min-h-[calc(100vh-67px)] grid-cols-1 lg:grid-cols-2">
      <div
        className="relative hidden min-h-[220px] items-end overflow-hidden bg-surface-sunken lg:flex"
        style={{ background: "linear-gradient(135deg, #640E0E, #111010)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent" />
        <div className="relative p-10">
          <div className="font-wordmark text-[38px] leading-[1.05] tracking-[-0.02em]">
            JOIN THE
            <br />
            <span className="text-brand">SITRIN CLUB</span>
          </div>
          <p className="mt-3.5 max-w-[38ch] text-sm leading-8 text-muted">
            دسترسی زودهنگام به دراپ‌ها، تخفیف‌های اختصاصی و ارسال رایگان برای اعضا.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="w-full max-w-[400px]">
          <div className="mb-7 flex rounded-2xl border border-border bg-surface p-1.5">
            <Link
              href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-center text-sm font-bold transition-colors",
                isLogin ? "bg-brand text-ink" : "text-muted"
              )}
            >
              ورود
            </Link>
            <Link
              href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-center text-sm font-bold transition-colors",
                !isLogin ? "bg-brand text-ink" : "text-muted"
              )}
            >
              ثبت‌نام
            </Link>
          </div>

          <h1 className="mb-2 text-[26px] font-black tracking-tight">
            {isLogin ? "خوش برگشتی" : "حساب بساز"}
          </h1>
          <p className="mb-6.5 text-sm text-muted">
            {isLogin ? "برای ادامه وارد حساب کاربری خود شوید." : "در کمتر از یک دقیقه عضو باشگاه سیترین شو."}
          </p>

          {children}

          <div className="my-6 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-border" />
            یا
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              disabled
              title="اتصال گوگل هنوز در lib/auth.ts پیکربندی نشده — به NOTES.md مراجعه کنید."
              className="cursor-not-allowed rounded-xl border border-border py-3.5 text-center text-[13px] font-semibold text-muted/60"
            >
              ورود با گوگل (به‌زودی)
            </button>
            <PhoneOtpDialog next={next} />
          </div>
        </div>
      </div>
    </main>
  );
}
