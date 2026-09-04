import { z } from "zod";

export const emailLoginSchema = z.object({
  email: z.string().trim().email("ایمیل معتبر نیست."),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد."),
});

export const emailSignupSchema = z.object({
  name: z.string().trim().min(2, "نام را کامل وارد کنید."),
  email: z.string().trim().email("ایمیل معتبر نیست."),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد."),
});

export const phoneSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)."),
});

export const otpSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/),
  code: z.string().regex(/^\d{6}$/, "کد تأیید باید ۶ رقم باشد."),
});

export type EmailLoginInput = z.infer<typeof emailLoginSchema>;
export type EmailSignupInput = z.infer<typeof emailSignupSchema>;
export type PhoneInput = z.infer<typeof phoneSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
