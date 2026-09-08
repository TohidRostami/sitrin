import Image from "next/image";
import { cn } from "@/lib/utils";

export function SneakerPlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 78c0-6 4-9 9-11l16-6c3-1 5-3 6-6l4-11c1-3 4-5 7-4l10 3c2 1 3 2 4 4l3 8c1 3 4 5 7 5h20c5 0 9 3 10 8l1 5c1 4-2 8-6 8H24c-4 0-6-3-6-6v-8Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M40 55c4 4 9 7 15 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M52 46c4 4 9 7 15 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M18 82h88"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProductImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-surface-sunken text-border",
          className
        )}
      >
        <SneakerPlaceholderIcon className="h-1/3 w-1/3 min-h-10 min-w-10" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      loading="lazy"
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}