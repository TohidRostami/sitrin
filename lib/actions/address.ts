"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { addressSchema, type AddressInput } from "@/lib/validations/address";

type ActionResult = { ok: true; id: string } | { ok: false; message: string };

export async function createAddress(rawInput: AddressInput): Promise<ActionResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "ابتدا وارد حساب کاربری شوید." };

  const parsed = addressSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است." };

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({ data: { ...parsed.data, userId: session.user.id } });
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { ok: true, id: address.id };
}

export async function updateAddress(id: string, rawInput: AddressInput): Promise<ActionResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "ابتدا وارد حساب کاربری شوید." };

  const existing = await prisma.address.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return { ok: false, message: "آدرس پیدا نشد." };

  const parsed = addressSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است." };

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  await prisma.address.update({ where: { id }, data: parsed.data });
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { ok: true, id };
}

export async function deleteAddress(id: string): Promise<{ ok: boolean; message?: string }> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "ابتدا وارد حساب کاربری شوید." };

  const existing = await prisma.address.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return { ok: false, message: "آدرس پیدا نشد." };

  // اگر این آدرس روی سفارش‌های قبلی استفاده شده، حذفش با onDelete: Restrict جلوگیری می‌شود.
  try {
    await prisma.address.delete({ where: { id } });
  } catch {
    return { ok: false, message: "این آدرس روی سفارش‌های قبلی استفاده شده و قابل حذف نیست." };
  }

  revalidatePath("/account/addresses");
  return { ok: true };
}
