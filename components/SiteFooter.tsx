import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 py-10 text-slate-300">
      <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-5">
        <Link href="/" className="text-lg font-black text-white hover:no-underline">
          PromoGuard
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold" aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {siteConfig.legalNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="max-w-4xl text-sm text-slate-400">
          Disclosure: some outbound casino links are partner links. PromoGuard may earn a commission at no extra cost to the user, which supports independent reviews and free promo-code tools.
        </p>
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} PromoGuard. 18+ only. Please play responsibly.</p>
      </div>
    </footer>
  );
}
