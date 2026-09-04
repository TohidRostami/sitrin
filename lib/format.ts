import { toJalaali } from "jalaali-js";

const numberFormatter = new Intl.NumberFormat("fa-IR");

/** 6950000 -> "۶٬۹۵۰٬۰۰۰" (رقم فارسی + جداکننده هزارگان، دقیقاً مطابق طراحی) */
export function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value));
}

/** همان formatNumber، برای وقتی که لازم است واحد «تومان» هم کنارش باشد. */
export function formatToman(value: number): string {
  return formatNumber(value);
}

const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/** Date -> "۲۸ مرداد ۱۴۰۵" */
export function formatJalaliDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { jy, jm, jd } = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${formatNumber(jd)} ${JALALI_MONTHS[jm - 1]} ${formatNumber(jy)}`;
}

/** Date -> "۲۸ مرداد ۱۴۰۵ - ۱۴:۰۵" */
export function formatJalaliDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const time = `${formatNumber(d.getHours()).padStart(2, "۰")}:${formatNumber(d.getMinutes()).padStart(2, "۰")}`;
  return `${formatJalaliDate(d)} - ${time}`;
}

/**
 * ورودی آزاد کاربر (با فاصله، خط‌تیره، صفر ابتدایی یا +۹۸) را به فرمت یکدست
 * 09XXXXXXXXX برمی‌گرداند، یا اگر معتبر نبود null.
 */
export function normalizeIranPhone(input: string): string | null {
  const digits = input
    .replace(/[۰-۹]/g, (ch) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(ch)))
    .replace(/\D/g, "");

  let n = digits;
  if (n.startsWith("0098")) n = n.slice(4);
  else if (n.startsWith("98")) n = n.slice(2);
  if (n.startsWith("9") && n.length === 10) n = "0" + n;

  return /^09\d{9}$/.test(n) ? n : null;
}

/** خروجی مناسب برای فرستادن به Better Auth (فرمت +98) */
export function toE164IranPhone(localPhone: string): string {
  return `+98${localPhone.slice(1)}`;
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(
    /[0-9]/g,
    (digit) => PERSIAN_DIGITS[Number(digit)],
  );
}

export function formatPrice(value: number): string {
  return toPersianDigits(new Intl.NumberFormat("en-US").format(value));
}