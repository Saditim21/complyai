# ComplyAI — EU AI Act Compliance Platform for SMBs
## Complete Project Blueprint

---

## 1. THE PRODUCT

### What it is
A self-service web application that helps small and medium businesses (1-250 employees) understand, assess, and comply with the EU AI Act before the August 2, 2026 enforcement deadline.

### The problem it solves
Most SMBs use AI tools daily without realizing they fall under the EU AI Act. A recruitment agency using AI to screen CVs. A webshop with recommendation algorithms. A marketing agency using ChatGPT for content. A clinic using AI-assisted diagnostics. They don't know:
- Which of their tools count as "AI systems" under the Act
- What risk level each system falls into (minimal, limited, high, unacceptable)
- What documentation they need to produce
- What they need to register in the EU database
- What the deadline is and what happens if they miss it

The fine for non-compliance: up to €35 million or 7% of global annual turnover.

### Why people pay
- **Fear of fines**: The regulation is enforceable from August 2, 2026. Companies that don't comply face massive penalties.
- **Complexity**: The AI Act is 460 pages. The Annex III alone lists 8 domains of high-risk AI. Most business owners can't parse this.
- **No affordable alternative**: Existing tools (Credo AI, Holistic AI, Arthur AI) target enterprises with custom pricing starting at €10k+/year. The EU's own compliance checker is a basic questionnaire with no actionable output. There is NOTHING in the €50-200/month range for SMBs.
- **Time pressure**: Building compliant AI inventory, classification, and documentation takes 12-18 months. Companies starting now are already late.

### How it works (user journey)
1. **Sign up** → Company creates account, enters basic company info (size, sector, location)
2. **AI Inventory Wizard** → Guided step-by-step process to identify all AI systems in use. The wizard asks questions like "Do you use any software that automatically screens job applications?" or "Does your website use chatbots?" — translating legal categories into plain language.
3. **Risk Classification** → Each identified AI system is automatically classified into the 4 risk tiers based on Annex III logic. The system explains WHY each classification was made.
4. **Compliance Roadmap** → For each system, a clear checklist of what's required: documentation, risk assessment, human oversight plans, transparency notices, registration requirements.
5. **Document Generator** → AI-powered (Claude API) generation of required documentation: technical documentation (Annex IV), risk management plans (Art. 9), data governance policies (Art. 10), transparency disclosures (Art. 13).
6. **Compliance Dashboard** → Real-time overview of compliance status per AI system. What's done, what's pending, what's overdue. Exportable reports for auditors.
7. **Ongoing Monitoring** → Alerts when regulations change, when deadlines approach, when new AI tools are added.

---

## 2. COMPETITIVE ANALYSIS

### Enterprise tools (NOT our competitors — different market)
| Tool | Target | Pricing | Why they don't serve SMBs |
|------|--------|---------|--------------------------|
| Credo AI | Enterprise | Custom (€10k+/yr) | Too complex, too expensive |
| Holistic AI | Enterprise | Custom | Requires dedicated compliance team |
| Arthur AI | Enterprise | Custom | ML-focused, not for AI deployers |
| OneTrust | Enterprise | Custom | GDPR-focused, AI Act features limited |
| Vanta | Mid-Enterprise | $10k+/yr | Security compliance, not AI Act specific |

### Free/basic tools (competitors we must beat)
| Tool | What it does | Gap |
|------|-------------|-----|
| EU AI Act Compliance Checker (artificialintelligenceact.eu) | Basic questionnaire, gives indication of obligations | No actionable output, no document generation, no tracking, still "work in progress" |
| Trail ML free checker | Risk classification only | No compliance roadmap, no documentation |
| Various law firm free assessments | PDF checklists | Static, no interactivity, no customization |

### Our positioning
The ONLY tool that combines AI inventory, risk classification, document generation, and compliance tracking in one platform, priced for SMBs at €49-199/month. We sit exactly in the gap between "free but useless" and "enterprise but €10k+".

---

## 3. TARGET PERSONAS

### Persona 1: Mark — Operations Manager at a Recruitment Agency (Primary)
- **Company**: 30 employees, Eindhoven, Netherlands
- **AI Usage**: Uses AI-powered ATS (Applicant Tracking System) that ranks/filters candidates, ChatGPT for writing job descriptions, AI chatbot on website
- **Pain**: Heard about the AI Act at a networking event. Googled it, got overwhelmed. Knows the ATS might be "high-risk" but doesn't know what to do about it. CEO asked him to "figure it out" — he has no legal background.
- **Budget**: Would pay €99-149/month without needing CEO approval
- **Trigger**: Fear of being audited + losing clients who demand AI Act compliance from vendors
- **Quote**: "I just need someone to tell me in plain language: what do I need to do, and can I get it done before August?"

### Persona 2: Lisa — Founder of a SaaS Startup
- **Company**: 8 employees, Amsterdam, builds a customer support AI tool
- **AI Usage**: SHE IS the AI provider — her product uses AI to classify and route support tickets
- **Pain**: Her enterprise clients are now asking "are you AI Act compliant?" in procurement questionnaires. She's losing deals because she can't prove compliance.
- **Budget**: €149-199/month — this directly affects revenue
- **Trigger**: Lost a €50k/year contract because she couldn't provide compliance documentation
- **Quote**: "I know my product isn't dangerous, but I need the paperwork to prove it."

### Persona 3: Peter — IT Manager at a Mid-Size Manufacturer
- **Company**: 120 employees, Noord-Brabant, industrial components
- **AI Usage**: AI-powered quality inspection (cameras + ML), predictive maintenance system, ERP with AI forecasting, ChatGPT used informally by employees
- **Pain**: Doesn't even have a complete list of all AI tools being used across the company. "Shadow AI" is everywhere — employees use ChatGPT, Copilot, various AI plugins without IT knowing.
- **Budget**: €199/month — needs management approval but can justify it against €35M fine risk
- **Trigger**: Board asked for an "AI risk assessment" after reading about the Act in a trade magazine
- **Quote**: "I need to first figure out WHAT AI we're even using before I can figure out IF we're compliant."

---

## 4. VALIDATION INTERVIEWS (Questions to ask potential users)

### Pre-interview screening
Find 15-20 people matching our personas through:
- LinkedIn outreach to Operations Managers, IT Managers, CTOs at Dutch SMBs
- Reddit r/Netherlands, r/SaaS, r/GDPR (people here also care about AI Act)
- Dutch business communities: MKB-Nederland, Brainport Eindhoven network

### Interview script (20 minutes)
1. "What AI tools does your company use? Can you list them?" (Tests: do they even know?)
2. "Have you heard of the EU AI Act?" (Tests: awareness level)
3. "Do you know if any of your AI tools are classified as high-risk?" (Tests: knowledge depth)
4. "What have you done so far to prepare for compliance?" (Tests: action vs. inaction)
5. "What's the biggest blocker preventing you from taking action?" (Tests: the real pain point)
6. "If there was a tool that could identify all your AI systems, tell you the risk level, and generate the required documentation — how much would that be worth to you per month?" (Tests: willingness to pay)
7. "Who in your company would make the decision to buy this tool?" (Tests: buying process)
8. "If you could start using this tool tomorrow, would you?" (Tests: urgency)

### Signals we're looking for
- ✅ "We haven't done anything yet" → Huge opportunity
- ✅ "We don't even know what AI we're using" → Inventory wizard is the killer feature
- ✅ "We'd pay €100-200/month" → Pricing validated
- ❌ "Our legal team handles this" → Not our market (too big)
- ❌ "We don't use any AI" → Not our market (yet)

---

## 5. PRODUCT NAME OPTIONS

| Name | Domain availability | Verdict |
|------|-------------------|---------|
| ComplyAI | complyai.eu | Check availability — strong, clear |
| AICompass | aicompass.eu | Clear metaphor (navigation) |
| AIReady | aiready.eu | Action-oriented |
| ClearAI | clearai.eu | Transparency angle |
| ActReady | actready.eu | Directly references "The Act" |

Pick one, secure the .eu domain (€5-10/year), and move.

---

## 6. SOFTWARE ARCHITECTURE

### Tech Stack (optimized for solo developer speed + production quality)

```
Frontend:         Next.js 14+ (App Router) + TypeScript + Tailwind CSS
UI Components:    shadcn/ui (accessible, customizable, no lock-in)
Backend:          Next.js API Routes + Server Actions
Database:         Supabase (PostgreSQL + Auth + Storage + Realtime)
AI Integration:   Anthropic Claude API (document generation, Q&A)
Payments:         Stripe (subscriptions + invoicing)
Email:            Resend (transactional emails)
Hosting:          Vercel (Next.js native, free tier to start)
Analytics:        PostHog (open source, privacy-friendly, EU hosting)
Monitoring:       Sentry (error tracking)
```

### Why this stack
- **Next.js**: You know React, Next.js adds SSR/SEO for the marketing pages + API routes so you don't need a separate backend
- **Supabase**: Free tier includes auth, database, storage — replaces building auth from scratch, setting up Postgres, and file uploads
- **Claude API**: Better for long-form document generation than GPT-4, you're already familiar from this conversation
- **Vercel**: Zero-config deployment, automatic previews, generous free tier
- **shadcn/ui**: Not a component library you install — you own the code. Professional-looking UI in minutes.

### Database Schema (PostgreSQL via Supabase)

```sql
-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,          -- 'recruitment', 'manufacturing', 'retail', etc.
  employee_count INTEGER,
  country TEXT DEFAULT 'NL',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  stripe_customer_id TEXT,
  subscription_tier TEXT DEFAULT 'free'  -- 'free', 'starter', 'business', 'pro'
);

-- Users (linked to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member',    -- 'owner', 'admin', 'member'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Systems (the core entity — each AI tool a company uses)
CREATE TABLE ai_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,             -- 'HireVue Screening Tool'
  description TEXT,               -- What it does
  vendor TEXT,                    -- 'HireVue Inc.'
  category TEXT NOT NULL,         -- 'recruitment_screening', 'chatbot', 'recommendation', etc.
  
  -- AI Act Classification
  risk_level TEXT,                -- 'minimal', 'limited', 'high', 'unacceptable'
  annex_iii_domain TEXT,          -- 'employment', 'education', 'biometrics', etc.
  is_provider BOOLEAN DEFAULT false,  -- Does the org BUILD this AI or just USE it?
  classification_rationale TEXT,  -- Why this risk level was assigned
  
  -- Compliance Status
  compliance_status TEXT DEFAULT 'not_started',  -- 'not_started', 'in_progress', 'compliant', 'non_compliant'
  compliance_score INTEGER DEFAULT 0,             -- 0-100
  
  -- Metadata
  data_types_processed TEXT[],    -- ['personal_data', 'biometric', 'financial', etc.]
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compliance Requirements (what needs to be done per AI system)
CREATE TABLE compliance_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_system_id UUID REFERENCES ai_systems(id) NOT NULL,
  article_reference TEXT NOT NULL,  -- 'Art. 9', 'Art. 10', 'Annex IV', etc.
  requirement_type TEXT NOT NULL,   -- 'risk_management', 'data_governance', 'documentation', 'transparency', 'human_oversight', 'registration'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',    -- 'pending', 'in_progress', 'completed', 'not_applicable'
  due_date DATE,
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- Generated Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_system_id UUID REFERENCES ai_systems(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  document_type TEXT NOT NULL,      -- 'technical_documentation', 'risk_assessment', 'transparency_notice', 'dpia', 'conformity_declaration'
  title TEXT NOT NULL,
  content JSONB NOT NULL,           -- Structured document content
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft',      -- 'draft', 'review', 'final'
  generated_by TEXT DEFAULT 'ai',   -- 'ai', 'manual'
  storage_path TEXT,                -- Supabase Storage path for PDF export
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Log (critical for compliance — proves when actions were taken)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,             -- 'system_added', 'classification_changed', 'document_generated', etc.
  entity_type TEXT NOT NULL,        -- 'ai_system', 'document', 'requirement'
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (Supabase)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
```

### Project Structure

```
complyai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Public pages (landing, pricing, blog)
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   └── blog/
│   │   ├── (auth)/                   # Auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/              # Protected app pages
│   │   │   ├── layout.tsx            # Dashboard shell (sidebar + header)
│   │   │   ├── page.tsx              # Compliance overview dashboard
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx          # AI systems list
│   │   │   │   ├── new/page.tsx      # Add AI system wizard
│   │   │   │   └── [id]/page.tsx     # Single AI system detail
│   │   │   ├── classification/
│   │   │   │   └── [id]/page.tsx     # Risk classification detail + rationale
│   │   │   ├── roadmap/
│   │   │   │   └── page.tsx          # Compliance roadmap timeline
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx          # All generated documents
│   │   │   │   └── [id]/page.tsx     # Single document editor/viewer
│   │   │   └── settings/
│   │   │       └── page.tsx          # Org settings, billing, team
│   │   ├── api/                      # API routes
│   │   │   ├── classify/route.ts     # AI system classification logic
│   │   │   ├── generate/route.ts     # Document generation (Claude API)
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/route.ts   # Stripe webhook handler
│   │   │   └── export/route.ts       # PDF export
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── wizard/                   # AI inventory wizard steps
│   │   │   ├── StepCompanyInfo.tsx
│   │   │   ├── StepAIDiscovery.tsx   # "Do you use any of these?"
│   │   │   ├── StepSystemDetails.tsx
│   │   │   └── StepClassification.tsx
│   │   ├── dashboard/
│   │   │   ├── ComplianceScore.tsx    # Overall score widget
│   │   │   ├── SystemCard.tsx         # AI system summary card
│   │   │   ├── RequirementChecklist.tsx
│   │   │   └── TimelineView.tsx
│   │   └── documents/
│   │       ├── DocumentEditor.tsx
│   │       └── DocumentPreview.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts          # Auth middleware
│   │   ├── stripe.ts                 # Stripe helpers
│   │   ├── claude.ts                 # Claude API wrapper
│   │   ├── classification/
│   │   │   ├── engine.ts             # Risk classification logic (Annex III mapping)
│   │   │   ├── categories.ts         # AI Act categories + domains
│   │   │   └── requirements.ts       # Requirements per risk level
│   │   └── documents/
│   │       ├── templates.ts          # Document templates (Annex IV structure)
│   │       └── generator.ts          # AI-powered document generation
│   ├── hooks/                        # React hooks
│   └── types/                        # TypeScript type definitions
│       └── index.ts
├── supabase/
│   ├── migrations/                   # Database migrations
│   └── seed.sql                      # Seed data (AI categories, requirements)
├── public/
├── .env.local                        # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Key Technical Decisions

**Classification Engine (the brain of the product)**
This is NOT just a questionnaire. It's a decision tree that maps user inputs to Annex III domains:

```typescript
// lib/classification/engine.ts — simplified core logic
interface AISystemInput {
  purpose: string;
  dataTypes: string[];
  affectsDecisions: boolean;
  profilesPersons: boolean;
  sector: string;
  autonomyLevel: 'full' | 'assisted' | 'none';
}

function classifyRisk(input: AISystemInput): Classification {
  // Step 1: Check for prohibited practices (Art. 5)
  if (isProhibited(input)) return { level: 'unacceptable', articles: ['Art. 5'] };
  
  // Step 2: Check Annex III high-risk domains
  const annexIIIMatch = matchAnnexIII(input);
  if (annexIIIMatch) {
    // Step 3: Check exceptions (Art. 6(3)) — narrow procedural task, etc.
    if (qualifiesForException(input, annexIIIMatch)) {
      return { level: 'limited', rationale: 'Annex III match but exception applies' };
    }
    return { level: 'high', domain: annexIIIMatch.domain, articles: annexIIIMatch.articles };
  }
  
  // Step 4: Check Annex I (safety component of regulated product)
  if (isSafetyComponent(input)) return { level: 'high', articles: ['Art. 6(1)'] };
  
  // Step 5: Check transparency obligations (Art. 50)
  if (requiresTransparency(input)) return { level: 'limited', articles: ['Art. 50'] };
  
  // Step 6: Default
  return { level: 'minimal' };
}
```

**Claude API Integration (document generation)**
```typescript
// lib/claude.ts — document generation
async function generateComplianceDocument(
  type: 'technical_documentation' | 'risk_assessment' | 'transparency_notice',
  aiSystem: AISystem,
  organization: Organization
): Promise<DocumentContent> {
  const systemPrompt = getDocumentTemplate(type); // Annex IV structure
  const userPrompt = buildPrompt(aiSystem, organization);
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });
  
  return parseDocumentResponse(response);
}
```

---

## 7. MVP SCOPE (What to build in 4 weeks)

### Week 1: Foundation + Landing Page
- [ ] Set up Next.js project with TypeScript, Tailwind, shadcn/ui
- [ ] Set up Supabase project (database, auth, storage)
- [ ] Create database schema + migrations
- [ ] Build marketing landing page (hero, problem, solution, pricing, CTA)
- [ ] Implement email waitlist (collect signups)
- [ ] Set up Vercel deployment

### Week 2: AI Inventory Wizard + Classification
- [ ] Build multi-step wizard UI (5 steps)
- [ ] Implement AI discovery questionnaire (plain-language questions per Annex III domain)
- [ ] Build classification engine (Annex III + Art. 6 logic)
- [ ] Create AI system detail page with classification rationale
- [ ] Seed database with Annex III categories, common AI tools, and requirement mappings

### Week 3: Compliance Dashboard + Document Generation
- [ ] Build compliance overview dashboard (score, status per system, timeline)
- [ ] Implement requirement checklist per AI system
- [ ] Integrate Claude API for document generation
- [ ] Build document templates for: Technical Documentation (Annex IV), Risk Assessment (Art. 9), Transparency Notice (Art. 13)
- [ ] Add PDF export for generated documents

### Week 4: Payments + Polish + Launch Prep
- [ ] Integrate Stripe subscriptions (3 tiers)
- [ ] Implement free tier limitations (1 AI system, no document export)
- [ ] Add audit log for all actions
- [ ] Error handling, loading states, empty states
- [ ] SEO optimization for landing page
- [ ] Write 3 launch blog posts (SEO: "EU AI Act compliance for SMBs", "Is my AI high-risk?", "EU AI Act deadline August 2026")
- [ ] Prepare Product Hunt launch materials

### Post-MVP (Weeks 5-8)
- [ ] AI Act Q&A chatbot (Claude-powered, answers questions about the Act)
- [ ] Team collaboration (invite colleagues)
- [ ] Compliance certificate/badge ("AI Act Ready" badge for websites)
- [ ] Multi-language support (EN, NL, DE, FR)
- [ ] Notification system (deadline reminders, regulation updates)
- [ ] Integrations discovery (scan company email for AI tool receipts)

---

## 8. PRICING STRATEGY

| Tier | Price | Includes | Target |
|------|-------|----------|--------|
| Free | €0 | 1 AI system, classification only, no exports | Lead generation, try-before-buy |
| Starter | €49/mo | 5 AI systems, basic docs, PDF export | Solo entrepreneurs, micro businesses |
| Business | €149/mo | 20 AI systems, full docs, audit log, team (3 users) | SMBs 10-50 employees |
| Pro | €299/mo | Unlimited systems, priority support, custom branding, team (10 users) | SMBs 50-250 employees |

Annual discount: 20% off (€39/€119/€239 per month)

### Revenue targets
- Month 1: 50 free users, 5 paid → €500 MRR
- Month 3: 200 free, 30 paid → €3,500 MRR
- Month 6: 500 free, 100 paid → €12,000 MRR
- Month 12: 1000 free, 250 paid → €30,000 MRR

---

## 9. GO-TO-MARKET STRATEGY

### Launch channels (ranked by priority)

1. **SEO content** (long-term compounding)
   - "EU AI Act compliance checklist 2026"
   - "Is my AI system high-risk EU AI Act"
   - "EU AI Act SMB guide Netherlands"
   - "AI Act deadline August 2026 what to do"
   
2. **LinkedIn organic** (immediate reach)
   - Post about the AI Act deadline 2-3x/week
   - Share compliance tips, real examples, deadline countdowns
   - Engage with compliance professionals and SMB owners

3. **Product Hunt launch** (initial burst)
   - Schedule for a Tuesday, 4-6 weeks after MVP
   
4. **Dutch business communities**
   - MKB-Nederland forums
   - Brainport Eindhoven events
   - KVK (Chamber of Commerce) workshops — offer to present
   - Dutch Digital Agencies network

5. **Partnerships**
   - Dutch law firms offering AI Act advisory → refer clients to our tool
   - Accounting firms → bundle with compliance services
   - IT consultancies → white-label or referral commission

---

## 10. IMMEDIATE NEXT STEPS (This week)

### Day 1 (Today)
- [ ] Secure domain name (complyai.eu or alternative)
- [ ] Create GitHub repo
- [ ] Set up Next.js project with TypeScript + Tailwind + shadcn/ui
- [ ] Set up Supabase project

### Day 2
- [ ] Build and deploy landing page on Vercel
- [ ] Set up email collection (Supabase or simple form)
- [ ] Write first LinkedIn post about the AI Act deadline

### Day 3-4
- [ ] Post landing page to LinkedIn, Reddit r/SaaS, r/Netherlands
- [ ] Start reaching out for validation interviews (10-15 people)
- [ ] Begin building the AI inventory wizard

### Day 5-7
- [ ] Analyze landing page signups (target: 20+ in first week)
- [ ] Conduct first 3-5 validation interviews
- [ ] Continue building wizard + classification engine
- [ ] If signups are strong: full speed ahead on MVP
- [ ] If signups are weak: pivot messaging, try different angles

---

## 11. RISK MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Digital Omnibus pushes deadline to 2027 | Medium | High | Market the tool for "early compliance advantage" — companies that comply early win contracts |
| Enterprise competitor launches SMB tier | Low-Medium | High | Move fast, build community, focus on simplicity as moat |
| Regulation changes significantly | Low | Medium | Build flexible classification engine, charge for "always up-to-date" compliance |
| Low awareness among SMBs | Medium | Medium | Content marketing educates + sells simultaneously |
| Claude API costs eat margins | Low | Low | Use Sonnet (not Opus) for generation, cache common templates |

---

## 12. SUCCESS METRICS

### Week 1-2 (Validation)
- 20+ email signups on landing page
- 5+ validation interviews completed
- 3+ people say "I'd pay for this"

### Month 1 (Launch)
- 50+ registered users
- 5+ paying customers
- €500+ MRR

### Month 3 (Traction)
- 200+ registered users
- 30+ paying customers
- €3,500+ MRR
- Top 3 Google ranking for 1+ target keyword

### Month 6 (Growth)
- 500+ registered users
- 100+ paying customers
- €12,000+ MRR
- Partnership with 1+ Dutch law firm or consultancy