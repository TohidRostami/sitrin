import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/account", "/checkout", "/api"] }],
    sitemap: `${siteConfig.site.url}/sitemap.xml`,
  };
}
