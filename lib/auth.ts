import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/db";
import { sendOtpSms } from "@/lib/sms";

//  www.siitrin.com  siitrin.com       
// BETTER_AUTH_URL          
//   (www   www)    "Invalid origin"  .
function buildTrustedOrigins(url: string | undefined): string[] {
  if (!url) return [];
  try {
    const { protocol, host } = new URL(url);
    const withoutWww = host.replace(/^www\./, "");
    return [`${protocol}//${withoutWww}`, `${protocol}//www.${withoutWww}`];
  } catch {
    return [url];
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: buildTrustedOrigins(process.env.BETTER_AUTH_URL),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        input: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },

  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      sendOTP: ({ phoneNumber, code }) => {
        void sendOtpSms(phoneNumber, code);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => `${phoneNumber.replace(/[^\d]/g, "")}@sitrin-phone.local`,
        getTempName: (phoneNumber) => phoneNumber,
      },
    }),
    nextCookies(),
  ],
});
