"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { CartBadge } from "@/components/shared/cart-badge";
import { ProfileButton } from "@/components/shared/profile-button";
import { MobileMenuSheet } from "@/components/shared/mobile-menu-sheet";
import { siteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CategoryWithCountDTO } from "@/lib/types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toPersianDigits } from "@/lib/format";
import { SearchDialog } from "../shop/search-dialog";

export function Header({ categories }: { categories: CategoryWithCountDTO[] }) {
  const pathname = usePathname();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-5 px-4 sm:px-6 md:px-10">
        <div className="flex flex-shrink-0 items-center gap-3">
          <MobileMenuSheet categories={categories} />
          <Logo />
        </div>

        <nav className="hidden flex-1 items-center gap-1 overflow-visible md:flex">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return item.label === "دسته‌بندی‌ها" ? (
              <div key={item.href} className="relative">
                {/* Category Button */}
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((prev) => !prev)}
                  aria-expanded={isCategoryOpen}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold",
                    "transition-colors duration-200 hover:text-ink",
                    active ? "bg-brand/[0.14] text-brand-hover" : "text-muted",
                  )}
                >
                  {item.label}

                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-300 ease-out",
                      isCategoryOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={cn(
                    "absolute start-0 top-full z-50 mt-2 min-w-56",
                    "origin-top rounded-lg border border-border",
                    "bg-surface p-2 shadow-lg",
                    "transition-all duration-200 ease-out",

                    isCategoryOpen
                      ? "visible translate-y-0 scale-100 opacity-100"
                      : "invisible -translate-y-2 scale-95 opacity-0",
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    {categories.map((cat, index) => (
                      <Link
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className={cn(
                          "flex rounded-md px-3 py-2 text-sm text-foreground/80 justify-between",
                          "transition-all duration-200",
                          "hover:bg-secondary hover:text-muted",
                          isCategoryOpen
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1 opacity-0",
                        )}
                        style={{
                          transitionDelay: isCategoryOpen
                            ? `${index * 30}ms`
                            : "0ms",
                        }}
                      >
                        <span>{cat.title}</span>
                        <span>{toPersianDigits(cat.productCount)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold",
                  "transition-colors duration-200 hover:text-ink",
                  active ? "bg-brand/[0.14] text-brand-hover" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-2">
          <SearchDialog />
          <ProfileButton />
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
