import { PrismaClient } from "./generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Auto-detects the environment: if TURSO_DATABASE_URL is set (Vercel /
// production) it talks to Turso over the network; otherwise it falls back
// to a local SQLite file via better-sqlite3 (local dev). See README.md
// section 3 for how to provision Turso.
function createAdapter() {
  if (process.env.TURSO_DATABASE_URL) {
    return new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  return new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Reuse the client across hot-reloads in dev so we don't open a new
// SQLite/libSQL connection on every file save.
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: createAdapter() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
