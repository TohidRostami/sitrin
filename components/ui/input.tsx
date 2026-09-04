import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[52px] w-full rounded-xl border border-border bg-surface-sunken px-4 text-sm text-ink outline-none placeholder:text-muted transition-colors focus:border-brand disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
