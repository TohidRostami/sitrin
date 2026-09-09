"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function SettingsForm({
  name: initialName,
  email,
  phoneNumber,
  phoneNumberVerified,
}: {
  name: string;
  email: string;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.updateUser({ name });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "به‌روزرسانی با خطا مواجه شد.");
      return;
    }
    toast.success("اطلاعات به‌روزرسانی شد.");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-border bg-surface p-6"
    >
      <h1 className="mb-5 text-base font-extrabold">تنظیمات حساب</h1>

      <div className="mb-4">
        <Label>نام و نام خانوادگی</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="mb-4">
        <Label>ایمیل</Label>
        <Input dir="ltr" className="text-left" value={email} disabled />
      </div>

      {phoneNumber && !phoneNumber.endsWith("@sitrin-phone.local") && (
        <div className="mb-5">
          <Label>شماره موبایل</Label>
          <div className="flex items-center gap-2.5">
            <Input
              dir="ltr"
              className="text-left"
              value={phoneNumber}
              disabled
            />
            <span
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${
                phoneNumberVerified
                  ? "bg-brand/[0.14] text-brand-hover"
                  : "bg-border text-muted"
              }`}
            >
              {phoneNumberVerified ? "تأیید‌شده" : "تأیید‌نشده"}
            </span>
          </div>
        </div>
      )}

      <Button type="submit" disabled={loading}>
        ذخیره تغییرات
      </Button>
    </form>
  );
}
