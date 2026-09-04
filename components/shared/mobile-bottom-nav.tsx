"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Heart, User } from "lucide-react";
import { siteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS = { home: Home, shop: Store, heart: Heart, user: User } as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface-sunken/95 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md md:hidden">
      {siteConfig.mobileTabs.map((tab) => {
        const Icon = ICONS[tab.icon as keyof typeof ICONS] ?? Home;
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-bold",
              active ? "text-brand" : "text-muted"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.6} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
