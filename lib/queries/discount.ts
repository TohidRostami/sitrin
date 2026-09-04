import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export type DiscountValidationResult =
  | { ok: true; discountAmount: number; discountCodeId: string; label: string }
  | { ok: false; message: string };

type DbClient = typeof prisma | Prisma.TransactionClient;

export async function validateDiscountCode(
  code: string,
  subtotal: number,
  client: DbClient = prisma
): Promise<DiscountValidationResult> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: false, message: "کد تخفیف را وارد کنید." };

  const discount = await client.discountCode.findUnique({ where: { code: normalized } });

  if (!discount || !discount.isActive) {
    return { ok: false, message: "کد تخفیف نامعتبر است." };
  }
  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return { ok: false, message: "این کد تخفیف منقضی شده است." };
  }
  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
    return { ok: false, message: "ظرفیت استفاده از این کد تخفیف تمام شده است." };
  }
  if (discount.minOrderTotal !== null && subtotal < discount.minOrderTotal) {
    return {
      ok: false,
      message: `این کد تخفیف فقط برای سفارش‌های بالای ${discount.minOrderTotal.toLocaleString("fa-IR")} تومان معتبر است.`,
    };
  }

  const amount =
    discount.type === "PERCENTAGE"
      ? Math.round((subtotal * discount.value) / 100)
      : Math.min(discount.value, subtotal);

  const label =
    discount.type === "PERCENTAGE" ? `٪${discount.value} تخفیف` : `${discount.value.toLocaleString("fa-IR")} تومان تخفیف`;

  return { ok: true, discountAmount: amount, discountCodeId: discount.id, label };
}
