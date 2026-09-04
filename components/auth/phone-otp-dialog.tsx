"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { normalizeIranPhone, toE164IranPhone } from "@/lib/format";

export function PhoneOtpDialog({ next = "/account" }: { next?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setStep("phone");
    setPhone("");
    setCode("");
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeIranPhone(phone);
    if (!normalized) {
      toast.error("شماره موبایل معتبر نیست.");
      return;
    }
    setLoading(true);
    const { error } = await authClient.phoneNumber.sendOtp({ phoneNumber: toE164IranPhone(normalized) });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "ارسال کد با خطا مواجه شد.");
      return;
    }
    setPhone(normalized);
    setStep("otp");
    toast.success("کد تأیید پیامک شد.");
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.phoneNumber.verify({
      phoneNumber: toE164IranPhone(phone),
      code,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "کد وارد‌شده نادرست است.");
      return;
    }
    toast.success("ورود با موفقیت انجام شد.");
    setOpen(false);
    router.push(next);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-xl border border-border py-3.5 text-center text-[13px] font-semibold transition-colors hover:border-ink"
        >
          ورود با پیامک
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ورود با پیامک</DialogTitle>
          <DialogDescription>
            {step === "phone" ? "شماره موبایل خود را وارد کنید." : `کد ۶ رقمی ارسال‌شده به ${phone} را وارد کنید.`}
          </DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <form onSubmit={sendCode} className="flex flex-col gap-4">
            <div>
              <Label>شماره موبایل</Label>
              <Input
                dir="ltr"
                className="text-left"
                placeholder="09123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              ارسال کد تأیید
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="flex flex-col gap-4">
            <div>
              <Label>کد تأیید</Label>
              <Input
                dir="ltr"
                className="text-center tracking-[0.4em]"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <Button type="submit" disabled={loading || code.length !== 6}>
              تأیید و ورود
            </Button>
            <button type="button" onClick={() => setStep("phone")} className="text-xs text-muted hover:text-ink">
              تغییر شماره موبایل
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
