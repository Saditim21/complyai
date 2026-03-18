"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { CTA_SECTION } from "@/lib/constants";

export function CtaSection(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    // TODO: Integrate with Supabase waitlist table
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-[#1B2B5A] py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {CTA_SECTION.title}
        </h2>
        <p className="mt-3 text-base text-slate-300 sm:text-lg">
          {CTA_SECTION.subtitle}
        </p>

        {isSubmitted ? (
          <div className="mt-8 rounded-xl border border-white/20 bg-white/10 p-6">
            <p className="text-lg font-semibold text-white">
              Thanks for signing up!
            </p>
            <p className="mt-2 text-sm text-slate-300">
              We'll be in touch soon with early access to ComplyAI.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <label htmlFor="cta-email" className="sr-only">
              Email address
            </label>
            <input
              id="cta-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={CTA_SECTION.placeholder}
              required
              className="w-full rounded-lg border border-white/20 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-72"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-150 hover:bg-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  {CTA_SECTION.buttonText}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-slate-400">
          No credit card required · Free for your first AI system
        </p>
      </div>
    </section>
  );
}
