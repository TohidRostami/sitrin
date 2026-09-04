import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "نام را وارد کنید."),
  email: z.string().trim().email("ایمیل معتبر نیست."),
  subject: z.string().trim().min(3, "موضوع را وارد کنید."),
  message: z.string().trim().min(10, "پیام باید حداقل ۱۰ کاراکتر باشد."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("ایمیل معتبر نیست."),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
