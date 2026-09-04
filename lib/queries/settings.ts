import { prisma } from "@/lib/db";
export type SiteSettings = {
  emailLoginEnabled: boolean;
  smsLoginEnabled: boolean;
  freeShippingThreshold: number | null;
  standardShippingCost: number;
};

const DEFAULTS: SiteSettings = {
  emailLoginEnabled: true,
  smsLoginEnabled: true,
  freeShippingThreshold: null,
  standardShippingCost: 0,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "singleton" },
  });
  if (!settings) return DEFAULTS;
  return settings as unknown as SiteSettings;
}
/** یک ردیف singleton — اگر هنوز از پنل ادمین ساخته نشده، مقدار پیش‌فرض می‌سازد. */
// export async function getSiteSettings() {
//   const existing = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
//   if (existing) return existing;

//   return prisma.siteSetting.create({
//     data: { id: "singleton" },
//   });
// }

export async function computeShipping(subtotal: number) {
  const settings = await getSiteSettings();
  const isFree =
    settings.freeShippingThreshold !== null &&
    subtotal >= settings.freeShippingThreshold;

  return {
    cost: isFree ? 0 : settings.standardShippingCost,
    isFree,
    freeShippingThreshold: settings.freeShippingThreshold,
  };
}

export async function listActiveHeroImages() {
  return prisma.heroImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}
