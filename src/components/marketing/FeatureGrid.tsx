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
    <section id="features" className="bg-[--bg-secondary] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[--text-primary] sm:text-3xl">
          {FEATURES_SECTION.title}
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {FEATURES_SECTION.features.map((feature) => {
            const Icon = iconMap[feature.icon as IconName];

            return (
              <div
                key={feature.id}
                className="rounded-xl border border-[--border-default] bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[--bg-secondary]">
                  <Icon
                    className="h-5 w-5 text-[--brand-primary]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[--text-primary]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[--text-secondary]">
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
