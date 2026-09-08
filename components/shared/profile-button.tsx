"use client";

import Link from "next/link";
import { BrickWallShield, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function ProfileButton() {
  const { data: session } = useSession();

  return (
    <>
      {(session?.user?.role === "ADMIN" ||
        session?.user?.role === "SUBADMIN") && (
        <Link
          href={"/admin"}
          className="hidden sm:flex h-[38px] w-[38px] items-center justify-center rounded-full border border-border bg-surface-sunken transition-colors hover:border-brand"
        >
          <BrickWallShield />
        </Link>
      )}
      <Link
        href={session ? "/account" : "/login"}
        className="hidden sm:flex h-[38px] w-[38px] items-center justify-center rounded-full border border-border bg-surface-sunken transition-colors hover:border-brand"
      >
        <User />
      </Link>
    </>
  );
}
