"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { reviewSchema, type ReviewInput } from "@/lib/validations/contact";

export async function submitReview(rawInput: ReviewInput) {
  const session = await getServerSession();
  if (!session) return { ok: false as const, message: "برای ثبت دیدگاه ابتدا وارد حساب کاربری شوید." };

  const parsed = reviewSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است." };

  try {
    await prisma.review.create({
      data: {
        productId: parsed.data.productId,
        userId: session.user.id,
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
      },
    });
  } catch {
    return { ok: false as const, message: "شما قبلاً برای این محصول دیدگاه ثبت کرده‌اید." };
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId }, select: { slug: true } });
  if (product) revalidatePath(`/product/${product.slug}`);

  return { ok: true as const, message: "ممنون! دیدگاه شما بعد از تأیید نمایش داده می‌شود." };
}
