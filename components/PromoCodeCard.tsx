"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faClock, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { AffiliateButton } from "@/components/AffiliateButton";
import { PromoRegistrationModal } from "@/components/PromoRegistrationModal";
import { trackPromoCodeClick } from "@/lib/analytics";
import type { DisplayPromoCode } from "@/lib/types";

type PromoCodeCardProps = {
  casinoName: string;
  casinoSummary?: string;
  affiliateLink?: string | null;
  promo: DisplayPromoCode;
};

export function PromoCodeCard({ casinoName, casinoSummary, affiliateLink, promo }: PromoCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function copyAndPrompt() {
    trackPromoCodeClick({ casinoName, casinoSlug: promo.casinoSlug, promoCode: promo.code, source: "casino-promo-card" });
    setModalOpen(true);

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
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-900">
          Source checked offer
        </span>
      </div>
      <button
        type="button"
        onClick={copyAndPrompt}
        className="rounded-card border border-dashed border-amber-500 bg-amber-50 p-3 text-center transition hover:-translate-y-0.5 hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-300/30 dark:bg-amber-400/10 dark:hover:bg-amber-400/20"
      >
        <p className="m-0 text-xs font-black uppercase tracking-wide text-amber-900">Promo code</p>
        <p className="mt-1 text-2xl font-black text-amber-950 dark:text-amber-100">{promo.code}</p>
        <p className="mt-1 text-xs font-bold text-amber-900 dark:text-amber-200">{copied ? "Copied. Registration details opened." : "Click to copy and view registration details"}</p>
      </button>
      <div>
        <h3 className="text-lg font-black text-navy">{promo.benefitTitle || promo.label}</h3>
        {promo.benefitDescription || promo.description ? <p className="mt-1 text-sm text-muted">{promo.benefitDescription || promo.description}</p> : null}
        <div className="mt-3 grid gap-2 text-xs font-bold text-muted">
          {promo.bonusType ? <span>Bonus type: {promo.bonusType}</span> : null}
          {promo.minDeposit ? <span>Minimum deposit: {promo.minDeposit}</span> : null}
          {promo.wageringRequirements || promo.conditions ? <span>Wagering: {promo.wageringRequirements || promo.conditions}</span> : null}
        </div>
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
        <span className="inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-accent-dark" aria-hidden="true" />
          Expires: {promo.validUntil ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(promo.validUntil)) : "No expiry listed"}
        </span>
      </div>
      <button
        type="button"
        onClick={copyAndPrompt}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-card bg-navy px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
      >
        <FontAwesomeIcon icon={faClipboard} className="h-4 w-4" aria-hidden="true" />
        {copied ? "Copied" : "Copy code"}
      </button>
      <AffiliateButton casinoName={casinoName} affiliateLink={affiliateLink} promoCode={promo.code} source="casino-promo-card" label="Open site only" />
      <PromoRegistrationModal
        affiliateLink={affiliateLink}
        casinoName={casinoName}
        casinoSlug={promo.casinoSlug}
        casinoSummary={casinoSummary}
        copied={copied}
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        promo={promo}
      />
    </article>
  );
}
