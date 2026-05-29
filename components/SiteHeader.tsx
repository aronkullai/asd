"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faShieldHalved, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-[min(100%-2rem,1180px)] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3 font-black text-navy hover:no-underline">
          <span className="grid h-10 w-10 place-items-center rounded-card bg-navy text-white">
            <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-extrabold text-muted lg:flex" aria-label="Primary navigation">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-navy hover:no-underline">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/casinos"
            className="hidden min-h-11 items-center justify-center rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white transition hover:bg-accent-dark hover:text-white hover:no-underline sm:inline-flex"
          >
            Compare casinos
          </Link>
          <button
            type="button"
            className="inline-grid h-11 w-11 place-items-center rounded-card border border-line bg-white text-navy transition hover:bg-soft lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className={`fixed inset-x-0 top-20 z-50 grid origin-top gap-3 border-b border-line bg-white p-4 shadow-trust transition lg:hidden ${
          menuOpen ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
        }`}
      >
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="rounded-card border border-line bg-soft px-4 py-3 font-extrabold text-navy hover:bg-white hover:no-underline"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/casinos"
          onClick={() => setMenuOpen(false)}
          className="inline-flex min-h-11 items-center justify-center rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white transition hover:bg-accent-dark hover:text-white hover:no-underline"
        >
          Compare casinos
        </Link>
      </div>
    </header>
  );
}
