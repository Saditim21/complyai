// App-wide constants

export const SITE_NAME = "ComplyAI";

export const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/dpa", label: "Data Processing Agreement" },
  ],
  resources: [
    { href: "/blog/eu-ai-act-guide", label: "EU AI Act Guide" },
    { href: "/blog/risk-classification", label: "Risk Classification" },
    { href: "/blog/compliance-checklist", label: "Compliance Checklist" },
  ],
} as const;

export const FOOTER_TEXT = {
  disclaimer:
    "ComplyAI is an independent compliance tool. It does not constitute legal advice.",
  euCompliance: "Designed for EU AI Act compliance",
  copyright: `© ${new Date().getFullYear()} ComplyAI. All rights reserved.`,
} as const;

export const CTA_TEXT = {
  getStartedFree: "Get started free",
  checkCompliance: "Check your compliance — free",
  startFree: "Start free",
} as const;
