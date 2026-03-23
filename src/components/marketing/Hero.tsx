"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Flag } from "lucide-react";

import { getDaysUntil } from "@/lib/utils";
import { HERO_TEXT, CTA_TEXT, EU_AI_ACT_DEADLINE } from "@/lib/constants";

type FormState = "idle" | "submitting" | "success" | "duplicate" | "error";

export function Hero(): React.ReactElement {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  useEffect(() => {
    setDaysRemaining(getDaysUntil(EU_AI_ACT_DEADLINE));
  }, []);

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
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <span>{HERO_TEXT.eyebrow}</span>
          </div>

          <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight text-[#0F172A] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15]">
            {HERO_TEXT.headline.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < HERO_TEXT.headline.split("\n").length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {HERO_TEXT.subheadline}
          </p>

          <div className="mt-8">
            {formState === "success" ? (
              <div className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-emerald-800">You're on the list!</p>
                  <p className="text-sm text-emerald-700">We'll send you early access when we launch.</p>
                </div>
              </div>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
                >
                  <label htmlFor="hero-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="hero-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formState !== "idle") setFormState("idle");
                    }}
                    placeholder="Enter your work email"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-[#1B2B5A] focus:outline-none focus:ring-2 focus:ring-[#1B2B5A]/20"
                  />
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1B2B5A] px-6 py-3 text-base font-medium text-white shadow-lg transition-colors duration-150 hover:bg-[#2A3F7A] focus:outline-none focus:ring-2 focus:ring-[#1B2B5A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {formState === "submitting" ? (
                      "..."
                    ) : (
                      <>
                        {CTA_TEXT.checkCompliance}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>

                {formState === "duplicate" && (
                  <p className="mt-2 text-sm text-teal-600">
                    You're already on the list — we'll be in touch soon.
                  </p>
                )}
                {formState === "error" && (
                  <p className="mt-2 text-sm text-red-600">
                    Something went wrong. Please try again.
                  </p>
                )}
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-slate-500">{HERO_TEXT.trustNote}</p>

          <div className="mt-10 flex flex-col items-center gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-center sm:gap-3">
            <span className="text-sm text-slate-500">{HERO_TEXT.trustBarPrefix}</span>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm font-medium text-slate-900">
                {HERO_TEXT.trustBarRegulation}
              </span>
            </div>
            {daysRemaining !== null && (
              <span className="text-sm font-medium text-amber-700 sm:ml-2 sm:border-l sm:border-slate-300 sm:pl-4">
                {daysRemaining} days until enforcement
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
