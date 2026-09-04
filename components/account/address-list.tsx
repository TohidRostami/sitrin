"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/account/address-form";
import { deleteAddress } from "@/lib/actions/address";
import { EmptyState } from "@/components/shared/empty-state";
import type { AddressInput } from "@/lib/validations/address";

type Address = AddressInput & { id: string };

export function AddressList({ addresses: initial }: { addresses: Address[] }) {
  const [addresses, setAddresses] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function handleDelete(id: string) {
    const result = await deleteAddress(id);
    if (result.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("آدرس حذف شد.");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="rounded-[20px] border border-border bg-surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-base font-extrabold">آدرس‌های من</div>
        {!adding && (
          <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> افزودن آدرس
          </Button>
        )}
      </div>

      {adding && (
        <div className="mb-5 rounded-2xl border border-border p-5">
          <AddressForm
            onSuccess={(id, values) => {
              setAddresses((prev) => [...prev, { id, ...values }]);
              setAdding(false);
            }}
          />
          <button onClick={() => setAdding(false)} className="mt-3 text-xs text-muted hover:text-ink">
            انصراف
          </button>
        </div>
      )}

      {addresses.length === 0 && !adding ? (
        <EmptyState icon={MapPin} title="هنوز آدرسی ثبت نکرده‌اید" />
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) =>
            editing === addr.id ? (
              <div key={addr.id} className="rounded-2xl border border-border p-5">
                <AddressForm
                  addressId={addr.id}
                  defaultValues={addr}
                  onSuccess={(id, values) => {
                    setAddresses((prev) => prev.map((a) => (a.id === id ? { id, ...values } : a)));
                    setEditing(null);
                  }}
                />
                <button onClick={() => setEditing(null)} className="mt-3 text-xs text-muted hover:text-ink">
                  انصراف
                </button>
              </div>
            ) : (
              <div key={addr.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border p-4">
                <div className="text-sm">
                  <div className="mb-1 font-bold">
                    {addr.fullName} · {addr.phone}
                  </div>
                  <div className="text-muted">
                    {addr.province}، {addr.city}، {addr.addressLine} — {addr.postalCode}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => setEditing(addr.id)} className="rounded-lg p-2 text-muted hover:bg-surface-sunken hover:text-ink">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="rounded-lg p-2 text-muted hover:bg-surface-sunken hover:text-brand-hover">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
