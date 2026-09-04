import type { NextConfig } from "next";

const arvanEndpoint = process.env.ARVAN_ENDPOINT
  ? new URL(process.env.ARVAN_ENDPOINT).hostname
  : undefined;

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS only matters over HTTPS (which is how Vercel serves the site) —
  // harmless locally since browsers ignore it on plain http://localhost.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' is only for the JSON-LD <script> tags on product
      // pages; tighten this to a nonce-based policy if that script is
      // ever removed.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      // ArvanCloud Object Storage (product images uploaded from /admin).
      ...(arvanEndpoint
        ? [{ protocol: "https" as const, hostname: arvanEndpoint }]
        : []),
      // Fallback/dev buckets — safe to remove once ARVAN_ENDPOINT is set.
      { protocol: "https" as const, hostname: "*.arvanstorage.ir" },
      { protocol: "https" as const, hostname: "*.arvanstorage.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
