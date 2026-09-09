import type { Metadata } from "next";
import { CartClient } from "@/components/shop/cart-client";

export const metadata: Metadata = {
  title: "سبد خرید",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartClient />;
}
