"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      dir="rtl"
      toastOptions={{
        classNames: {
          toast: "!bg-surface !border !border-border !text-ink !rounded-2xl !font-sans",
          description: "!text-muted",
          actionButton: "!bg-brand !text-ink",
          cancelButton: "!bg-border !text-ink",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
