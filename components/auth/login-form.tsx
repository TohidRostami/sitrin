"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailLoginSchema, type EmailLoginInput } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";

export function LoginForm({ next = "/account" }: { next?: string }) {
  const router = useRouter();
  const [remember, setRemember] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailLoginInput>({ resolver: zodResolver(emailLoginSchema) });

  async function onSubmit(values: EmailLoginInput) {
    const { error } = await authClient.signIn.email({ ...values, rememberMe: remember });
    if (error) {
      toast.error(error.message ?? "ایمیل یا رمز عبور اشتباه است.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
      <div>
        <Label>ایمیل یا موبایل</Label>
        <Input dir="ltr" className="text-left" placeholder="you@example.com" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-brand-hover">{errors.email.message}</p>}
      </div>
      <div>
        <Label>رمز عبور</Label>
        <Input type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="mt-1 text-xs text-brand-hover">{errors.password.message}</p>}
      </div>
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-muted">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-[15px] w-[15px] accent-brand"
          />
          مرا به خاطر بسپار
        </label>
        <span className="cursor-pointer text-brand-hover">رمز را فراموش کردید؟</span>
      </div>
      <Button type="submit" disabled={isSubmitting} className="mt-1.5">
        ورود به حساب
      </Button>
    </form>
  );
}
