"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { NAV_LINKS, CTA_TEXT } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";

export function Navbar(): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="hidden md:flex md:items-center md:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-[#1B2B5A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2A3F7A] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#1B2B5A] focus:ring-offset-2"
            >
              {CTA_TEXT.getStartedFree}
            </Link>
          </div>

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#1B2B5A]"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200">
            <div className="space-y-1 px-2 pb-4 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="block w-full rounded-lg bg-[#1B2B5A] px-3 py-2.5 text-center text-base font-medium text-white hover:bg-[#2A3F7A] transition-colors duration-150"
                >
                  {CTA_TEXT.getStartedFree}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
