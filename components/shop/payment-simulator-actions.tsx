"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { confirmSimulatedPayment } from "@/lib/actions/checkout";

export function PaymentSimulatorActions({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function resolve(outcome: "success" | "failed") {
    startTransition(async () => {
      const result = await confirmSimulatedPayment(orderId, outcome);
      if (result.ok) router.push(`/checkout/result?order=${orderId}&status=${result.status}`);
    });
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <Button onClick={() => resolve("success")} disabled={pending} className="w-full">
        شبیه‌سازی پرداخت موفق
      </Button>
      <Button onClick={() => resolve("failed")} disabled={pending} variant="outline" className="w-full">
        شبیه‌سازی پرداخت ناموفق
      </Button>
    </div>
  );
}
