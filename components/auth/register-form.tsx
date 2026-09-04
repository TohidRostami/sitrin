"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailSignupSchema, type EmailSignupInput } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";

export function RegisterForm({ next = "/account" }: { next?: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailSignupInput>({ resolver: zodResolver(emailSignupSchema) });

  async function onSubmit(values: EmailSignupInput) {
    const { error } = await authClient.signUp.email(values);
    console.log("error",error)
    console.log('values',values)
    if (error) {
      toast.error(error.message ?? "ثبت‌نام با خطا مواجه شد.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
      <div>
        <Label>نام و نام خانوادگی</Label>
        <Input placeholder="آرمان رضایی" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-brand-hover">{errors.name.message}</p>}
      </div>
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
      <Button type="submit" disabled={isSubmitting} className="mt-1.5">
        ساخت حساب کاربری
      </Button>
    </form>
  );
}
