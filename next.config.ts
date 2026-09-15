import type { NextConfig } from "next";

function parseArvanHostname(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(withProtocol).hostname;
  } catch {
    console.warn(`ARVAN_ENDPOINT       : "${value}"`);
    return undefined;
  }
}

const arvanEndpoint = parseArvanHostname(process.env.ARVAN_ENDPOINT);

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
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
      ...(arvanEndpoint
        ? [{ protocol: "https" as const, hostname: arvanEndpoint }]
        : []),
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
