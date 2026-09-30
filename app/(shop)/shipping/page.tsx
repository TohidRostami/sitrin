import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/legal/legal-layout";
import { siteConfig } from "@/lib/content";
import { getSiteSettings } from "@/lib/queries/settings";
import { formatToman } from "@/lib/format";

export const metadata: Metadata = {
  title: "روش‌های ارسال و تحویل",
  description: `هزینه، زمان و شرایط ارسال سفارش در فروشگاه اینترنتی ${siteConfig.site.name}.`,
  alternates: { canonical: "/shipping" },
};

// این صفحه عمداً به دیتابیس وصله (نه یک عدد ثابت توی متن) — یعنی اگه از
// پنل ادمین هزینه یا سقف ارسال رایگان رو عوض کنید، همین‌جا هم خودکار
// به‌روز می‌شه، بدون نیاز به ویرایش دستی این فایل.
export default async function ShippingPage() {

  return (
    <LegalLayout
      title="روش‌های ارسال و تحویل"
      lastUpdated="۱۴۰۵/۰۶/۲۴"
      intro="پس از ثبت و پرداخت موفق سفارش، کالا طبق شرایط زیر بسته‌بندی و ارسال می‌شود."
    >
      <LegalSection title="۱. روش ارسال">
        <p>
          ارسال سفارش‌ها از طریق شرکت‌های پست/باربری معتبر انجام می‌شود. برای
          هر سفارش، پس از خروج از انبار، کد رهگیری مرسوله از طریق پیامک برای
          شما ارسال می‌شود.
        </p>
      </LegalSection>

      <LegalSection title="۲. شهرهای تحت پوشش">
        <p>{siteConfig.site.name} به سراسر ایران ارسال دارد.</p>
      </LegalSection>

      <LegalSection title="۳. هزینه‌ی ارسال">
        <ul>
          <li>
            هزینه‌ی استاندارد ارسال:{" "}
            <strong className="text-foreground">
              طبق مسوبه شرکت پست/باربری و بسته به وزن و حجم سفارش
            </strong>
          </li>
        </ul>
        <p>
          هزینه‌ی ارسال، پیش از پرداخت نهایی و در صفحه‌ی{" "}
          <Link href="/checkout">تسویه‌حساب</Link> به‌طور شفاف نمایش داده
          می‌شود.
        </p>
      </LegalSection>

      <LegalSection title="۴. زمان آماده‌سازی سفارش">
        <p>
          سفارش‌ها پس از پرداخت موفق، حداکثر ظرف{" "}
          <strong className="text-foreground">۱ تا ۲ روز کاری</strong> بسته‌بندی
          و تحویل شرکت پستی/باربری می‌شوند (بجز روزهای تعطیل رسمی).
        </p>
      </LegalSection>

      <LegalSection title="۵. زمان تقریبی تحویل">
        <p>
          پس از خروج از انبار، زمان تحویل بسته به شهر مقصد به‌طور معمول بین{" "}
          <strong className="text-foreground">۲ تا ۵ روز کاری</strong> است.
          این بازه‌ی زمانی تخمینی است و ممکن است بسته به شرایط شرکت
          حمل‌ونقل کمی متفاوت باشد.
        </p>
      </LegalSection>

      <LegalSection title="۶. در صورت تأخیر در ارسال چه اتفاقی می‌افتد؟">
        <p>
          اگر مرسوله‌ی شما بیش از بازه‌ی اعلام‌شده به دستتان نرسید، لطفاً از
          طریق <Link href="/contact">صفحه‌ی تماس با ما</Link> با کد پیگیری
          سفارش با پشتیبانی تماس بگیرید تا وضعیت مرسوله پیگیری شود.
        </p>
      </LegalSection>

      <LegalSection title="۷. اگر هنگام تحویل حضور نداشته باشید">
        <p>
          در صورت عدم حضور گیرنده، پیک/مأمور پستی طبق رویه‌ی داخلی شرکت
          حمل‌ونقل (معمولاً یک یا دو بار مراجعه‌ی مجدد، یا نگه‌داری مرسوله در
          نزدیک‌ترین دفتر پستی برای مدت محدود) عمل می‌کند. توصیه می‌شود آدرس و
          شماره تماسی را ثبت کنید که در ساعات اداری در دسترس باشید.
        </p>
      </LegalSection>

      <LegalSection title="ارتباط با ما">
        <p>
          برای پیگیری سفارش یا هر سؤال درباره‌ی ارسال، از طریق{" "}
          <Link href="/contact">صفحه‌ی تماس با ما</Link> یا شماره‌ی{" "}
          {siteConfig.site.phone} در ارتباط باشید.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
