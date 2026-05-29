"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { normalizeExternalUrl } from "@/lib/format";

type AffiliateButtonProps = {
  casinoName: string;
  affiliateLink?: string | null;
  promoCode?: string | null;
  className?: string;
  label?: string;
};

export function AffiliateButton({
  casinoName,
  affiliateLink,
  promoCode,
  className = "",
  label = "Visit site"
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
        // Replace this console stub with analytics or affiliate click tracking later.
        console.log("Partner click", {
          casino_name: casinoName,
          affiliate_link: outboundUrl,
          promo_code: promoCode
        });
      }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent-dark hover:text-white hover:no-underline focus:outline-none focus:ring-4 focus:ring-accent/20 ${className}`}
    >
      {label}
      <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
