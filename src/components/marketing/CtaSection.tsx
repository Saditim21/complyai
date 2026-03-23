"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

import { CTA_SECTION } from "@/lib/constants";

type FormState = "idle" | "submitting" | "success" | "duplicate" | "error";

export function CtaSection(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email || formState === "submitting") return;

    setFormState("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setFormState("success");
        setEmail("");
      } else if (res.status === 409) {
        setFormState("duplicate");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
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

        {formState === "success" ? (
          <div className="mt-8 rounded-xl border border-white/20 bg-white/10 p-6">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-teal-400" aria-hidden="true" />
              <p className="text-lg font-semibold text-white">You're on the list!</p>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              We'll be in touch with early access to ComplyAI.
            </p>
          </div>
        ) : (
          <>
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formState !== "idle") setFormState("idle");
                }}
                placeholder={CTA_SECTION.placeholder}
                required
                className="w-full rounded-lg border border-white/20 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50 sm:w-72"
              />
              <button
                type="submit"
                disabled={formState === "submitting"}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-150 hover:bg-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState === "submitting" ? (
                  "Submitting..."
                ) : (
                  <>
                    {CTA_SECTION.buttonText}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {formState === "duplicate" && (
              <p className="mt-3 text-sm text-teal-300">
                You're already on the list — we'll be in touch soon.
              </p>
            )}
            {formState === "error" && (
              <p className="mt-3 text-sm text-red-300">
                Something went wrong. Please try again.
              </p>
            )}
          </>
        )}

        <p className="mt-6 text-sm text-slate-400">
          No credit card required · Free for your first AI system
        </p>
      </div>
    </section>
  );
}
