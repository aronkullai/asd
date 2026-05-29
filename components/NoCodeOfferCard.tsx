"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { AffiliateButton } from "@/components/AffiliateButton";
import type { NoCodeOffer } from "@/config/noCodeOffers";

export type PublicNoCodeOffer = Omit<NoCodeOffer, "source" | "sourceUrl">;

type NoCodeOfferCardProps = {
  affiliateLink?: string | null;
  casinoName: string;
  offer: PublicNoCodeOffer;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function NoCodeOfferCard({ affiliateLink, casinoName, offer }: NoCodeOfferCardProps) {
  return (
    <article className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-accent-dark dark:bg-emerald-400/10 dark:text-emerald-200">
          <FontAwesomeIcon icon={faTrophy} className="h-3.5 w-3.5" aria-hidden="true" />
          {offer.category}
        </span>
      </div>
      <div>
        <h3 className="text-lg font-black text-navy dark:text-white">{offer.label}</h3>
        <p className="mt-2 text-sm text-muted dark:text-slate-300">{offer.description}</p>
      </div>
      <div className="grid gap-2 rounded-card border border-line bg-soft p-3 text-sm text-muted dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        <span className="inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4 text-accent-dark dark:text-emerald-300" aria-hidden="true" />
          Checked: {formatDate(offer.lastCheckedAt)}
        </span>
        <span>Confirm the live terms on the casino site before opting in.</span>
      </div>
      <AffiliateButton
        casinoName={casinoName}
        affiliateLink={affiliateLink}
        label="Open offer page"
        source="no-code-offer-card"
      />
    </article>
  );
}
