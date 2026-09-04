import { prisma } from "@/lib/db";

export async function listOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { slug: true, images: { take: 1, select: { url: true } } } } } },
    },
  });
}

export async function getOrderById(id: string, userId: string) {
  return prisma.order.findFirst({
    where: { id, userId },
    include: {
      address: true,
      discountCode: true,
      items: {
        include: { product: { select: { slug: true, images: { take: 1, select: { url: true } } } } },
      },
    },
  });
}

/** SIT-140805-4821 شکل — تاریخ + بخش تصادفی، برای نمایش به مشتری. */
export function generateOrderNumber() {
  const d = new Date();
  const datePart = `${d.getFullYear() % 100}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `SIT-${datePart}-${randomPart}`;
}

const STATUS_LABELS_FA: Record<string, string> = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  PAID: "پرداخت‌شده",
  PROCESSING: "در حال آماده‌سازی",
  SHIPPED: "در حال ارسال",
  DELIVERED: "تحویل شد",
  CANCELLED: "لغو شده",
  REFUNDED: "بازگشت وجه",
};

export function orderStatusLabel(status: string) {
  return STATUS_LABELS_FA[status] ?? status;
}
