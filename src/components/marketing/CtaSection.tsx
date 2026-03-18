"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { CTA_SECTION } from "@/lib/constants";

export function CtaSection(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const waitlistCount = 847;

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

  const socialProofText = CTA_SECTION.socialProof.replace(
    "{count}",
    waitlistCount.toLocaleString()
  );

  return (
    <section className="bg-[--brand-primary] py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {CTA_SECTION.title}
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          {CTA_SECTION.subtitle}
        </p>

        {isSubmitted ? (
          <div className="mt-8 rounded-lg bg-white/10 p-6">
            <p className="text-lg font-medium text-white">
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
              className="w-full rounded-lg border-0 bg-white px-4 py-3 text-base text-[--text-primary] placeholder:text-[--text-tertiary] focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-80"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[--brand-secondary] px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-[--brand-secondary-light] focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          {socialProofText}
        </p>
      </div>
    </section>
  );
}
