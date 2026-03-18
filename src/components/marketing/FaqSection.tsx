"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { FAQ_SECTION } from "@/lib/constants";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps): React.ReactElement {
  return (
    <div className="border-b border-[--border-default]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-[--text-primary] pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-[--text-tertiary] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-out ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-[--text-secondary] pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FaqSection(): React.ReactElement {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string): void => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[--text-primary] sm:text-3xl">
          {FAQ_SECTION.title}
        </h2>

        <div className="mt-12">
          {FAQ_SECTION.questions.map((item) => (
            <AccordionItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
