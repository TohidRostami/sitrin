import "dotenv/config";
import { prisma } from "../lib/db";

const SIZES = ["۳۹", "۴۰", "۴۱", "۴۲", "۴۳", "۴۴", "۴۵", "۴۶"];

const CATEGORIES = [
  { slug: "running", title: "دویدن", sortOrder: 0 },
  { slug: "basketball", title: "بسکتبال", sortOrder: 1 },
  { slug: "lifestyle", title: "لایف‌استایل", sortOrder: 2 },
  { slug: "skate", title: "اسکیت", sortOrder: 3 },
  { slug: "training", title: "تمرین", sortOrder: 4 },
];

const COLOR_PALETTE: Record<string, string> = {
  "مشکی/قرمز": "#111010",
  "سفید": "#FCFBFA",
  "مشکی": "#111111",
  "خاکستری": "#6B7280",
  "آبی نیوی": "#1F2A44",
  "قرمز": "#C61E1C",
};

const PRODUCTS: {
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  colors: string[];
  description: string;
}[] = [
  {
    name: "سیترین رانر X۱",
    slug: "sitrin-runner-x1",
    category: "running",
    price: 4_250_000,
    isNew: true,
    colors: ["مشکی/قرمز", "سفید"],
    description:
      "طراحی‌شده برای دویدن روزانه — میان‌کف فوم واکنشی که ضربه را جذب می‌کند و رویه مش تنفس‌پذیر برای پاهای خنک در طول مسیر.",
  },
  {
    name: "اربن فلکس ۲.۰",
    slug: "urban-flex-2",
    category: "lifestyle",
    price: 3_890_000,
    isFeatured: true,
    colors: ["سفید", "خاکستری"],
    description: "یک کفش روزمره با ظاهر مینیمال و راحتی بالا؛ مناسب از پیاده‌روی شهری تا یک روز کاری کامل.",
  },
  {
    name: "سیترین OG های",
    slug: "sitrin-og-high",
    category: "basketball",
    price: 6_950_000,
    compareAtPrice: 8_200_000,
    colors: ["مشکی/قرمز", "سفید", "آبی نیوی"],
    description:
      "طراحی کلاسیک، راحتی مدرن. رویه چرم طبیعی، میان‌کف فوم واکنشی و زیره لاستیکی ضدلغزش. ساخته‌شده برای شهر و هر چیزی که در راه است.",
  },
  {
    name: "استریت وایب لو",
    slug: "street-vibe-low",
    category: "skate",
    price: 2_990_000,
    compareAtPrice: 3_737_000,
    colors: ["مشکی", "سفید"],
    description: "کفی ضخیم برای جذب ضربه روی بتن، رویه بادوام برای اسکیت روزانه، و ظاهری که بیرون از پارک اسکیت هم جواب می‌دهد.",
  },
  {
    name: "سیترین بوست پرو",
    slug: "sitrin-boost-pro",
    category: "training",
    price: 5_400_000,
    isNew: true,
    colors: ["مشکی/قرمز", "خاکستری"],
    description: "ثبات جانبی برای حرکات چندجهته، پاشنه محکم و رویه سبک — برای تمرین‌های ترکیبی و روزهای پا.",
  },
  {
    name: "کورت کلاسیک",
    slug: "court-classic",
    category: "lifestyle",
    price: 3_150_000,
    isFeatured: true,
    colors: ["سفید", "مشکی"],
    description: "الهام‌گرفته از کفش‌های کلاسیک تنیس؛ رویه چرمی تمیز و زیره تخت برای استایل روزمره.",
  },
  {
    name: "تریل گارد",
    slug: "trail-guard",
    category: "running",
    price: 4_780_000,
    isNew: true,
    colors: ["خاکستری", "مشکی/قرمز"],
    description: "آج عمیق برای سطوح ناهموار، رویه ضدآب سبک، و محافظ نوک پا برای دویدن در طبیعت.",
  },
  {
    name: "سیترین ایر مکس",
    slug: "sitrin-air-max",
    category: "basketball",
    price: 7_200_000,
    isFeatured: true,
    colors: ["مشکی/قرمز", "آبی نیوی"],
    description: "میان‌کف بادی برای برگشت انرژی بالا در پرش‌ها، و یقه بلند برای حمایت مچ پا زیر سبد.",
  },
  {
    name: "پیس واکر",
    slug: "pace-walker",
    category: "training",
    price: 2_690_000,
    colors: ["سفید", "خاکستری"],
    description: "سبک و منعطف، برای تمرین‌های کاردیو و پیاده‌روی تند روزانه.",
  },
  {
    name: "نایت رانر بلک‌اوت",
    slug: "night-runner-blackout",
    category: "running",
    price: 4_990_000,
    isNew: true,
    colors: ["مشکی"],
    description: "بدنه کاملاً مشکی با جزئیات بازتاب‌دهنده نور برای دویدن‌های شب.",
  },
  {
    name: "دک لو",
    slug: "deck-low",
    category: "skate",
    price: 2_450_000,
    colors: ["سفید", "قرمز"],
    description: "کلاسیک، ساده و بادوام — یک کتانی روزمره برای هر ترکیبی از لباس.",
  },
  {
    name: "پاور لیفت",
    slug: "power-lift",
    category: "training",
    price: 3_990_000,
    colors: ["مشکی", "قرمز"],
    description: "پاشنه صاف و پایدار برای تمرین‌های قدرتی، با گیرایی بالا روی زمین سالن.",
  },
  {
    name: "میدسیتی مید",
    slug: "midcity-mid",
    category: "lifestyle",
    price: 3_590_000,
    colors: ["خاکستری", "سفید"],
    description: "یقه متوسط با ظاهری شهری، مناسب فصل‌های خنک‌تر سال.",
  },
  {
    name: "کلاچ های‌تاپ",
    slug: "clutch-hi-top",
    category: "basketball",
    price: 6_450_000,
    colors: ["مشکی/قرمز", "سفید"],
    description: "حمایت مچ پا در حد بالا با وزنی سبک‌تر از حد انتظار — برای بازیکنانی که سرعت را فدا نمی‌کنند.",
  },
];

async function main() {
  console.log("🌱 شروع seed...");

  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      emailLoginEnabled: true,
      smsLoginEnabled: true,
      freeShippingThreshold: 5_000_000,
      standardShippingCost: 85_000,
    },
  });

  const sizeRecords = await Promise.all(
    SIZES.map((name, i) =>
      prisma.size.upsert({ where: { name }, update: {}, create: { name, sortOrder: i } })
    )
  );

  const categoryRecords = new Map<string, string>();
  for (const c of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { title: c.title, sortOrder: c.sortOrder },
      create: c,
    });
    categoryRecords.set(c.slug, record.id);
  }

  for (const p of PRODUCTS) {
    const categoryId = categoryRecords.get(p.category);
    if (!categoryId) continue;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        categoryId,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        categoryId,
      },
    });

    const colorRecords = await Promise.all(
      p.colors.map((name, i) =>
        prisma.color.upsert({
          where: { productId_name: { productId: product.id, name } },
          update: {},
          create: { productId: product.id, name, hexValue: COLOR_PALETTE[name] ?? "#2C2A29", sortOrder: i },
        })
      )
    );

    // هر محصول در ۵ تا ۷ سایز میانی موجود است؛ چند ترکیب هم عمداً ناموجود
    // گذاشته شده (stock: 0) تا حالت «ناموجود» روی PDP هم قابل تست باشد.
    const midSizes = sizeRecords.slice(1, 7);
    for (const size of midSizes) {
      for (const color of colorRecords) {
        const stock = Math.random() > 0.15 ? Math.floor(Math.random() * 15) + 1 : 0;
        await prisma.productVariant.upsert({
          where: { productId_sizeId_colorId: { productId: product.id, sizeId: size.id, colorId: color.id } },
          update: { stock },
          create: { productId: product.id, sizeId: size.id, colorId: color.id, stock },
        });
      }
    }
  }

  await prisma.discountCode.upsert({
    where: { code: "SITRIN20" },
    update: {},
    create: { code: "SITRIN20", type: "PERCENTAGE", value: 20, isActive: true },
  });
  await prisma.discountCode.upsert({
    where: { code: "WELCOME100" },
    update: {},
    create: {
      code: "WELCOME100",
      type: "FIXED",
      value: 100_000,
      minOrderTotal: 1_000_000,
      isActive: true,
    },
  });

  console.log(`✅ seed تمام شد — ${PRODUCTS.length} محصول در ${CATEGORIES.length} دسته‌بندی.`);
  console.log(
    "ℹ️  عکس محصولات عمداً خالی گذاشته شده (چون در طراحی فقط موکاپ برندهای دیگر بود) — از پنل ادمین آپلود کنید."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
