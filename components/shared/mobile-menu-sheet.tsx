"use client";

import { useState } from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X, ChevronLeft, ChevronDown } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/lib/content";
import { CategoryWithCountDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MobileMenuSheet({
  categories,
}: {
  categories: CategoryWithCountDTO[];
}) {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] border border-border md:hidden">
        <Menu className="h-[18px] w-[18px]" strokeWidth={1.8} />
        <span className="sr-only">منو</span>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-canvas/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-surface-sunken shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-5 py-5">
            <Logo size="sm" />
            <DialogPrimitive.Close className="text-lg text-muted">
              <X className="h-5 w-5" />
              <span className="sr-only">بستن</span>
            </DialogPrimitive.Close>
          </div>

          <nav className="flex flex-1 flex-col overflow-y-auto px-5 py-2">
            {siteConfig.mobileTabs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-border py-4 text-[15px] font-bold"
              >
                {item.label}
                <ChevronLeft className="h-4 w-4 text-muted" />
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setCategoriesOpen((v) => !v)}
              aria-expanded={categoriesOpen}
              className="flex w-full items-center justify-between border-b border-border py-4 text-[15px] font-bold"
            >
              دسته‌بندی محصولات
              <ChevronDown
                className={cn(
                  "mr-auto size-4 transition-transform duration-300 ease-out",
                  categoriesOpen && "rotate-180",
                )}
                strokeWidth={1.6}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                categoriesOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className={cn(
                    "flex flex-col gap-0.5 py-1 ps-3 transition-transform duration-300 ease-out",
                    categoriesOpen ? "translate-y-0" : "-translate-y-2",
                  )}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => {
                        setCategoriesOpen((v) => !v);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between border-b border-border py-4 text-[15px] font-bold transition-colors duration-200 hover:text-brand"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex-shrink-0 px-5 pb-6 pt-4">
            {!session ? (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mb-3 flex h-[46px] items-center justify-center rounded-[13px] border border-border text-[13.5px] font-bold"
              >
                ورود / ثبت‌نام
              </Link>
            ) : (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="mb-3 flex h-[46px] items-center justify-center rounded-[13px] border border-border text-[13.5px] font-bold"
              >
                حساب کاربری
              </Link>
            )}
            <p className="text-center text-[11px] text-muted">
              {siteConfig.site.phone} · {siteConfig.site.hours}
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
// { "label": "پروفایل", "href": "/account", "icon": "user" }
