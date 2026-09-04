"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border bg-surface-sunken transition-colors data-[state=checked]:border-brand data-[state=checked]:bg-brand",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block h-[18px] w-[18px] translate-x-[-3px] rounded-full bg-ink shadow-lg transition-transform data-[state=checked]:translate-x-[-23px]" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
