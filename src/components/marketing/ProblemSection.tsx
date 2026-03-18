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
    <section className="bg-[--bg-secondary] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[--text-primary] sm:text-3xl">
          {PROBLEM_SECTION.title}
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
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
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon
                    className="h-6 w-6 text-[--brand-primary]"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-4 text-2xl font-semibold text-[--text-primary] sm:text-3xl">
                  {statText}
                </p>
                <p className="mt-2 text-base text-[--text-secondary] max-w-xs">
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
