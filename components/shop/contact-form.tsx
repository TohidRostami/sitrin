"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { submitContactForm } from "@/lib/actions/contact";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    const result = await submitContactForm(values);
    if (result.ok) {
      toast.success("پیام شما ارسال شد — به‌زودی پاسخ می‌دهیم.");
      reset();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[20px] border border-border bg-surface p-5 sm:p-8">
      <div className="mb-5.5 text-base font-extrabold">پیام بگذارید</div>
      <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <Label>نام شما</Label>
          <Input placeholder="آرمان رضایی" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-brand-hover">{errors.name.message}</p>}
        </div>
        <div>
          <Label>ایمیل</Label>
          <Input dir="ltr" className="text-left" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-brand-hover">{errors.email.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <Label>موضوع</Label>
          <Input placeholder="سوال درباره سایز" {...register("subject")} />
          {errors.subject && <p className="mt-1 text-xs text-brand-hover">{errors.subject.message}</p>}
        </div>
      </div>
      <Label>پیام شما</Label>
      <Textarea placeholder="چطور می‌توانیم کمک کنیم؟" rows={6} {...register("message")} />
      {errors.message && <p className="mt-1 text-xs text-brand-hover">{errors.message.message}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-4.5 w-full">
        ارسال پیام
      </Button>
    </form>
  );
}
