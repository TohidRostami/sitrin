/**
 * نقطه‌ی اتصال ایمیل — هیچ سرویس ایمیلی در package.json نصب نیست، پس فعلاً
 * فقط در کنسول سرور لاگ می‌شود. برای اتصال واقعی (مثلاً Resend یا SendGrid)،
 * این تابع را با فراخوانی API همان سرویس کامل کنید.
 *
 * توجه: schema.prisma مدلی برای «پیام‌های تماس» ندارد، پس چیزی در دیتابیس
 * ذخیره نمی‌شود. اگر لازم است پیام‌ها در پنل ادمین هم دیده شوند، یک مدل
 * ContactMessage به schema اضافه کنید و اینجا هم prisma.contactMessage.create
 * را صدا بزنید.
 */
export async function sendContactNotification(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  console.log("📩 پیام تماس با ما (هنوز به سرویس ایمیل واقعی وصل نشده):", payload);
}
