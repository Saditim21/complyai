import Link from "next/link";
import { Flag } from "lucide-react";

import { FOOTER_LINKS, FOOTER_TEXT, SITE_NAME } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";

export function Footer(): React.ReactElement {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Logo variant="light" />
            <p className="mt-4 text-sm text-slate-400 max-w-xs">
              {FOOTER_TEXT.disclaimer}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <Flag className="h-4 w-4 text-blue-400" aria-hidden="true" />
              <span>{FOOTER_TEXT.euCompliance}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-sm text-slate-500 text-center">
            {FOOTER_TEXT.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
