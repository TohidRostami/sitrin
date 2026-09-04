"use server";

import { computeShipping } from "@/lib/queries/settings";

export async function previewShipping(subtotal: number) {
  return computeShipping(subtotal);
}
