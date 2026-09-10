# syntax=docker/dockerfile:1

# ─── پایه‌ی مشترک ───────────────────────────────────────────────────
# Debian (نه Alpine) چون schema-engine پریزما دقیقاً برای
# "debian-openssl-3.0.x" کامپایل شده (توی خطاهای قبلی خودمون این رو با
# چشم دیدیم) — bookworm همین نسخه‌ی OpenSSL رو داره. build-essential هم
# برای کامپایل native module (better-sqlite3) اگر باینری از‌پیش‌ساخته‌شده
# برای این پلتفرم پیدا نشد.
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ openssl ca-certificates sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# ─── مرحله‌ی نصب وابستگی‌ها ─────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
# ‪--ignore-scripts‬ چون postinstall (prisma generate) به schema.prisma نیاز
# داره که هنوز کپی نشده — عمداً جداگانه توی مرحله‌ی بعد صداش می‌زنیم.
RUN npm ci --ignore-scripts

# ─── مرحله‌ی بیلد ───────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ─── مرحله‌ی اجرا ───────────────────────────────────────────────────
# عمداً node_modules کامل (نه خروجی standalone/trim‌شده‌ی Next) رو نگه
# می‌داریم، چون prisma db push و tsx (برای make-admin/seed) هم باید همین
# داخل کانتینر قابل‌اجرا بمونن، نه فقط خودِ سرور Next.
FROM base AS runner
ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app ./
# پوشه‌ای که فایل SQLite قراره داخلش (روی یک Docker volume) زندگی کنه.
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]
