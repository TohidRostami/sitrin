// cat > /home/claude/sitrin/migrate-account-issuer.ts << 'EOF'
import "dotenv/config";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("❌ TURSO_DATABASE_URL یا TURSO_AUTH_TOKEN در .env تنظیم نشده.");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log("→ اضافه‌کردن ستون issuer به account...");
  await client.execute(`ALTER TABLE account ADD COLUMN issuer TEXT NOT NULL DEFAULT ''`);

  console.log("→ ساخت ایندکس یکتای (issuer, accountId)...");
  await client.execute(
    `CREATE UNIQUE INDEX account_issuer_accountId_key ON account(issuer, accountId)`
  );

  console.log("→ پاک‌کردن کاربر یتیم (بدون Account) که signup ناقصش fail شده بود...");
  await client.execute({
    sql: `DELETE FROM account WHERE userId IN (SELECT id FROM user WHERE email = ?)`,
    args: ["tohidrostmai@gmail.com"],
  });
  await client.execute({
    sql: `DELETE FROM session WHERE userId IN (SELECT id FROM user WHERE email = ?)`,
    args: ["tohidrostmai@gmail.com"],
  });
  const result = await client.execute({
    sql: `DELETE FROM user WHERE email = ?`,
    args: ["tohidrostmai@gmail.com"],
  });

  console.log(`✅ تمام شد. ${result.rowsAffected} کاربر یتیم حذف شد.`);
}

main()
  .catch((err) => {
    console.error("❌ خطا:", err);
    process.exit(1);
  })
  .finally(() => client.close());
// EOF
// echo "created"