"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { PRICING_SECTION } from "@/lib/constants";

export function PricingSection(): React.ReactElement {
  const [isAnnual, setIsAnnual] = useState(true);

  const calculatePrice = (monthlyPrice: number): number => {
    if (isAnnual) {
      const discountedMonthly =
        monthlyPrice * (1 - PRICING_SECTION.annualDiscount / 100);
      return Math.round(discountedMonthly);
    }
    return monthlyPrice;
  };

  return (
    <section id="pricing" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[--text-primary] sm:text-3xl">
            {PRICING_SECTION.title}
          </h2>
          <p className="mt-3 text-base text-[--text-secondary]">
            {PRICING_SECTION.subtitle}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium ${
              !isAnnual ? "text-[--text-primary]" : "text-[--text-tertiary]"
            }`}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[--brand-primary] focus:ring-offset-2 ${
              isAnnual ? "bg-[--brand-primary]" : "bg-[--border-default]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isAnnual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              isAnnual ? "text-[--text-primary]" : "text-[--text-tertiary]"
            }`}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              Save {PRICING_SECTION.annualDiscount}%
            </span>
          )}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {PRICING_SECTION.tiers.map((tier) => {
            const price = calculatePrice(tier.monthlyPrice);
            const isContactSales = tier.cta === "Contact sales";

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl border p-8 ${
                  tier.highlighted
                    ? "border-[--brand-primary] ring-2 ring-[--brand-primary]"
                    : "border-[--border-default]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[--brand-primary] px-4 py-1 text-sm font-medium text-white">
                      Most popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-[--text-primary]">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm text-[--text-secondary]">
                    {tier.description}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold text-[--text-primary]">
                      €{price}
                    </span>
                    <span className="ml-1 text-sm text-[--text-secondary]">
                      /month
                    </span>
                  </div>
                  {isAnnual && (
                    <p className="mt-1 text-xs text-[--text-tertiary]">
                      Billed annually (€{price * 12}/year)
                    </p>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className="h-5 w-5 flex-shrink-0 text-[--brand-secondary]"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-[--text-secondary]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    href={isContactSales ? "/contact" : "/signup"}
                    className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors duration-150 ${
                      tier.highlighted
                        ? "bg-[--brand-primary] text-white hover:bg-[--brand-primary-light]"
                        : "border border-[--border-default] bg-white text-[--text-primary] hover:bg-[--bg-secondary]"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
