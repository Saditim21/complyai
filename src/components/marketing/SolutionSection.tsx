import { FileText, Check, Circle } from "lucide-react";

import { SOLUTION_SECTION } from "@/lib/constants";

interface BrowserFrameProps {
  children: React.ReactNode;
}

function BrowserFrame({ children }: BrowserFrameProps): React.ReactElement {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
      <div className="flex h-9 items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27CA40]" />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function DiscoveryMockup(): React.ReactElement {
  const tools = [
    { name: "ChatGPT", category: "Content Generation", checked: true, categoryColor: "bg-blue-100 text-blue-700" },
    { name: "HireVue", category: "Candidate Screening", checked: true, categoryColor: "bg-purple-100 text-purple-700" },
    { name: "Grammarly", category: "Writing Assistant", checked: false, categoryColor: "bg-slate-100 text-slate-600" },
    { name: "Recommendation Engine", category: "E-commerce", checked: true, categoryColor: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-900">AI tools detected</p>
      <div className="space-y-2">
        {tools.map((tool) => (
          <div key={tool.name} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className={`flex h-4 w-4 items-center justify-center rounded border ${tool.checked ? "border-[#0D9488] bg-[#0D9488]" : "border-slate-300 bg-white"}`}>
                {tool.checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </div>
              <span className="text-xs font-medium text-slate-700">{tool.name}</span>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tool.categoryColor}`}>
              {tool.category}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[10px] text-slate-500">4 systems identified</span>
        <button className="rounded-md bg-[#1B2B5A] px-2.5 py-1 text-[10px] font-medium text-white">
          Continue
        </button>
      </div>
    </div>
  );
}

function RiskClassificationMockup(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-900">HireVue</p>
          <p className="text-[10px] text-slate-500">Candidate Screening System</p>
        </div>
        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-700 ring-1 ring-orange-200">
          HIGH RISK
        </span>
      </div>

      <div className="rounded-lg bg-slate-50 p-3">
        <p className="text-[10px] font-medium text-slate-600">Annex III Classification</p>
        <p className="mt-1 text-xs font-semibold text-slate-900">Employment, Worker Management</p>
        <p className="mt-0.5 text-[10px] text-slate-500">Article 6(2) — High-risk AI system</p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-600">Compliance requirements</span>
          <span className="text-[10px] font-semibold text-slate-900">3 of 7 met</span>
        </div>
        <div className="mt-1.5 h-2 w-full rounded-full bg-slate-200">
          <div className="h-2 w-[43%] rounded-full bg-[#0D9488]" />
        </div>
      </div>

      <div className="flex gap-2">
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Risk assessed</span>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">Docs pending</span>
      </div>
    </div>
  );
}

function DocumentsMockup(): React.ReactElement {
  const documents = [
    { name: "Technical Documentation", article: "Annex IV", status: "Draft", statusColor: "bg-amber-50 text-amber-700", action: "Edit" },
    { name: "Risk Management Plan", article: "Art. 9", status: "Generated", statusColor: "bg-emerald-50 text-emerald-700", action: "View" },
    { name: "Transparency Notice", article: "Art. 13", status: "Pending", statusColor: "bg-slate-100 text-slate-600", action: "Generate" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-900">Required documents</p>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.name} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">{doc.name}</p>
                <p className="text-[10px] text-slate-500">{doc.article}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${doc.statusColor}`}>
                {doc.status}
              </span>
              <button className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-50">
                {doc.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardMockup(): React.ReactElement {
  const stats = [
    { label: "AI Systems", value: "4", color: "text-slate-900" },
    { label: "Compliant", value: "2", color: "text-emerald-600" },
    { label: "Action Req.", value: "1", color: "text-amber-600" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90 transform" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#0D9488"
              strokeWidth="3"
              strokeDasharray="88"
              strokeDashoffset="29"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-slate-900">67%</span>
            <span className="text-[9px] text-slate-500">compliant</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-900">Overall compliance</p>
          <p className="mt-0.5 text-[10px] text-slate-500">Across all registered AI systems</p>
          <div className="mt-2 flex items-center gap-1">
            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
            <span className="text-[10px] text-slate-600">2 systems fully compliant</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-slate-50 p-2 text-center">
            <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[9px] text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const mockups = [DiscoveryMockup, RiskClassificationMockup, DocumentsMockup, DashboardMockup];

export function SolutionSection(): React.ReactElement {
  return (
    <section id="how-it-works" className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {SOLUTION_SECTION.title}
        </h2>

        <div className="mt-12 space-y-12 lg:space-y-16">
          {SOLUTION_SECTION.steps.map((step, index) => {
            const Mockup = mockups[index];
            const isReversed = index % 2 === 1;

            return (
              <div
                key={step.id}
                className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12 ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1B2B5A] text-lg font-bold text-white">
                      {step.id}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-base leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <BrowserFrame>
                    <Mockup />
                  </BrowserFrame>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
