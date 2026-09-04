"use server";

import { validateDiscountCode, type DiscountValidationResult } from "@/lib/queries/discount";

export async function checkDiscountCode(code: string, subtotal: number): Promise<DiscountValidationResult> {
  return validateDiscountCode(code, subtotal);
}
