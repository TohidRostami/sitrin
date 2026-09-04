import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brand text-ink shadow-[0_12px_36px_-14px_#C61E1C] hover:bg-brand-hover",
        outline: "border border-border text-ink hover:border-ink",
        ghost: "text-muted hover:text-ink",
        secondary: "bg-border text-ink hover:bg-brand",
        inverted: "bg-ink text-canvas hover:bg-brand-hover hover:text-ink",
        link: "text-brand-hover underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[52px] px-7",
        sm: "h-10 px-4 text-[13px]",
        m:"h-12 px-6 text-[14px]",
        lg: "h-14 px-8 text-[15px]",
        icon: "h-11 w-11 rounded-full shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
