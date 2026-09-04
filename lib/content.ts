import siteConfigJson from "@/content/site-config.json";

export type NavItem = { label: string; href: string };
export type LinkItem = { label: string; href: string };

export type SiteConfig = {
  site: {
    name: string;
    nameEn: string;
    tagline: string;
    url: string;
    description: string;
    phone: string;
    phoneE164: string;
    email: string;
    address: string;
    hours: string;
  };
  theme: Record<string, string>;
  nav: NavItem[];
  mobileTabs: { label: string; href: string; icon: string }[];
  home: {
    heroBadge: string;
    heroTitleLine1: string;
    heroTitleHighlight: string;
    heroTitleRest: string;
    heroDescription: string;
    marqueeItems: string[];
    limitedBanner: {
      eyebrow: string;
      title: string;
      titleHighlight: string;
      description: string;
      ctaLabel: string;
      productSlug: string | null;
    };
  };
  perks: { number: string; title: string; desc: string }[];
  about: {
    eyebrow: string;
    title: string;
    body: string;
    stats: { value: string; label: string }[];
    values: { title: string; desc: string }[];
  };
  footer: {
    description: string;
    columns: { title: string; links: LinkItem[] }[];
    newsletterTitle: string;
    newsletterText: string;
    copyrightYear: string;
  };
};

export const siteConfig = siteConfigJson as SiteConfig;
