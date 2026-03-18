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
  seeHowItWorks: "See how it works",
} as const;

export const HERO_TEXT = {
  eyebrow: "EU AI Act enforcement begins August 2, 2026",
  headline: "AI compliance\nmade simple for\nEuropean businesses",
  subheadline:
    "Most businesses use AI without knowing it falls under regulation. ComplyAI identifies your AI systems, classifies risk, and generates the documentation you need — before the deadline.",
  trustNote: "No credit card required · 5 minutes to your first assessment",
  trustBarPrefix: "Built for compliance with",
  trustBarRegulation: "EU AI Act (Regulation 2024/1689)",
} as const;

export const EU_AI_ACT_DEADLINE = new Date("2026-08-02T00:00:00Z");

export const PROBLEM_SECTION = {
  title: "The problem no one's talking about",
  stats: [
    {
      id: "fine",
      icon: "Shield",
      stat: "€35M maximum fine",
      description:
        "Non-compliance with the EU AI Act can cost up to €35 million or 7% of global annual turnover",
    },
    {
      id: "inventory",
      icon: "EyeOff",
      stat: "53% have no AI inventory",
      description:
        "Over half of organizations lack a systematic inventory of AI systems they use",
    },
    {
      id: "deadline",
      icon: "Clock",
      stat: "days remaining",
      description:
        "The enforcement deadline is August 2, 2026. Most companies haven't started.",
    },
  ],
} as const;

export const SOLUTION_SECTION = {
  title: "How ComplyAI works",
  steps: [
    {
      id: 1,
      title: "Discover your AI systems",
      description:
        "Our guided wizard helps you identify every AI tool in your organization — from obvious ones like ChatGPT to hidden AI in your existing software stack.",
      mockupLabel: "AI Discovery Wizard",
    },
    {
      id: 2,
      title: "Understand your risk level",
      description:
        "Automatic classification based on Annex III of the EU AI Act. Get a clear risk rating with full rationale explaining why your system falls into each category.",
      mockupLabel: "Risk Classification",
    },
    {
      id: 3,
      title: "Generate required documents",
      description:
        "AI-powered document generation creates technical documentation, risk assessments, and transparency notices tailored to your specific AI systems.",
      mockupLabel: "Document Generator",
    },
    {
      id: 4,
      title: "Track your compliance",
      description:
        "Real-time dashboard shows compliance status across all your AI systems. Get alerts for upcoming deadlines and required actions.",
      mockupLabel: "Compliance Dashboard",
    },
  ],
} as const;

export const FEATURES_SECTION = {
  title: "Everything you need to comply",
  features: [
    {
      id: "inventory",
      icon: "Search",
      title: "AI System Inventory",
      description: "Guided discovery of every AI tool in your organization",
    },
    {
      id: "classification",
      icon: "Scale",
      title: "Risk Classification",
      description: "Automatic Annex III risk assessment with full rationale",
    },
    {
      id: "documents",
      icon: "FileText",
      title: "Document Generation",
      description:
        "AI-powered technical documentation, risk assessments, and transparency notices",
    },
    {
      id: "dashboard",
      icon: "LayoutDashboard",
      title: "Compliance Dashboard",
      description: "Real-time status tracking across all your AI systems",
    },
    {
      id: "audit",
      icon: "History",
      title: "Audit Trail",
      description: "Every action logged for regulatory proof",
    },
    {
      id: "alerts",
      icon: "Bell",
      title: "Deadline Alerts",
      description: "Automated reminders as enforcement dates approach",
    },
  ],
} as const;

export const PRICING_SECTION = {
  title: "Simple, transparent pricing",
  subtitle: "Start free, upgrade when you need more",
  annualDiscount: 20,
  tiers: [
    {
      id: "starter",
      name: "Starter",
      description: "For small businesses just getting started with AI compliance",
      monthlyPrice: 49,
      features: [
        "Up to 5 AI systems",
        "Basic risk classification",
        "Standard document templates",
        "Email support",
        "Monthly compliance reports",
      ],
      cta: "Start free",
      highlighted: false,
    },
    {
      id: "business",
      name: "Business",
      description: "For growing companies with multiple AI systems to manage",
      monthlyPrice: 149,
      features: [
        "Up to 25 AI systems",
        "Advanced risk classification",
        "Custom document generation",
        "Priority support",
        "Weekly compliance reports",
        "Team collaboration",
        "API access",
      ],
      cta: "Start free",
      highlighted: true,
    },
    {
      id: "pro",
      name: "Pro",
      description: "For enterprises requiring comprehensive compliance coverage",
      monthlyPrice: 299,
      features: [
        "Unlimited AI systems",
        "Full Annex III coverage",
        "White-label documents",
        "Dedicated account manager",
        "Real-time compliance monitoring",
        "Advanced analytics",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ],
} as const;

export const FAQ_SECTION = {
  title: "Frequently asked questions",
  questions: [
    {
      id: "need-comply",
      question: "Does my business need to comply with the EU AI Act?",
      answer:
        "If your business operates in the EU or offers AI-powered products or services to EU customers, you likely need to comply. The Act applies to providers, deployers, importers, and distributors of AI systems. Even if you're just using third-party AI tools like ChatGPT in your business processes, you may have compliance obligations as a 'deployer'.",
    },
    {
      id: "what-counts",
      question: "What counts as an AI system under the Act?",
      answer:
        "The EU AI Act defines an AI system broadly as software that can generate outputs such as predictions, recommendations, decisions, or content. This includes machine learning models, chatbots, recommendation engines, automated decision-making systems, and even some rule-based systems. Many businesses are surprised to learn that tools they use daily — like spam filters, hiring software, or customer service chatbots — qualify as AI systems.",
    },
    {
      id: "non-compliance",
      question: "What happens if I don't comply by August 2026?",
      answer:
        "Non-compliance can result in significant penalties: up to €35 million or 7% of global annual turnover for the most serious violations. Beyond fines, you risk reputational damage, loss of customer trust, and potential bans on operating certain AI systems in the EU market. The Act is enforced by national authorities in each EU member state.",
    },
    {
      id: "legal-advice",
      question: "Is ComplyAI a substitute for legal advice?",
      answer:
        "No. ComplyAI is a compliance management tool that helps you inventory, classify, and document your AI systems. While we provide guidance based on the EU AI Act text and official guidance, our tool does not constitute legal advice. For complex situations or high-risk AI systems, we recommend consulting with qualified legal professionals who specialize in AI regulation.",
    },
    {
      id: "how-long",
      question: "How long does it take to complete an assessment?",
      answer:
        "Most businesses can complete their initial AI inventory and risk assessment in under an hour. The exact time depends on how many AI systems you use and their complexity. Our guided wizard walks you through each step, and you can save your progress at any time. Document generation typically takes just a few minutes per system.",
    },
    {
      id: "data-security",
      question: "Is my data secure?",
      answer:
        "Yes. We take data security seriously. All data is encrypted in transit and at rest. We're hosted on EU-based infrastructure to ensure GDPR compliance. We never share your data with third parties, and you can export or delete your data at any time. Our security practices are regularly audited, and we maintain SOC 2 Type II compliance.",
    },
  ],
} as const;

export const CTA_SECTION = {
  title: "Don't wait until it's too late",
  subtitle:
    "Start your AI Act compliance assessment today. Free for your first AI system.",
  placeholder: "Enter your work email",
  buttonText: "Get started",
  socialProof: "Join {count} businesses already preparing for the AI Act",
} as const;
