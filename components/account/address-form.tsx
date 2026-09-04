"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addressSchema, type AddressInput } from "@/lib/validations/address";
import { createAddress, updateAddress } from "@/lib/actions/address";

const FIELDS: { name: keyof AddressInput; label: string; placeholder: string }[] = [
  { name: "fullName", label: "نام و نام خانوادگی", placeholder: "آرمان رضایی" },
  { name: "phone", label: "شماره موبایل", placeholder: "۰۹۱۲۳۴۵۶۷۸۹" },
  { name: "province", label: "استان", placeholder: "تهران" },
  { name: "city", label: "شهر", placeholder: "تهران" },
  { name: "postalCode", label: "کد پستی", placeholder: "۱۴۳۹۸۵۶۷۲۱" },
];

export function AddressForm({
  addressId,
  defaultValues,
  onSuccess,
  submitLabel = "ذخیره آدرس",
}: {
  addressId?: string;
  defaultValues?: Partial<AddressInput>;
  onSuccess?: (id: string, values: AddressInput) => void;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefault: false, ...defaultValues },
  });

  async function onSubmit(values: AddressInput) {
    const result = addressId ? await updateAddress(addressId, values) : await createAddress(values);
    if (result.ok) {
      toast.success("آدرس ذخیره شد.");
      onSuccess?.(result.id, values);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {FIELDS.map((f) => (
        <div key={f.name}>
          <Label>{f.label}</Label>
          <Input placeholder={f.placeholder} {...register(f.name as "fullName")} />
          {errors[f.name] && <p className="mt-1 text-xs text-brand-hover">{errors[f.name]?.message}</p>}
        </div>
      ))}
      <div className="sm:col-span-2">
        <Label>آدرس کامل</Label>
        <Input placeholder="خیابان ولیعصر، کوچه …" {...register("addressLine")} />
        {errors.addressLine && <p className="mt-1 text-xs text-brand-hover">{errors.addressLine.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
