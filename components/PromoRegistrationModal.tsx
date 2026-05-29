"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AffiliateButton } from "@/components/AffiliateButton";
import type { DisplayPromoCode } from "@/lib/types";

type PromoRegistrationModalProps = {
  affiliateLink?: string | null;
  casinoName: string;
  casinoSlug?: string;
  casinoSummary?: string;
  copied?: boolean;
  onClose: () => void;
  open: boolean;
  promo: DisplayPromoCode;
};

export function PromoRegistrationModal({
  affiliateLink,
  casinoName,
  casinoSlug,
  casinoSummary,
  copied,
  onClose,
  open,
  promo
}: PromoRegistrationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby={`promo-modal-${promo.id}`}>
      <div className="relative grid max-h-[90vh] w-[min(100%,520px)] gap-5 overflow-y-auto rounded-card border border-line bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-card border border-line bg-white text-navy transition hover:bg-soft dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          aria-label="Close registration popup"
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="pr-10">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-accent-dark dark:text-emerald-300">
            {copied ? "Code copied" : "Promo code ready"}
          </p>
          <h2 id={`promo-modal-${promo.id}`} className="text-2xl font-black text-navy dark:text-white">
            Register at {casinoName}?
          </h2>
          {casinoSummary ? <p className="mt-2 text-sm text-muted dark:text-slate-300">{casinoSummary}</p> : null}
        </div>

        <div className="rounded-card border border-dashed border-amber-500 bg-amber-50 p-4 text-center dark:bg-amber-400/10">
          <p className="m-0 text-xs font-black uppercase tracking-wide text-amber-900 dark:text-amber-200">Copied promo code</p>
          <p className="mt-1 text-3xl font-black text-amber-950 dark:text-amber-100">{promo.code}</p>
        </div>

        <div className="rounded-card border border-line bg-soft p-4 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="font-black text-navy dark:text-white">{promo.benefitTitle || promo.label}</h3>
          {promo.benefitDescription || promo.description ? (
            <p className="mt-2 text-sm text-muted dark:text-slate-300">{promo.benefitDescription || promo.description}</p>
          ) : null}
          <div className="mt-3 grid gap-1 text-xs font-bold text-muted dark:text-slate-400">
            {promo.bonusType ? <span>Bonus type: {promo.bonusType}</span> : null}
            {promo.minDeposit ? <span>Minimum deposit: {promo.minDeposit}</span> : null}
            {promo.wageringRequirements || promo.conditions ? <span>Wagering: {promo.wageringRequirements || promo.conditions}</span> : null}
          </div>
        </div>

        <p className="m-0 text-sm text-muted dark:text-slate-300">
          The code is on your clipboard. Open the registration page, paste it where the casino asks for a bonus or promo code, and confirm the live terms before depositing.
        </p>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <AffiliateButton
            casinoName={casinoName}
            casinoSlug={casinoSlug || promo.casinoSlug}
            affiliateLink={affiliateLink}
            promoCode={promo.code}
            label={`Register at ${casinoName}`}
            source="promo-registration-modal"
          />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(promo.code).catch(() => undefined)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-card border border-line bg-white px-4 py-3 text-sm font-extrabold text-blue-800 transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-slate-800"
          >
            <FontAwesomeIcon icon={faClipboard} className="h-4 w-4" aria-hidden="true" />
            Copy again
          </button>
        </div>
      </div>
    </div>
  );
}
