"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";

import { getDaysUntil } from "@/lib/utils";
import { HERO_TEXT, CTA_TEXT, EU_AI_ACT_DEADLINE } from "@/lib/constants";

export function Hero(): React.ReactElement {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    setDaysRemaining(getDaysUntil(EU_AI_ACT_DEADLINE));
  }, []);

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <span>{HERO_TEXT.eyebrow}</span>
          </div>

          <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight text-[--text-primary] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15]">
            {HERO_TEXT.headline.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < HERO_TEXT.headline.split("\n").length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[--text-secondary]">
            {HERO_TEXT.subheadline}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-lg bg-[--brand-primary] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[--brand-primary-light] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[--brand-primary] focus:ring-offset-2 sm:w-auto"
            >
              {CTA_TEXT.checkCompliance}
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-2 text-base font-medium text-[--text-secondary] hover:text-[--text-primary] transition-colors duration-150"
            >
              {CTA_TEXT.seeHowItWorks}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-4 text-sm text-[--text-tertiary]">
            {HERO_TEXT.trustNote}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 border-t border-[--border-default] pt-8 sm:flex-row sm:justify-center sm:gap-2">
            <span className="text-sm text-[--text-tertiary]">
              {HERO_TEXT.trustBarPrefix}
            </span>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm font-medium text-[--text-primary]">
                {HERO_TEXT.trustBarRegulation}
              </span>
            </div>
            {daysRemaining !== null && (
              <span className="text-sm text-[--text-tertiary] sm:ml-2 sm:border-l sm:border-[--border-default] sm:pl-4">
                {daysRemaining} days until enforcement
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
