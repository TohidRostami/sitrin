import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[130px] w-full resize-y rounded-xl border border-border bg-surface-sunken px-4 py-3 text-sm text-ink outline-none placeholder:text-muted transition-colors focus:border-brand disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
