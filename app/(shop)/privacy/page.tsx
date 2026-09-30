import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/legal/legal-layout";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "حریم خصوصی",
  description: `فروشگاه اینترنتی ${siteConfig.site.name} چه اطلاعاتی از شما جمع‌آوری می‌کند و چگونه از آن استفاده و محافظت می‌کند.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="حریم خصوصی"
      lastUpdated="۱۴۰۵/۰۶/۲۴"
      intro={`حفظ حریم خصوصی شما برای ${siteConfig.site.name} اهمیت زیادی دارد. این صفحه دقیقاً توضیح می‌دهد چه اطلاعاتی از شما جمع‌آوری می‌کنیم، چرا، و چگونه از آن محافظت می‌کنیم.`}
    >
      <LegalSection title="۱. چه اطلاعاتی از شما جمع‌آوری می‌کنیم؟">
        <p>هنگام ساخت حساب کاربری، ثبت سفارش، یا ثبت آدرس، اطلاعات زیر ذخیره می‌شود:</p>
        <ul>
          <li>نام و نام خانوادگی</li>
          <li>شماره موبایل (و در صورت ثبت‌نام با ایمیل، آدرس ایمیل)</li>
          <li>آدرس پستی، شهر، استان و کد پستی</li>
          <li>سابقه‌ی سفارش‌ها (کالاهای خریداری‌شده، مبلغ، تاریخ)</li>
          <li>اطلاعات حساب کاربری (رمز عبور به‌صورت رمزنگاری‌شده، نه متن ساده)</li>
        </ul>
        <p>
          <strong className="text-foreground">
            اطلاعات کارت بانکی شما هیچ‌وقت روی سرورهای {siteConfig.site.name} ذخیره
            نمی‌شود
          </strong>
          — پرداخت مستقیماً توسط درگاه بانکی معتبر پردازش می‌شود.
        </p>
      </LegalSection>

      <LegalSection title="۲. این اطلاعات برای چه استفاده می‌شوند؟">
        <ul>
          <li>پردازش، بسته‌بندی و ارسال سفارش‌های شما</li>
          <li>اطلاع‌رسانی وضعیت سفارش از طریق پیامک</li>
          <li>احراز هویت و مدیریت حساب کاربری شما</li>
          <li>پاسخ‌گویی به درخواست‌های پشتیبانی</li>
          <li>بهبود کیفیت فروشگاه و تجربه‌ی خرید</li>
        </ul>
        <p>
          {siteConfig.site.name} هیچ‌گاه اطلاعات شخصی شما را به اشخاص ثالث
          نمی‌فروشد یا برای اهداف تبلیغاتی غیرمرتبط اجاره نمی‌دهد.
        </p>
      </LegalSection>

      <LegalSection title="۳. اطلاعات با چه کسانی به اشتراک گذاشته می‌شود؟">
        <p>
          اطلاعات شما فقط در حد لازم، و صرفاً برای انجام سفارشتان، با این
          سرویس‌ها به اشتراک گذاشته می‌شود:
        </p>
        <ul>
          <li>
            <strong className="text-foreground">درگاه پرداخت بانکی</strong> — برای
            پردازش امن پرداخت.
          </li>
          <li>
            <strong className="text-foreground">شرکت پیامک</strong> — برای ارسال کد
            تأیید ورود و اطلاع‌رسانی وضعیت سفارش.
          </li>
          <li>
            <strong className="text-foreground">شرکت پست/باربری</strong> — نام،
            شماره تماس و آدرس شما، صرفاً برای تحویل مرسوله.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="۴. کوکی‌ها (Cookies)">
        <p>
          وب‌سایت {siteConfig.site.name} از یک کوکی ضروری برای نگه‌داشتن
          ورود شما به حساب کاربری (نشست/Session) استفاده می‌کند. بدون این
          کوکی، امکان ورود و مشاهده‌ی سبد خرید و سفارش‌ها وجود ندارد. این
          کوکی برای ردیابی تبلیغاتی استفاده نمی‌شود.
        </p>
      </LegalSection>

      <LegalSection title="۵. امنیت اطلاعات">
        <p>
          ارتباط شما با وب‌سایت از طریق پروتکل رمزنگاری‌شده‌ی HTTPS برقرار
          می‌شود. رمز عبور حساب کاربری شما به‌صورت هش‌شده (غیرقابل بازگشت به
          حالت اولیه) ذخیره می‌شود و حتی تیم {siteConfig.site.name} هم به رمز
          عبور واقعی شما دسترسی ندارد.
        </p>
      </LegalSection>

      <LegalSection title="۶. حقوق شما">
        <ul>
          <li>مشاهده و ویرایش اطلاعات حساب کاربری خود در هر زمان، از طریق بخش «حساب کاربری».</li>
          <li>درخواست حذف کامل حساب و اطلاعات شخصی، با تماس با پشتیبانی.</li>
          <li>درخواست نسخه‌ای از اطلاعاتی که از شما نگه‌داری می‌شود.</li>
        </ul>
      </LegalSection>

      <LegalSection title="ارتباط با ما">
        <p>
          برای هر سؤال درباره‌ی حریم خصوصی یا درخواست حذف اطلاعات، از طریق{" "}
          <Link href="/contact">صفحه‌ی تماس با ما</Link>، ایمیل{" "}
          <a href={`mailto:${siteConfig.site.email}`}>{siteConfig.site.email}</a>{" "}
          یا شماره‌ی {siteConfig.site.phone} با ما تماس بگیرید.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
