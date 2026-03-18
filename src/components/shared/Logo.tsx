import Link from "next/link";

import { SITE_NAME } from "@/lib/constants";

type LogoVariant = "default" | "light";

interface LogoProps {
  variant?: LogoVariant;
  href?: string;
}

export function Logo({ variant = "default", href = "/" }: LogoProps): React.ReactElement {
  const colorClass = variant === "light" ? "text-white" : "text-[--brand-primary]";

  return (
    <Link
      href={href}
      className={`text-xl font-semibold tracking-tight ${colorClass} hover:opacity-90 transition-opacity duration-150`}
    >
      {SITE_NAME}
    </Link>
  );
}
