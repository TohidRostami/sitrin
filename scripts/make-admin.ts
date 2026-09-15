import "dotenv/config";
import { randomBytes } from "crypto";
import { auth } from "../lib/auth";
import { prisma } from "../lib/db";

function parseArgs() {
  const args = process.argv.slice(2);
  const flags: Record<string, string> = {};
  for (const arg of args) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) flags[match[1]] = match[2];
  }
  return flags;
}

function generatePassword() {
  return randomBytes(15).toString("base64url");
}

async function main() {
  const flags = parseArgs();
  const email = flags.email ?? "admin@sitrin.ir";
  const name = flags.name ?? " ";
  const password = flags.password ?? generatePassword();

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const credentialAccount = await prisma.account.findFirst({
      where: { userId: existing.id, providerId: "credential" },
    });

    if (credentialAccount) {
      if (existing.role === "ADMIN") {
        console.log(`   ${email}   ADMIN     .`);
        console.log("   (          .)");
        return;
      }
      await prisma.user.update({ where: { id: existing.id }, data: { role: "ADMIN" } });
      console.log(`   ${email}   ADMIN  .`);
      console.log("   (            .)");
      return;
    }

    console.log(`   ${email}  Account   (    )       ...`);
    await prisma.session.deleteMany({ where: { userId: existing.id } });
    await prisma.user.delete({ where: { id: existing.id } });
  }

  const result = await auth.api.signUpEmail({
    body: { name, email, password },
  });

  if (!result?.user?.id) {
    throw new Error("signUpEmail       result  :\n" + JSON.stringify(result, null, 2));
  }

  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: "ADMIN", emailVerified: true },
  });

  console.log("    :\n");
  console.log("   :      ", email);
  console.log("    :   ", password);
  console.log("   :        ", name);
  console.log("\n                .");
}

main()
  .catch((err) => {
    console.error("    :", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
