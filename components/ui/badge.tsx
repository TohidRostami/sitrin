import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold whitespace-nowrap",
  {
    variants: {
      variant: {
        brand: "bg-brand text-ink",
        outline: "border border-brand-muted bg-brand/10 text-brand-hover",
        muted: "bg-border text-ink",
        ghost: "bg-surface border border-border text-muted",
      },
    },
    defaultVariants: { variant: "brand" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
