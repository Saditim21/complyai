import { SOLUTION_SECTION } from "@/lib/constants";

interface MockupPlaceholderProps {
  label: string;
}

function MockupPlaceholder({ label }: MockupPlaceholderProps): React.ReactElement {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[--border-default] bg-[--bg-tertiary] shadow-lg">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-[--border-default]" />
          <p className="mt-3 text-sm font-medium text-[--text-tertiary]">
            {label}
          </p>
        </div>
      </div>
      <div className="absolute left-0 right-0 top-0 flex h-8 items-center gap-1.5 border-b border-[--border-default] bg-white px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
      </div>
    </div>
  );
}

export function SolutionSection(): React.ReactElement {
  return (
    <section id="how-it-works" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[--text-primary] sm:text-3xl">
          {SOLUTION_SECTION.title}
        </h2>

        <div className="mt-16 space-y-16 lg:space-y-24">
          {SOLUTION_SECTION.steps.map((step, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={step.id}
                className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[--brand-primary] text-lg font-semibold text-white">
                    {step.id}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[--text-primary] sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[--text-secondary] max-w-lg">
                    {step.description}
                  </p>
                </div>
                <div className="flex-1">
                  <MockupPlaceholder label={step.mockupLabel} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
