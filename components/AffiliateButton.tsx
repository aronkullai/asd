"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { trackAffiliateClick } from "@/lib/analytics";
import { normalizeExternalUrl } from "@/lib/format";

type AffiliateButtonProps = {
  casinoName: string;
  casinoSlug?: string;
  affiliateLink?: string | null;
  promoCode?: string | null;
  className?: string;
  label?: string;
  source?: string;
};

export function AffiliateButton({
  casinoName,
  casinoSlug,
  affiliateLink,
  promoCode,
  className = "",
  label = "Visit site",
  source = "unknown"
}: AffiliateButtonProps) {
  const outboundUrl = normalizeExternalUrl(affiliateLink);

  if (!outboundUrl) {
    return (
      <span
        className={`inline-flex min-h-11 items-center justify-center rounded-card border border-line bg-slate-100 px-4 py-3 text-sm font-extrabold text-muted ${className}`}
      >
        Offer link pending
      </span>
    );
  }

  return (
    <a
      href={outboundUrl}
      target="_blank"
      rel="nofollow sponsored noopener"
      data-casino-name={casinoName}
      data-affiliate-link={outboundUrl}
      data-promo-code={promoCode || ""}
      onClick={() => {
        trackAffiliateClick({ casinoName, casinoSlug, promoCode, href: outboundUrl, source });
      }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent-dark hover:text-white hover:no-underline focus:outline-none focus:ring-4 focus:ring-accent/20 ${className}`}
    >
      {label}
      <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
