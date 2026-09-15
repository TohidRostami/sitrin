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
  title: {
    default: `${siteConfig.site.name} | ${siteConfig.site.tagline}`,
    template: `%s | ${siteConfig.site.name}`,
  },
  description: siteConfig.site.description,
  keywords: [
    "کفش",
    "اسنیکر",
    "کتانی اورجینال",
    "خرید کفش آنلاین",
    siteConfig.site.name,
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: siteConfig.site.url,
    siteName: siteConfig.site.name,
    title: `${siteConfig.site.name} | ${siteConfig.site.tagline}`,
    description: siteConfig.site.description,
    images: [
      {
        url: "/sitrin_logo.png",
        width: 1200,
        height: 1200,
        alt: siteConfig.site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.site.name} | ${siteConfig.site.tagline}`,
    description: siteConfig.site.description,
    images: ["/sitrin_logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={archivoBlack.variable}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
