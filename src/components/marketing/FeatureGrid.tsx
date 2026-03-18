import {
  Search,
  Scale,
  FileText,
  LayoutDashboard,
  History,
  Bell,
} from "lucide-react";

import { FEATURES_SECTION } from "@/lib/constants";

const iconMap = {
  Search,
  Scale,
  FileText,
  LayoutDashboard,
  History,
  Bell,
} as const;

type IconName = keyof typeof iconMap;

export function FeatureGrid(): React.ReactElement {
  return (
    <section id="features" className="bg-slate-50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {FEATURES_SECTION.title}
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {FEATURES_SECTION.features.map((feature) => {
            const Icon = iconMap[feature.icon as IconName];

            return (
              <div
                key={feature.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Icon
                    className="h-5 w-5 text-[#1B2B5A]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
