import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClock, faHeadset, faIdCard, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import type { Casino, TrustpilotSummary } from "@/lib/types";
import { payoutSpeedLabel } from "@/lib/format";
import { AffiliateButton } from "@/components/AffiliateButton";
import { CasinoIcon } from "@/components/CasinoIcon";
import { ClickablePromoCodeBadge } from "@/components/ClickablePromoCodeBadge";
import { RatingStars } from "@/components/RatingStars";
import { TrustpilotBadge } from "@/components/TrustpilotBadge";
import { getBestPromoCodesForCasino, getConfiguredAffiliateLink } from "@/lib/promo-code-service";
import type { DisplayPromoCode } from "@/lib/types";

type CasinoCardProps = {
  casino: Casino;
  rank?: number;
  bestPromos?: DisplayPromoCode[];
  trustpilotSummary?: TrustpilotSummary | null;
};

export function CasinoCard({ casino, rank, bestPromos, trustpilotSummary }: CasinoCardProps) {
  const affiliateLink = getConfiguredAffiliateLink(casino.slug);
  const promos = bestPromos ?? getBestPromoCodesForCasino(casino.slug);
  const topPromo = promos[0]
    ? {
        ...promos[0],
        source: "Reviewed offer",
        sourceId: undefined,
        sourceSiteId: undefined
      }
    : undefined;

  return (
    <article className="grid gap-5 rounded-card border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-trust">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div className="flex min-w-0 items-center gap-4">
          <CasinoIcon casinoSlug={casino.slug} text={casino.logoText} iconConfig={casino.logoIcon} />
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {rank ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
                  #{rank}
                </span>
              ) : null}
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-accent-dark">
                Reviewed profile
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-normal text-navy">{casino.name}</h2>
            <p className="text-sm text-muted">{casino.highlights.slice(0, 2).join(" · ")}</p>
          </div>
        </div>
        <div className="rounded-card border border-line bg-gradient-to-br from-slate-50 to-white p-3 md:min-w-48">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-wide text-muted">Rating</span>
            <strong className="text-xl text-navy">{casino.rating.toFixed(1)}/10</strong>
          </div>
          <div className="mt-2">
            <RatingStars ratingOutOf10={casino.rating} label={`${casino.name} PromoGuard rating`} />
          </div>
        </div>
      </div>

      <ul className="grid gap-2 text-sm text-ink sm:grid-cols-3">
        {casino.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <TrustpilotBadge casinoName={casino.name} trustpilot={casino.trustpilot} summary={trustpilotSummary} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact icon={faIdCard} label="Licensing" value={casino.regulator} />
        <Fact icon={faMoneyBillTransfer} label="Payout speed" value={payoutSpeedLabel(casino.payoutSpeed)} />
        <Fact icon={faClock} label="Bonus" value={casino.bonusOverview} />
        <Fact icon={faHeadset} label="Support" value={casino.supportQuality} />
      </div>

      {topPromo ? (
        <div className="grid gap-3 rounded-card border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 md:grid-cols-[220px_1fr] md:items-center">
          <ClickablePromoCodeBadge casinoName={casino.name} casinoSummary={casino.summary} affiliateLink={affiliateLink} promo={topPromo} />
          <p className="m-0 text-sm font-semibold text-amber-950">
            {topPromo.benefitTitle || topPromo.label}. Check the current terms before using it.
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-[minmax(220px,280px)_auto_auto] sm:items-center">
        <AffiliateButton casinoName={casino.name} affiliateLink={affiliateLink} promoCode={topPromo?.code} />
        <Link
          href={`/casinos/${casino.slug}`}
          className="inline-flex min-h-11 items-center justify-center rounded-card border border-line bg-white px-4 py-3 text-sm font-extrabold text-blue-800 transition hover:bg-blue-50 hover:no-underline"
        >
          Review
        </Link>
        <Link
          href={`/casinos/${casino.slug}/promos`}
          className="inline-flex min-h-11 items-center justify-center rounded-card border border-line bg-white px-4 py-3 text-sm font-extrabold text-blue-800 transition hover:bg-blue-50 hover:no-underline"
        >
          Codes
        </Link>
      </div>

      <p className="m-0 text-xs text-muted">
        Some outbound links are partner links. Rankings should stay driven by safety, terms, and review quality.
      </p>
    </article>
  );
}

function Fact({
  icon,
  label,
  value
}: {
  icon: Parameters<typeof FontAwesomeIcon>[0]["icon"];
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-card border border-line bg-white p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted">
        <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5 text-accent-dark" aria-hidden="true" />
        {label}
      </div>
      <p className="m-0 text-sm font-bold text-navy">{value}</p>
    </div>
  );
}
