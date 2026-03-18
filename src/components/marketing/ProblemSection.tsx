"use client";

import { useEffect, useState } from "react";
import { Shield, EyeOff, Clock } from "lucide-react";

import { getDaysUntil } from "@/lib/utils";
import { PROBLEM_SECTION, EU_AI_ACT_DEADLINE } from "@/lib/constants";

const iconMap = {
  Shield,
  EyeOff,
  Clock,
} as const;

type IconName = keyof typeof iconMap;

export function ProblemSection(): React.ReactElement {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    setDaysRemaining(getDaysUntil(EU_AI_ACT_DEADLINE));
  }, []);

  return (
    <section className="bg-slate-50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {PROBLEM_SECTION.title}
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PROBLEM_SECTION.stats.map((item) => {
            const Icon = iconMap[item.icon as IconName];
            const isDeadlineStat = item.id === "deadline";
            const statText = isDeadlineStat
              ? daysRemaining !== null
                ? `${daysRemaining} ${item.stat}`
                : `— ${item.stat}`
              : item.stat;

            return (
              <div
                key={item.id}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Icon
                    className="h-6 w-6 text-[#1B2B5A]"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-4 text-2xl font-bold text-[#1B2B5A] sm:text-3xl">
                  {statText}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
