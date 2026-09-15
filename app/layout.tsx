import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/content";
import "./globals.css";

const archivoBlack = localFont({
  src: "../public/fonts/ArchivoBlack-Regular.ttf",
  weight: "400",
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.url),
  title: { default: `${siteConfig.site.name} | ${siteConfig.site.tagline}`, template: `%s | ${siteConfig.site.name}` },
  description: siteConfig.site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={archivoBlack.variable}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
