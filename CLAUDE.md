# CLAUDE.md — ComplyAI Project Specification

> This file is the single source of truth for the ComplyAI project.
> Claude Code MUST read and follow this before writing any code.

---

## Project Overview

**ComplyAI** is a self-service SaaS platform that helps EU small and medium businesses comply with the EU AI Act before the August 2, 2026 enforcement deadline. Users inventory their AI systems, get risk classifications, generate required compliance documents, and track progress — all without needing a lawyer.

**Tech Stack**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (PostgreSQL + Auth + Storage), Claude API (Anthropic), Stripe, Resend, Vercel

---

## Code Standards — NON-NEGOTIABLE

### TypeScript
- Strict mode enabled. No `any` types. Ever. Use `unknown` + type guards if type is genuinely unknown.
- All function parameters and return types explicitly typed.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Use Zod for runtime validation of external data (API inputs, form submissions, database responses).

### File Structure
- One component per file. File name matches export name: `ComplianceScore.tsx` exports `ComplianceScore`.
- No file exceeds 150 lines. If it does, extract sub-components or hooks.
- Colocate related files: `components/wizard/StepAIDiscovery.tsx` not `components/StepAIDiscovery.tsx`.
- No barrel exports (`index.ts` re-exporting everything). Import directly from the file.

### Components
- Server Components by default. Only add `'use client'` when the component needs interactivity, hooks, or browser APIs.
- Props interface named `{ComponentName}Props` and defined directly above the component.
- No inline styles. All styling via Tailwind classes.
- No hardcoded strings in JSX for user-facing text. Use a constants file or i18n key (prep for multi-language).
- Destructure props in function signature: `function Card({ title, children }: CardProps)`.

### Data Fetching
- Server Components fetch data directly using Supabase server client.
- Client Components use React hooks + Supabase client only when real-time or user interaction requires it.
- All database queries go through typed helper functions in `lib/supabase/queries.ts`. Components never construct raw queries.
- Error handling on every async operation. No unhandled promises.

### Naming Conventions
- Files: PascalCase for components (`ComplianceScore.tsx`), camelCase for utilities (`classifyRisk.ts`).
- Variables/functions: camelCase.
- Types/interfaces: PascalCase.
- Database columns: snake_case (PostgreSQL convention).
- CSS classes: Tailwind only, no custom class names unless absolutely necessary (defined in `globals.css` with semantic tokens).
- Route handlers: `route.ts` (Next.js convention).

### Imports
- No unused imports. Ever.
- Group imports: (1) React/Next, (2) External packages, (3) Internal `@/lib`, (4) Internal `@/components`, (5) Types.
- Use `@/` path alias for all internal imports.

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`.
- Each commit does ONE thing.

---

## Design System

### Design Philosophy
ComplyAI must feel **trustworthy, calm, authoritative, and European**. Think Vanta meets Linear meets Dutch government design. Not a flashy startup — a tool that serious businesses trust with regulatory compliance. Every pixel should communicate: "We know what we're doing. You're in safe hands."

### Colors

```css
/* globals.css — Design Tokens */
:root {
  /* Brand */
  --brand-primary: #1B2B5A;        /* Deep navy — trust, authority, stability */
  --brand-primary-light: #2A3F7A;   /* Navy hover state */
  --brand-secondary: #0D9488;       /* Teal — action, compliance, progress */
  --brand-secondary-light: #14B8A6; /* Teal hover */
  --brand-accent: #F59E0B;          /* Amber — urgency, warnings, attention */

  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;          /* Slate 50 — subtle surface */
  --bg-tertiary: #F1F5F9;           /* Slate 100 — cards, sections */
  --bg-elevated: #FFFFFF;           /* Cards on colored backgrounds */

  /* Text */
  --text-primary: #0F172A;          /* Slate 900 — headings, body */
  --text-secondary: #475569;        /* Slate 600 — secondary info */
  --text-tertiary: #94A3B8;         /* Slate 400 — hints, placeholders */
  --text-inverse: #FFFFFF;

  /* Status — used for compliance states */
  --status-compliant: #059669;      /* Emerald 600 */
  --status-compliant-bg: #ECFDF5;
  --status-in-progress: #D97706;    /* Amber 600 */
  --status-in-progress-bg: #FFFBEB;
  --status-non-compliant: #DC2626;  /* Red 600 */
  --status-non-compliant-bg: #FEF2F2;
  --status-not-started: #6B7280;    /* Gray 500 */
  --status-not-started-bg: #F9FAFB;

  /* Risk levels — core to the product */
  --risk-minimal: #6B7280;          /* Gray */
  --risk-minimal-bg: #F9FAFB;
  --risk-limited: #2563EB;          /* Blue */
  --risk-limited-bg: #EFF6FF;
  --risk-high: #EA580C;             /* Orange */
  --risk-high-bg: #FFF7ED;
  --risk-unacceptable: #DC2626;     /* Red */
  --risk-unacceptable-bg: #FEF2F2;

  /* Borders */
  --border-default: #E2E8F0;        /* Slate 200 */
  --border-hover: #CBD5E1;          /* Slate 300 */
  --border-focus: #1B2B5A;          /* Brand primary */

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
}
```

### Typography

**Font: Inter** for body text (clean, readable, professional, variable font for performance).
**Font: Instrument Serif** for display/hero headlines only (adds warmth and distinction without being unprofessional — used by Stripe, Linear, modern SaaS).

```css
/* Font loading via next/font — NOT CDN */
/* Configured in layout.tsx using next/font/google */

/* Scale */
--font-display: 'Instrument Serif', serif;   /* Hero headlines only */
--font-body: 'Inter', sans-serif;            /* Everything else */

/* Sizes — desktop */
--text-hero: 3.5rem;      /* 56px — landing page hero only */
--text-h1: 2.25rem;       /* 36px — page titles */
--text-h2: 1.75rem;       /* 28px — section titles */
--text-h3: 1.25rem;       /* 20px — card titles */
--text-body: 1rem;         /* 16px — body text */
--text-small: 0.875rem;    /* 14px — secondary text, labels */
--text-xs: 0.75rem;        /* 12px — badges, timestamps */

/* Line heights */
--leading-tight: 1.15;     /* Headlines */
--leading-normal: 1.5;     /* Body */
--leading-relaxed: 1.7;    /* Long-form text */

/* Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;          /* Use sparingly — headlines only */
```

### Spacing System
Use Tailwind's default spacing scale consistently:
- `gap-1` (4px), `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px)
- Section padding: `py-16` or `py-20` on landing page, `p-6` on dashboard cards
- Content max-width: `max-w-7xl` for landing page, `max-w-6xl` for dashboard content

### Component Patterns

**Cards** (used extensively in dashboard):
```
bg-white border border-slate-200 rounded-xl p-6 shadow-sm
hover: shadow-md transition-shadow duration-200
```

**Buttons — Primary:**
```
bg-[--brand-primary] text-white rounded-lg px-6 py-3 font-medium
hover: bg-[--brand-primary-light] transition-colors duration-150
focus: ring-2 ring-[--brand-primary] ring-offset-2
```

**Buttons — Secondary:**
```
bg-white border border-slate-200 text-slate-700 rounded-lg px-6 py-3 font-medium
hover: bg-slate-50 border-slate-300
```

**Buttons — Teal (positive action, "Mark complete"):**
```
bg-[--brand-secondary] text-white rounded-lg px-6 py-3 font-medium
hover: bg-[--brand-secondary-light]
```

**Risk Level Badges:**
```tsx
// Always use these exact styles for risk levels
const riskStyles = {
  minimal: 'bg-gray-100 text-gray-700 border-gray-200',
  limited: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  unacceptable: 'bg-red-50 text-red-700 border-red-200',
} as const;
```

**Compliance Status Badges:**
```tsx
const statusStyles = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-amber-50 text-amber-700',
  compliant: 'bg-emerald-50 text-emerald-700',
  non_compliant: 'bg-red-50 text-red-700',
} as const;
```

### Animation & Motion
- Keep it minimal. This is compliance software, not a portfolio site.
- Page transitions: none (too flashy for the context).
- Hover states: `transition-colors duration-150` or `transition-shadow duration-200`.
- Accordion/collapsible: `transition-all duration-200 ease-out`.
- Loading states: Use shadcn/ui Skeleton, not spinners.
- Landing page only: subtle fade-in on scroll using CSS `@keyframes fadeInUp` with `IntersectionObserver`. No animation library.

### Iconography
- Use `lucide-react` exclusively. No mixing icon libraries.
- Size: `w-4 h-4` for inline, `w-5 h-5` for buttons, `w-6 h-6` for feature cards, `w-8 h-8` for empty states.
- Stroke width: default (2px). Never customize.
- Color: inherit from parent text color via `currentColor`.

### Landing Page Specific Design Rules
- Hero section: white/light background. Navy text. Instrument Serif headline. Clear, single CTA.
- No hero background images or gradients. Clean and minimal.
- Trust signals (compliance badges, regulation references) near CTAs.
- Product screenshots/mockups: use real UI screenshots in browser-frame mockups, NOT abstract illustrations.
- Social proof: logos if available, otherwise regulatory references (EU AI Act Article references).
- Pricing section: clean grid, highlight recommended tier, show annual savings.
- Footer: professional, include EU references, privacy policy link, company details.

### Dashboard Design Rules
- Left sidebar navigation (collapsible on mobile).
- Top header with org name, user avatar, notification bell.
- Content area: white background, cards for data groups, tables for lists.
- Compliance score: circular progress indicator (brand-secondary color for filled, slate-200 for unfilled).
- Charts: use recharts with brand colors. No 3D, no gradients in charts.

---

## Project Structure

```
complyai/
├── CLAUDE.md                         ← THIS FILE (always read first)
├── src/
│   ├── app/
│   │   ├── (marketing)/              # Public pages — no auth required
│   │   │   ├── layout.tsx            # Marketing layout (nav + footer)
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   └── blog/
│   │   │       ├── page.tsx          # Blog index
│   │   │       └── [slug]/page.tsx   # Blog post
│   │   ├── (auth)/                   # Auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/              # Protected — requires auth
│   │   │   ├── layout.tsx            # Dashboard shell (sidebar + header)
│   │   │   ├── page.tsx              # Overview dashboard
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx          # AI systems list
│   │   │   │   ├── new/page.tsx      # Add system wizard
│   │   │   │   └── [id]/page.tsx     # System detail
│   │   │   ├── roadmap/page.tsx      # Compliance timeline
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx          # Documents list
│   │   │   │   └── [id]/page.tsx     # Document view/edit
│   │   │   └── settings/page.tsx     # Org + billing settings
│   │   ├── api/
│   │   │   ├── classify/route.ts     # Risk classification
│   │   │   ├── generate/route.ts     # Document generation (Claude API)
│   │   │   ├── webhooks/stripe/route.ts
│   │   │   └── export/route.ts       # PDF export
│   │   ├── globals.css               # Design tokens + Tailwind base
│   │   └── layout.tsx                # Root layout (fonts, metadata)
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components (DO NOT EDIT these directly)
│   │   ├── marketing/                # Landing page components
│   │   │   ├── Hero.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── SolutionSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   ├── CtaSection.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── wizard/                   # AI inventory wizard steps
│   │   │   ├── WizardShell.tsx       # Step container + progress
│   │   │   ├── StepCompanyInfo.tsx
│   │   │   ├── StepAIDiscovery.tsx
│   │   │   ├── StepSystemDetails.tsx
│   │   │   ├── StepClassification.tsx
│   │   │   └── StepSummary.tsx
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ComplianceScore.tsx
│   │   │   ├── SystemCard.tsx
│   │   │   ├── RequirementChecklist.tsx
│   │   │   └── TimelineView.tsx
│   │   └── shared/                   # Reusable across marketing + dashboard
│   │       ├── RiskBadge.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── Logo.tsx
│   │       └── LoadingSkeleton.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client
│   │   │   ├── middleware.ts          # Auth middleware
│   │   │   └── queries.ts            # ALL database queries (typed)
│   │   ├── stripe/
│   │   │   ├── client.ts             # Stripe instance
│   │   │   └── plans.ts              # Plan definitions
│   │   ├── claude.ts                 # Claude API wrapper
│   │   ├── classification/
│   │   │   ├── engine.ts             # Risk classification logic
│   │   │   ├── categories.ts         # Annex III domains + categories
│   │   │   └── requirements.ts       # Requirements per risk level + article
│   │   ├── documents/
│   │   │   ├── templates.ts          # Document structure templates
│   │   │   └── generator.ts          # AI document generation orchestrator
│   │   ├── constants.ts              # App-wide constants
│   │   └── utils.ts                  # Pure utility functions (max 20 functions, split if bigger)
│   ├── hooks/
│   │   ├── useWizard.ts              # Wizard state management
│   │   └── useComplianceScore.ts
│   └── types/
│       ├── database.ts               # Generated Supabase types
│       ├── classification.ts         # Risk levels, domains, categories
│       └── documents.ts              # Document types + structures
├── supabase/
│   ├── migrations/                   # Database migrations (ordered)
│   │   └── 001_initial_schema.sql
│   └── seed.sql                      # Seed: AI categories, common tools, requirements
├── public/
│   ├── og-image.png                  # Open Graph image (1200x630)
│   └── favicon.ico
├── .env.local.example                # Template for env vars
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── middleware.ts                      # Auth redirect middleware
```

---

## Landing Page Specification

### Page Structure (top to bottom)

**1. Navbar** (sticky, white bg, subtle bottom border)
- Logo (left): "ComplyAI" in brand-primary, custom wordmark
- Nav links (center): How it works, Pricing, Blog
- CTA (right): "Get started free" button (brand-primary)

**2. Hero Section** (py-20, centered text)
- Eyebrow: "EU AI Act enforcement begins August 2, 2026" — small, amber text, with subtle pulse dot
- Headline (Instrument Serif, 56px): "AI compliance\nmade simple for\nEuropean businesses"
- Subheadline (Inter, 18px, text-secondary, max-w-2xl): "Most businesses use AI without knowing it falls under regulation. ComplyAI identifies your AI systems, classifies risk, and generates the documentation you need — before the deadline."
- CTA: "Check your compliance — free" (large, brand-primary button) + "See how it works" (text link with arrow)
- Below CTA: "No credit card required · 5 minutes to your first assessment"
- Trust bar: "Built for compliance with" + EU flag icon + "EU AI Act (Regulation 2024/1689)"

**3. Problem Section** (bg-secondary, py-16)
- Section title: "The problem no one's talking about"
- Three columns, each with icon + stat + description:
  1. Shield icon — "€35M maximum fine" — "Non-compliance with the EU AI Act can cost up to €35 million or 7% of global annual turnover"
  2. Eye-off icon — "53% have no AI inventory" — "Over half of organizations lack a systematic inventory of AI systems they use"
  3. Clock icon — "137 days remaining" — "The enforcement deadline is August 2, 2026. Most companies haven't started." (calculate dynamically)

**4. Solution Section** — "How ComplyAI works" (py-16)
- Four steps with numbers, each with mockup screenshot on alternating sides:
  1. "Discover your AI systems" — guided wizard screenshot
  2. "Understand your risk level" — classification result screenshot
  3. "Generate required documents" — document editor screenshot
  4. "Track your compliance" — dashboard screenshot
- Note: initially use placeholder mockup images. Replace with real screenshots after dashboard is built.

**5. Feature Grid** (bg-secondary, py-16)
- "Everything you need to comply" section title
- 2x3 grid of feature cards:
  - AI System Inventory: "Guided discovery of every AI tool in your organization"
  - Risk Classification: "Automatic Annex III risk assessment with full rationale"
  - Document Generation: "AI-powered technical documentation, risk assessments, and transparency notices"
  - Compliance Dashboard: "Real-time status tracking across all your AI systems"
  - Audit Trail: "Every action logged for regulatory proof"
  - Deadline Alerts: "Automated reminders as enforcement dates approach"

**6. Pricing Section** (py-16)
- Three cards: Starter (€49), Business (€149, highlighted), Pro (€299)
- Annual toggle with 20% discount
- Feature comparison list per tier
- "Start free" button on each

**7. FAQ Section** (py-16)
- 6-8 questions, accordion style. Include:
  - "Does my business need to comply with the EU AI Act?"
  - "What counts as an AI system under the Act?"
  - "What happens if I don't comply by August 2026?"
  - "Is ComplyAI a substitute for legal advice?"
  - "How long does it take to complete an assessment?"
  - "Is my data secure?"

**8. Final CTA Section** (brand-primary bg, white text, py-16)
- Headline: "Don't wait until it's too late"
- Subtitle: "Start your AI Act compliance assessment today. Free for your first AI system."
- Email capture form + "Get started" button
- Below: "Join [X] businesses already preparing for the AI Act"

**9. Footer** (dark bg)
- Logo, product links, legal links, social links
- "ComplyAI is an independent compliance tool. It does not constitute legal advice."
- EU flag + "Designed for EU AI Act compliance"

### Email Collection (Pre-launch)
Before the full app is built, the landing page collects emails:
- Supabase table `waitlist` with columns: `id`, `email`, `company_name` (optional), `created_at`
- On submit: insert to Supabase + send confirmation via Resend
- Show count of signups: "Join [X] businesses on the waitlist"

---

## Environment Variables

```bash
# .env.local.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key Reminders for Claude Code

1. **Read this file first. Every time.** Don't guess the design or structure.
2. **No spaghetti.** Every component has one job. Every function is pure when possible.
3. **No dead code.** If it's not used, delete it. Commented-out code is dead code.
4. **Types are mandatory.** If you're writing `as any`, you're doing it wrong.
5. **Design tokens exist for a reason.** Never hardcode colors, radii, or shadows. Use the CSS variables or Tailwind classes defined above.
6. **The user-facing text matters.** Write it like a human wrote it, not like a template. Compliance is scary — our tone should be calm, clear, and confident.
7. **Mobile-first.** Every component must work on mobile. Check responsive breakpoints.
8. **Performance matters.** Use Server Components. Lazy load below-fold sections. Optimize images via next/image.
9. **Accessibility.** All interactive elements must be keyboard-navigable. Use semantic HTML. ARIA labels on icon-only buttons.
10. **Test what you build.** Before declaring anything "done", verify: does it look right at 320px, 768px, and 1440px? Are there console errors? Do all links work?