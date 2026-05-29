"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown, faShieldHalved, faUserCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SocialLinks } from "@/components/SocialLinks";
import { useAuth } from "@/components/AuthProvider";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  async function handleLogout() {
    const ok = await logout();
    if (ok) {
      setAccountOpen(false);
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[#ffffff] shadow-sm dark:border-slate-800 dark:bg-[#111318] dark:shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
      <div className="mx-auto flex min-h-20 w-[min(100%-2rem,1180px)] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3 font-black text-navy hover:no-underline dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-card bg-navy text-white dark:bg-emerald-500 dark:text-slate-950">
            <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-extrabold text-muted dark:text-slate-300 lg:flex" aria-label="Primary navigation">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-navy hover:no-underline dark:text-slate-300 dark:hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SocialLinks className="hidden xl:flex" compact showPlaceholders={false} />
          <ThemeToggle />
          {!loading && user ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-card border border-line bg-white px-4 py-3 text-sm font-extrabold text-blue-800 transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-expanded={accountOpen}
                aria-label="Open account menu"
              >
                <FontAwesomeIcon icon={faUserCircle} className="h-4 w-4" aria-hidden="true" />
                My account
                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" aria-hidden="true" />
              </button>
              {accountOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 grid min-w-56 gap-2 rounded-card border border-line bg-white p-3 shadow-trust dark:border-slate-700 dark:bg-slate-900">
                  <span className="truncate px-2 text-xs font-bold text-muted dark:text-slate-400">{user.email}</span>
                  <Link href="/account" onClick={() => setAccountOpen(false)} className="rounded-card px-3 py-2 text-sm font-extrabold text-blue-800 hover:bg-blue-50 hover:no-underline dark:text-slate-100 dark:hover:bg-slate-800">
                    Account settings
                  </Link>
                  <button type="button" onClick={handleLogout} className="rounded-card px-3 py-2 text-left text-sm font-extrabold text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40">
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden min-h-11 items-center justify-center rounded-card border border-line bg-white px-4 py-3 text-sm font-extrabold text-blue-800 transition hover:bg-blue-50 hover:no-underline dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden min-h-11 items-center justify-center rounded-card border border-line bg-white px-4 py-3 text-sm font-extrabold text-blue-800 transition hover:bg-blue-50 hover:no-underline dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:inline-flex"
              >
                Register
              </Link>
            </>
          )}
          <Link
            href="/casinos"
            className="hidden min-h-11 items-center justify-center rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white transition hover:bg-accent-dark hover:text-white hover:no-underline sm:inline-flex"
          >
            Compare casinos
          </Link>
          <button
            type="button"
            className="inline-grid h-11 w-11 place-items-center rounded-card border border-line bg-white text-navy transition hover:bg-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className={`fixed inset-x-0 top-20 z-50 grid origin-top gap-3 border-b border-line bg-white p-4 shadow-trust transition dark:border-slate-800 dark:bg-[#111318] lg:hidden ${
          menuOpen ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
        }`}
      >
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="rounded-card border border-line bg-soft px-4 py-3 font-extrabold text-navy hover:bg-white hover:no-underline dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
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
        <div className="rounded-card border border-line bg-soft p-3 dark:border-slate-700 dark:bg-slate-900">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-muted dark:text-slate-400">Community</p>
          <SocialLinks compact showLabels />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {!loading && user ? (
            <>
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="rounded-card border border-line bg-soft px-4 py-3 text-center font-extrabold text-blue-800 hover:bg-white hover:no-underline dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                My account
              </Link>
              <button type="button" onClick={handleLogout} className="rounded-card border border-line bg-soft px-4 py-3 text-center font-extrabold text-red-700 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-slate-800">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-card border border-line bg-soft px-4 py-3 text-center font-extrabold text-blue-800 hover:bg-white hover:no-underline dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-card border border-line bg-soft px-4 py-3 text-center font-extrabold text-blue-800 hover:bg-white hover:no-underline dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
