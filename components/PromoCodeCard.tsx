"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faClock, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { AffiliateButton } from "@/components/AffiliateButton";
import type { DisplayPromoCode } from "@/lib/types";

type PromoCodeCardProps = {
  casinoName: string;
  affiliateLink?: string | null;
  promo: DisplayPromoCode;
};

export function PromoCodeCard({ casinoName, affiliateLink, promo }: PromoCodeCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function revealAndCopy() {
    setRevealed(true);

    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${promo.isAffiliateOwned ? "bg-emerald-100 text-emerald-900" : "bg-blue-100 text-blue-900"}`}>
          {promo.isAffiliateOwned ? "Highlighted code" : "Public third-party code"}
        </span>
        <span className="text-xs font-bold text-muted">Source: {promo.source}</span>
      </div>
      <div className="rounded-card border border-dashed border-amber-500 bg-amber-50 p-3 text-center">
        <p className="m-0 text-xs font-black uppercase tracking-wide text-amber-900">Promo code</p>
        <p className="mt-1 text-2xl font-black text-amber-950">
          {revealed ? promo.code : `${promo.code.slice(0, 2)}...${promo.code.slice(-1)}`}
        </p>
      </div>
      <div>
        <h3 className="text-lg font-black text-navy">{promo.label}</h3>
        {promo.description ? <p className="mt-1 text-sm text-muted">{promo.description}</p> : null}
        {promo.conditions ? <p className="mt-2 text-xs font-bold text-muted">Conditions: {promo.conditions}</p> : null}
      </div>
      <div className="grid gap-2 rounded-card border border-line bg-soft p-3 text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4 text-accent-dark" aria-hidden="true" />
          Compare source and terms before using this code.
        </span>
        <span className="inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-accent-dark" aria-hidden="true" />
          Last checked: {promo.lastCheckedAt ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(promo.lastCheckedAt)) : "Manual review"}
        </span>
      </div>
      <button
        type="button"
        onClick={revealAndCopy}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-card bg-navy px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
      >
        <FontAwesomeIcon icon={faClipboard} className="h-4 w-4" aria-hidden="true" />
        {copied ? "Copied" : revealed ? "Copy code" : "Show code"}
      </button>
      <AffiliateButton casinoName={casinoName} affiliateLink={affiliateLink} promoCode={promo.code} label="View offer" />
    </article>
  );
}
