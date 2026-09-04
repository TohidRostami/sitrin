"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function ProfileButton() {
  const { data: session } = useSession();

  return (
    <Link
      href={session ? "/account" : "/login"}
      className="hidden sm:flex h-[38px] w-[38px] items-center justify-center rounded-full border border-border bg-surface-sunken transition-colors hover:border-brand"
    >
      <User className="h-[17px] w-[17px]" strokeWidth={1.7} />
    </Link>
  );
}
