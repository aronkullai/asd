"use client";

import { useState } from "react";
import { PromoRegistrationModal } from "@/components/PromoRegistrationModal";
import { trackPromoCodeClick } from "@/lib/analytics";
import type { DisplayPromoCode } from "@/lib/types";

type ClickablePromoCodeBadgeProps = {
  affiliateLink?: string | null;
  casinoName: string;
  casinoSummary?: string;
  compact?: boolean;
  promo: DisplayPromoCode;
};

export function ClickablePromoCodeBadge({ affiliateLink, casinoName, casinoSummary, compact = false, promo }: ClickablePromoCodeBadgeProps) {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function copyAndPrompt() {
    trackPromoCodeClick({ casinoName, casinoSlug: promo.casinoSlug, promoCode: promo.code, source: "clickable-promo-badge" });
    setModalOpen(true);

    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copyAndPrompt}
        className="w-full rounded-card border border-dashed border-amber-500 bg-white px-3 py-2 text-center font-black text-amber-950 transition hover:-translate-y-0.5 hover:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-300/30 dark:bg-amber-400/10 dark:text-amber-100 dark:hover:bg-amber-400/20"
      >
        <span className={compact ? "text-base" : "text-xl"}>{promo.code}</span>
        <span className="mt-1 block text-xs text-amber-900 dark:text-amber-200">{copied ? "Copied" : "Click to copy"}</span>
      </button>
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
    </>
  );
}
