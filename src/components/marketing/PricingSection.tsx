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
    <section id="pricing" className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {PRICING_SECTION.title}
          </h2>
          <p className="mt-2 text-base text-slate-600">
            {PRICING_SECTION.subtitle}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium ${
              !isAnnual ? "text-slate-900" : "text-slate-500"
            }`}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1B2B5A] focus:ring-offset-2 ${
              isAnnual ? "bg-[#1B2B5A]" : "bg-slate-300"
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
              isAnnual ? "text-slate-900" : "text-slate-500"
            }`}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              Save {PRICING_SECTION.annualDiscount}%
            </span>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {PRICING_SECTION.tiers.map((tier) => {
            const price = calculatePrice(tier.monthlyPrice);
            const isContactSales = tier.cta === "Contact sales";

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 ${
                  tier.highlighted
                    ? "border-2 border-[#1B2B5A] shadow-lg lg:scale-105"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#1B2B5A] px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {tier.description}
                  </p>

                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-slate-900">
                        €{price}
                      </span>
                      <span className="ml-1 text-sm text-slate-600">
                        /month
                      </span>
                    </div>
                    {isAnnual && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        Billed annually (€{price * 12}/year)
                      </p>
                    )}
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check
                          className="h-4 w-4 flex-shrink-0 text-[#0D9488] mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-slate-600">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <Link
                    href={isContactSales ? "/contact" : "/signup"}
                    className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors duration-150 ${
                      tier.highlighted
                        ? "bg-[#1B2B5A] text-white hover:bg-[#2A3F7A]"
                        : "border-2 border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
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
