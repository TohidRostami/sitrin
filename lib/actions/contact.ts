"use server";

import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { sendContactNotification } from "@/lib/mail";

export async function submitContactForm(rawInput: ContactInput) {
  const parsed = contactSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است." };
  }

  await sendContactNotification(parsed.data);
  return { ok: true as const };
}
