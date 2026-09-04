"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { validateDiscountCode } from "@/lib/queries/discount";
import { generateOrderNumber } from "@/lib/queries/orders";
import { isGatewayConfigured, initiatePayment } from "@/lib/payment";

export type CheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; message: string };

export async function createOrder(rawInput: CheckoutInput): Promise<CheckoutResult> {
  const session = await getServerSession();
  if (!session) {
    return { ok: false, message: "برای ثبت سفارش ابتدا وارد حساب کاربری‌تان شوید." };
  }

  const parsed = checkoutSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "اطلاعات سفارش نامعتبر است." };
  }
  const input = parsed.data;

  const address = await prisma.address.findFirst({
    where: { id: input.addressId, userId: session.user.id },
  });
  if (!address) {
    return { ok: false, message: "آدرس انتخاب‌شده معتبر نیست." };
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // ۱) دوباره از دیتابیس بخوان: قیمت و موجودی هرگز از کلاینت پذیرفته نمی‌شود.
      const orderItemsData: {
        productId: string;
        variantId: string;
        name: string;
        size: string | null;
        color: string | null;
        price: number;
        quantity: number;
      }[] = [];

      let subtotal = 0;

      for (const line of input.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: line.variantId },
          include: { product: true, size: true, color: true },
        });

        if (!variant || variant.product.isArchived || !variant.product.isPublished) {
          throw new Error("یکی از کالاهای سبد خرید دیگر موجود نیست.");
        }
        if (variant.stock < line.quantity) {
          throw new Error(`موجودی «${variant.product.name}» کافی نیست.`);
        }

        // قفل خوش‌بینانه: اگر همزمان کسی دیگر همین variant را خرید، version
        // دیگر مطابقت ندارد و count صفر می‌شود.
        const updated = await tx.productVariant.updateMany({
          where: { id: variant.id, version: variant.version, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity }, version: { increment: 1 } },
        });
        if (updated.count === 0) {
          throw new Error(`موجودی «${variant.product.name}» هم‌زمان توسط شخص دیگری تغییر کرد — دوباره تلاش کنید.`);
        }

        subtotal += variant.product.price * line.quantity;
        orderItemsData.push({
          productId: variant.productId,
          variantId: variant.id,
          name: variant.product.name,
          size: variant.size?.name ?? null,
          color: variant.color?.name ?? null,
          price: variant.product.price,
          quantity: line.quantity,
        });
      }

      // ۲) کد تخفیف (اختیاری)
      let discountAmount = 0;
      let discountCodeId: string | null = null;
      if (input.discountCode) {
        const result = await validateDiscountCode(input.discountCode, subtotal, tx);
        if (!result.ok) throw new Error(result.message);
        discountAmount = result.discountAmount;
        discountCodeId = result.discountCodeId;
        await tx.discountCode.update({
          where: { id: discountCodeId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // ۳) هزینه ارسال
      const settings =
        (await tx.siteSetting.findUnique({ where: { id: "singleton" } })) ??
        (await tx.siteSetting.create({ data: { id: "singleton" } }));
      const shippingCost =
        settings.freeShippingThreshold !== null && subtotal >= settings.freeShippingThreshold
          ? 0
          : settings.standardShippingCost;

      const total = Math.max(0, subtotal - discountAmount + shippingCost);

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          addressId: address.id,
          status: "PENDING_PAYMENT",
          subtotal,
          discountAmount,
          shippingCost,
          total,
          discountCodeId,
          items: { create: orderItemsData },
        },
      });
    });

    if (isGatewayConfigured()) {
      const { redirectUrl } = await initiatePayment(order.id, order.total);
      return { ok: true, redirectUrl };
    }

    return { ok: true, redirectUrl: `/checkout/payment-simulator?order=${order.id}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : "ثبت سفارش با خطا مواجه شد.";
    return { ok: false, message };
  }
}

/**
 * فقط برای حالت شبیه‌سازی (وقتی درگاه واقعی وصل نیست) — همان کاری که
 * app/api/payment/callback/route.ts بعد از verifyPayment واقعی انجام می‌دهد
 * را این‌جا مستقیم انجام می‌دهیم.
 */
export async function confirmSimulatedPayment(orderId: string, outcome: "success" | "failed") {
  const session = await getServerSession();
  if (!session) return { ok: false as const };

  const order = await prisma.order.findFirst({ where: { id: orderId, userId: session.user.id } });
  if (!order) return { ok: false as const };

  if (outcome === "success") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: new Date(), gatewayRef: "SIMULATOR" },
    });
    return { ok: true as const, status: "success" as const };
  }

  await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
  return { ok: true as const, status: "failed" as const };
}
