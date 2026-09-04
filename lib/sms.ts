/**
 * نقطه‌ی اتصال سرویس پیامک. تا وقتی SMS_PROVIDER_API_KEY خالی باشد، کد OTP
 * فقط در کنسول سرور لاگ می‌شود (مناسب توسعه محلی) — بقیه مسیر ورود/ثبت‌نام
 * (لیمیت تلاش، انقضای کد و...) در lib/auth.ts از قبل کار می‌کند.
 *
 * برای اتصال Kavenegar (سرویس پیامکی که در package.json نصب است)، بلاک
 * کامنت‌شده‌ی زیر را باز کنید و مقدار SMS_PROVIDER_API_KEY /
 * SMS_PROVIDER_SENDER را در .env تنظیم کنید.
 */
export async function sendOtpSms(phoneNumber: string, code: string): Promise<void> {
  const apiKey = process.env.SMS_PROVIDER_API_KEY;

  if (!apiKey) {
    console.log(`📱 [OTP توسعه] کد ${code} برای ${phoneNumber}`);
    return;
  }

  try {
    // --- نمونه اتصال به Kavenegar ---------------------------------
    // import Kavenegar from "kavenegar";
    // const api = Kavenegar.KavenegarApi({ apikey: apiKey });
    // await new Promise<void>((resolve, reject) => {
    //   api.VerifyLookup(
    //     {
    //       receptor: phoneNumber,
    //       token: code,
    //       template: "sitrin-otp", // نام قالب باید در پنل Kavenegar ساخته شده باشد
    //     },
    //     (_response: unknown, status: number) => {
    //       if (status === 200) resolve();
    //       else reject(new Error(`Kavenegar status ${status}`));
    //     }
    //   );
    // });
    // ----------------------------------------------------------------
    console.warn(
      "SMS_PROVIDER_API_KEY تنظیم شده اما پیاده‌سازی واقعی sendOtpSms هنوز کامنت است — بلاک بالا را باز کنید."
    );
    console.log(`📱 [OTP] کد ${code} برای ${phoneNumber}`);
  } catch (error) {
    console.error("ارسال پیامک OTP با خطا مواجه شد:", error);
    throw error;
  }
}
