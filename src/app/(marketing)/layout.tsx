import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({
  children,
}: MarketingLayoutProps): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
