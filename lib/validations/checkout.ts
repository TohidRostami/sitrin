import { z } from "zod";

export const checkoutSchema = z.object({
  addressId: z.string().min(1, "یک آدرس انتخاب کنید."),
  discountCode: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "سبد خرید شما خالی است."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
