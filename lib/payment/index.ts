import { prisma } from "@/lib/db";

export function isGatewayConfigured(): boolean {
  return Boolean(process.env.PAYMENT_GATEWAY_MERCHANT_ID);
}

type InitiateResult = { redirectUrl: string };

/**
 * درخواست پرداخت را به درگاه واقعی می‌فرستد و آدرس ریدایرکت درگاه را
 * برمی‌گرداند. تا وقتی PAYMENT_GATEWAY_MERCHANT_ID خالی باشد، کاربر به
 * /checkout/payment-simulator هدایت می‌شود (چک‌اوت actions این حالت را
 * قبل از صدا زدن این تابع بررسی می‌کند — ببینید lib/actions/checkout.ts).
 */
export async function initiatePayment(orderId: string, amountToman: number): Promise<InitiateResult> {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });

  // --- نمونه اتصال به زرین‌پال -----------------------------------
  // const res = await fetch("https://payment.zarinpal.com/pg/v4/payment/request.json", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     merchant_id: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
  //     amount: amountToman * 10, // ریال
  //     callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback?orderId=${orderId}`,
  //     description: `پرداخت سفارش ${order.orderNumber}`,
  //   }),
  // });
  // const data = await res.json();
  // if (data.data?.code !== 100) throw new Error("خطا در اتصال به درگاه پرداخت");
  // return { redirectUrl: `https://payment.zarinpal.com/pg/StartPay/${data.data.authority}` };
  // ------------------------------------------------------------------

  throw new Error(
    `initiatePayment هنوز به درگاه واقعی وصل نشده (سفارش ${order.orderNumber}). ` +
      "PAYMENT_GATEWAY_MERCHANT_ID را تنظیم کنید و بلاک بالا را کامل کنید."
  );
}

type VerifyResult = { success: boolean; gatewayRef?: string };

/**
 * app/api/payment/callback/route.ts این تابع را صدا می‌زند. باید سفارش را
 * PAID علامت بزند (یا CANCELLED/REFUNDED کند) و gatewayRef را ذخیره کند.
 */
export async function verifyPayment(
  orderId: string,
  params: Record<string, string>
): Promise<VerifyResult> {
  // --- نمونه تایید زرین‌پال ----------------------------------------
  // const authority = params.Authority;
  // const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  // const res = await fetch("https://payment.zarinpal.com/pg/v4/payment/verify.json", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     merchant_id: process.env.PAYMENT_GATEWAY_MERCHANT_ID,
  //     amount: order.total * 10,
  //     authority,
  //   }),
  // });
  // const data = await res.json();
  // const success = data.data?.code === 100 || data.data?.code === 101;
  // await prisma.order.update({
  //   where: { id: orderId },
  //   data: success
  //     ? { status: "PAID", paidAt: new Date(), gatewayRef: String(data.data.ref_id) }
  //     : { status: "CANCELLED" },
  // });
  // return { success, gatewayRef: String(data.data?.ref_id ?? "") };
  // ------------------------------------------------------------------

  void params;
  throw new Error(`verifyPayment هنوز پیاده‌سازی نشده (سفارش ${orderId}).`);
}
