"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { FAQ_SECTION } from "@/lib/constants";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  isLast,
}: AccordionItemProps): React.ReactElement {
  return (
    <div className={isLast ? "" : "border-b border-slate-200"}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-slate-900 pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
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
        <p className="text-base leading-relaxed text-slate-600">
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
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {FAQ_SECTION.title}
        </h2>

        <div className="mt-10 border-t border-slate-200">
          {FAQ_SECTION.questions.map((item, index) => (
            <AccordionItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
              isLast={index === FAQ_SECTION.questions.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
