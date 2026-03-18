import { Hero } from "@/components/marketing/Hero";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { SolutionSection } from "@/components/marketing/SolutionSection";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { CtaSection } from "@/components/marketing/CtaSection";

export default function HomePage(): React.ReactElement {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeatureGrid />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
