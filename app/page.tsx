import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faDice, faShieldHalved, faTriangleExclamation, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { AffiliateButton } from "@/components/AffiliateButton";
import { CasinoLogo } from "@/components/CasinoLogo";
import { PromoCodeBadge } from "@/components/PromoCodeBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { TrustBadges } from "@/components/TrustBadges";
import { casinos } from "@/lib/casino-data";
import { getBestPromoCodesForCasinoWithDb } from "@/lib/promo-code-db";
import { getConfiguredAffiliateLink } from "@/lib/promo-code-service";

const features = [
  {
    icon: faShieldHalved,
    title: "Trust-first ratings",
    body: "We prioritize licensing, safety tools, payout clarity, support quality, and real user feedback."
  },
  {
    icon: faDice,
    title: "Verified promo codes",
    body: "Promo pages are structured for last-checked timestamps and partner offer verification."
  },
  {
    icon: faCircleInfo,
    title: "Transparent model",
    body: "Outbound partner links are disclosed clearly without letting them define the rankings."
  },
  {
    icon: faTriangleExclamation,
    title: "Responsible gambling focus",
    body: "PromoGuard is built for adults only and avoids misleading claims about winning."
  }
];

export default async function HomePage() {
  const promoEntries = await Promise.all(
    casinos.map(async (casino) => ({ casino, promo: (await getBestPromoCodesForCasinoWithDb(casino.slug))[0] }))
  );
  const topPromos = promoEntries.filter((item) => Boolean(item.promo)).slice(0, 3);

  return (
    <main>
      <section className="border-b border-line bg-gradient-to-br from-white via-blue-50 to-emerald-50">
        <div className="mx-auto grid min-h-[calc(100svh-80px)] w-[min(100%-2rem,1180px)] items-center gap-10 py-16 lg:grid-cols-[1.18fr_0.82fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-accent-dark">Independent casino comparison</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.04] tracking-normal text-navy md:text-7xl">
              Trusted Casino Ratings Powered by Real Reviews
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-700 md:text-xl">
              PromoGuard uses independent review criteria and Trustpilot data placeholders to surface safer casino choices, clearer promo terms, and quick offer checks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/casinos" className="inline-flex min-h-12 items-center justify-center rounded-card bg-accent px-5 py-3 font-extrabold text-white transition hover:bg-accent-dark hover:text-white hover:no-underline">
                Compare casinos
              </Link>
              <Link href="/promos" className="inline-flex min-h-12 items-center justify-center rounded-card border border-line bg-white px-5 py-3 font-extrabold text-blue-900 transition hover:bg-blue-50 hover:no-underline">
                See our latest promo codes
              </Link>
            </div>
          </div>
          <aside className="grid gap-3 rounded-card border border-line bg-white p-5 shadow-trust">
            {casinos.slice(0, 4).map((casino) => (
              <div key={casino.id} className="flex items-center justify-between gap-4 rounded-card border border-line bg-soft p-3">
                <div className="flex items-center gap-3">
                  <CasinoLogo text={casino.logoText} iconConfig={casino.logoIcon} size="sm" />
                  <div>
                    <strong className="block text-navy">{casino.name}</strong>
                    <span className="text-sm text-muted">Promo code ready</span>
                  </div>
                </div>
                <span className="font-black text-accent-dark">{casino.rating.toFixed(1)}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader eyebrow="Why PromoGuard?" title="A review site designed to earn trust first" center />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-card border border-line bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-card bg-emerald-50 text-accent-dark">
                  <FontAwesomeIcon icon={feature.icon} className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-lg font-black text-navy">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-20">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Highlighted promos" title="Current codes worth checking first" />
            <Link href="/promos" className="font-extrabold text-blue-800">
              See all promos
            </Link>
          </div>
          {topPromos.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {topPromos.map(({ promo, casino }) => (
                <article key={promo.id} className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <CasinoLogo text={casino.logoText} iconConfig={casino.logoIcon} size="sm" />
                    <h2 className="text-xl font-black text-navy">{casino.name}</h2>
                  </div>
                  <PromoCodeBadge code={promo.code} />
                  <p className="text-sm text-muted">Open the offer, confirm the terms, and use the code only if it matches the current casino cashier flow.</p>
                  <AffiliateButton casinoName={casino.name} affiliateLink={getConfiguredAffiliateLink(casino.slug)} promoCode={promo.code} label="View offer" />
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-dashed border-line bg-white p-6 text-muted">
              No promo codes are configured yet. Add owned codes in <code>config/affiliateConfig.ts</code> or verified external codes through the researcher.
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader eyebrow="Trust signals" title="Built for transparent casino comparison" center />
          <TrustBadges />
          <div className="mt-8 rounded-card border border-blue-100 bg-blue-50 p-5 text-blue-950">
            <div className="flex gap-3">
              <FontAwesomeIcon icon={faUserCheck} className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
              <p className="m-0">
                PromoGuard is 18+ only. Always read casino terms, check current Trustpilot reviews yourself, and never gamble with money you cannot afford to lose.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
