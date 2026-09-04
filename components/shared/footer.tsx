"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-sunken">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 md:px-4 md:py-10">
        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-2 md:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo className="mb-4" />
            <p className="max-w-[32ch] text-[13px] leading-7 text-muted">
              {siteConfig.footer.description}
            </p>
          </div>

          {siteConfig.footer.columns.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[13px] font-extrabold">{col.title}</div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-muted transition-colors hover:text-brand-hover"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-3.5 border-t border-border pt-6 text-xs text-muted">
          <div>
            © {siteConfig.footer.copyrightYear} {siteConfig.site.name}. تمام
            حقوق محفوظ است.
          </div>
          <div className="flex gap-4.5">
            <span className="cursor-pointer">قوانین و مقررات</span>
            <span className="cursor-pointer">حریم خصوصی</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
