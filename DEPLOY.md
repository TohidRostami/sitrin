# راهنمای دیپلوی سیترین روی سرور شخصی

این راهنما فرض می‌کنه از صفر شروع می‌کنی: یک سرور خالی (اوبونتو) و یک دامنه
که خریدی. مرحله به مرحله، از اتصال به سرور تا بالا اومدن سایت با HTTPS.

> ⚠️ این فایل‌ها (Dockerfile، docker-compose.yml، Caddyfile) بر اساس
> الگوهای استاندارد و رایج نوشته شدن، ولی چون Docker توی محیطی که این‌ها رو
> نوشتم در دسترس نبود، نتونستم واقعاً `docker build` رو اجرا و تستش کنم.
> اگه جایی خطا گرفتی، متن کامل خطا رو بفرست تا دقیق درستش کنیم — به همون
> روشی که تا الان هرچیزی رو حل کردیم.

## پیش‌نیازها

- یک سرور (VPS یا اختصاصی) با اوبونتو (۲۲.۰۴ یا ۲۴.۰۴)، دسترسی SSH با کاربر
  root یا کاربری با sudo.
- یک دامنه که مالکشی و به پنل مدیریت DNSـش دسترسی داری.
- Git روی سیستم خودت (برای push کردن کد، اگه از قبل نداری).

## قدم ۱: تنظیم DNS دامنه

توی پنل دامنه‌ت (هرجا خریدیش)، یک رکورد از این نوع بساز:

| نوع | Host/Name | Value | 
|---|---|---|
| A | `@` | IP سرور |
| A | `www` | IP سرور |

انتشار DNS معمولاً چند دقیقه تا چند ساعت طول می‌کشه. با این می‌تونی چک کنی
که رسیده یا نه:

```bash
ping siitrin.com
```

اگه IP سرور خودت رو نشون داد، آماده‌ای بری قدم بعد (لازم نیست منتظر جواب
پینگ بمونی، فقط باید IP درست resolve بشه).

## قدم ۲: اتصال به سرور و نصب Docker

با SSH وصل شو:

```bash
ssh root@IP_SERVER
```

بعد این اسکریپت رسمی Docker رو اجرا کن (نصب Docker Engine + Docker Compose
plugin با هم):

```bash
curl -fsSL https://get.docker.com | sh
```

چک کن درست نصب شده:

```bash
docker --version
docker compose version
```

## قدم ۳: آوردن کد پروژه روی سرور

```bash
cd /opt
git clone https://github.com/TohidRostami/sitrin.git
cd sitrin
```

## قدم ۴: تنظیم متغیرهای محیطی واقعی

```bash
cp .env.production.example .env
nano .env
```

حداقل این‌ها رو باید پر کنی:
- `BETTER_AUTH_SECRET` — با این دستور یک مقدار تازه بساز: `openssl rand -base64 32`
- `BETTER_AUTH_URL` و `NEXT_PUBLIC_SITE_URL` — دقیقاً `https://siitrin.com`
  (یا هر دامنه‌ی واقعی که استفاده می‌کنی)

بقیه (پیامک، درگاه پرداخت، آروان‌کلاد) رو هر وقت آماده شدن پر کن — تا اون
موقع سایت با حالت شبیه‌سازی/لاگ‌کردن-در-کنسول کار می‌کنه (دقیقاً همون رفتاری
که لوکال دیدی).

بعد از ذخیره (`Ctrl+O` بعد `Ctrl+X` توی nano)، مطمئن شو دامنه‌ی داخل
`Caddyfile` هم با دامنه‌ی واقعی‌ت یکی باشه:

```bash
nano Caddyfile
```

## قدم ۵: بیلد و بالا آوردن

```bash
docker compose up -d --build
```

اولین بار چند دقیقه طول می‌کشه (نصب وابستگی‌ها + بیلد Next.js). با این
می‌تونی وضعیتش رو ببینی:

```bash
docker compose ps
docker compose logs -f app
```

(برای خارج شدن از حالت دنبال‌کردن لاگ، `Ctrl+C` — این فقط از دیدن لاگ خارج
می‌کنه، سرویس همچنان روشن می‌مونه.)

## قدم ۶: ساخت جدول‌های دیتابیس (فقط بار اول)

چون دیتابیس یک فایل SQLite تازه و خالیه، باید یک بار جدول‌هاش رو بسازی:

```bash
docker compose exec app npx prisma db push
```

اختیاری — اگه می‌خوای همون محصولات نمونه رو هم داشته باشی:

```bash
docker compose exec app npm run db:seed
```

## قدم ۷: ساخت اکانت ادمین

```bash
docker compose exec app npm run make-admin -- --email=admin@siitrin.com --name="مدیر فروشگاه"
```

ایمیل و رمز عبور رو که چاپ می‌کنه همون‌جا یادداشت کن.

## قدم ۸: تأیید نهایی

مرورگر رو باز کن و برو `https://siitrin.com` — باید قفل سبز SSL رو ببینی
(Caddy خودش، بدون هیچ کار اضافه‌ای، گواهی Let's Encrypt گرفته). اگه اولین
بار کمی طول کشید (چند ثانیه تا حداکثر یکی-دو دقیقه) طبیعیه — Caddy داره
گواهی رو می‌گیره.

---

## بعداً: دیپلوی کردن تغییرات جدید

هر وقت کد رو آپدیت کردی (لوکال push کردی به گیت‌هاب)، روی سرور:

```bash
cd /opt/sitrin
git pull
docker compose up -d --build
```

دیتابیس (چون روی Docker volume جداست، نه داخل ایمیج) دست‌نخورده می‌مونه.

## بکاپ‌گیری از دیتابیس (مسئولیت خودته، Turso نیست)

چون دیتابیس کاملاً محلیه، هیچ بکاپ خودکاری وجود نداره مگر خودت تنظیم کنی.
ساده‌ترین راه، یک اسکریپت که فایل دیتابیس رو هر شب کپی می‌کنه:

```bash
mkdir -p /opt/sitrin-backups
docker compose exec app sqlite3 /app/data/production.db ".backup /app/data/backup-$(date +%F).db"
docker cp $(docker compose ps -q app):/app/data/backup-$(date +%F).db /opt/sitrin-backups/
```

برای این‌که هر شب خودکار اجرا بشه، این رو با `crontab -e` به کرون اضافه کن
(هر روز ساعت ۳ بامداد):

```
0 3 * * * cd /opt/sitrin && docker compose exec -T app sqlite3 /app/data/production.db ".backup /app/data/backup-$(date +\%F).db" && docker cp $(docker compose ps -q app):/app/data/backup-$(date +\%F).db /opt/sitrin-backups/
```

بهتره این پوشه‌ی بکاپ رو هم دوره‌ای (مثلاً هفتگی) به یک جای دیگه (گوگل درایو،
یک سرور دیگه) منتقل کنی — بکاپی که فقط روی همون سروره، اگه خودِ سرور از بین
بره کمکی نمی‌کنه.

## عیب‌یابی سریع

```bash
# لاگ‌های زنده‌ی اپ
docker compose logs -f app

# لاگ‌های Caddy (برای مشکلات SSL/دامنه)
docker compose logs -f caddy

# ری‌استارت یک سرویس
docker compose restart app

# وضعیت کلی
docker compose ps
```
