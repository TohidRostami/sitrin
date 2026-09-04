import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations/contact";

/**
 * فعلاً فقط اعتبارسنجی می‌کند و در کنسول لاگ می‌کند — هیچ سرویس خبرنامه
 * (Mailchimp، SendGrid و ...) در package.json نصب نیست و schema.prisma هم
 * مدلی برای مشترکین ندارد. برای اتصال واقعی، این‌جا را به API همان سرویس
 * وصل کنید یا یک مدل NewsletterSubscriber به schema اضافه کنید.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "ایمیل معتبر نیست." }, { status: 400 });
  }

  console.log("📬 عضویت خبرنامه (هنوز به سرویس واقعی وصل نشده):", parsed.data.email);
  return NextResponse.json({ ok: true });
}
