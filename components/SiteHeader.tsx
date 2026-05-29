import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
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
        <Link
          href="/casinos"
          className="inline-flex min-h-11 items-center justify-center rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white transition hover:bg-accent-dark hover:text-white hover:no-underline"
        >
          Compare casinos
        </Link>
      </div>
    </header>
  );
}
