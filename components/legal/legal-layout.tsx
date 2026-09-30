import type { ReactNode } from "react";
import Link from "next/link";

/**
 * پوسته‌ی مشترک چهار صفحه‌ی قانونی (قوانین خرید، بازگشت کالا، ارسال،
 * حریم خصوصی) — فقط ساختار/تایپوگرافی رو یکدست می‌کنه، محتوا مال خودِ صفحه‌ست.
 */
export function LegalLayout({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string;
  lastUpdated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-16">
      <div className="mb-10 border-b border-border pb-6">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            خانه
          </Link>
          <span>/</span>
          <span>{title}</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          آخرین به‌روزرسانی: {lastUpdated}
        </p>
        {intro && (
          <p className="mt-4 max-w-[65ch] text-[15px] leading-8 text-muted-foreground">
            {intro}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-9">{children}</div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      <div className="flex flex-col gap-3 text-[14.5px] leading-8 text-muted-foreground [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_li]:mr-1 [&_ol]:list-decimal [&_ol]:pr-5 [&_ul]:list-disc [&_ul]:pr-5">
        {children}
      </div>
    </section>
  );
}
