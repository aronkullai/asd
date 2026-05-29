"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCheckCircle,
  faClipboard,
  faClock,
  faGaugeHigh,
  faMagnifyingGlass,
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { AffiliateButton } from "@/components/AffiliateButton";
import { CasinoIcon } from "@/components/CasinoIcon";
import { PromoRegistrationModal } from "@/components/PromoRegistrationModal";
import { trackPromoCodeClick } from "@/lib/analytics";
import type { Casino, DisplayPromoCode } from "@/lib/types";

type PromoGroup = {
  casino: Casino;
  promos: DisplayPromoCode[];
  affiliateLink: string | null;
};

type PromoCodeExplorerProps = {
  groups: PromoGroup[];
};

type FilterMode = "all" | "top" | "recent" | "needs-check";

function formatDate(value?: string | null) {
  if (!value) return "Manual review";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function daysSince(value?: string | null) {
  if (!value) return 90;
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return 90;
  return Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
}

function expiresSoon(value?: string | null) {
  if (!value) return false;
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return false;
  const days = Math.ceil((timestamp - Date.now()) / 86_400_000);
  return days >= 0 && days <= 14;
}

function getConfidence(promo: DisplayPromoCode) {
  const agePenalty = Math.min(35, daysSince(promo.lastCheckedAt) * 2);
  const sourceBonus = promo.isAffiliateOwned ? 10 : 0;
  const priorityBonus = Math.min(10, promo.priority ?? 0);
  const activePenalty = promo.isActive === false ? 45 : 0;

  return Math.max(20, Math.min(98, 86 + sourceBonus + priorityBonus - agePenalty - activePenalty));
}

function getPromoValue(promo: DisplayPromoCode) {
  if (promo.estimatedValue) return `${promo.estimatedValue}% value`;
  const text = `${promo.label} ${promo.description || ""}`;
  const percent = text.match(/\b\d{1,3}%\b/);
  if (percent) return percent[0];
  const money = text.match(/\$\d+[A-Z]?/i);
  if (money) return money[0];
  if (/free spin/i.test(text)) return "Free spins";
  if (/cashback/i.test(text)) return "Cashback";
  return "Offer";
}

export function PromoCodeExplorer({ groups }: PromoCodeExplorerProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<FilterMode>("all");

  const offers = useMemo(
    () =>
      groups.flatMap((group) =>
        group.promos.map((promo) => ({
          casino: group.casino,
          affiliateLink: group.affiliateLink,
          promo,
          confidence: getConfidence(promo)
        }))
      ),
    [groups]
  );

  const filteredOffers = useMemo(() => {
    const search = query.trim().toLowerCase();

    return offers
      .filter(({ casino, promo, confidence }) => {
        const matchesSearch = !search || [casino.name, casino.slug, promo.code, promo.label, promo.description, promo.benefitTitle, promo.bonusType]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));
        const matchesMode =
          mode === "all" ||
          (mode === "top" && confidence >= 80) ||
          (mode === "recent" && daysSince(promo.lastCheckedAt) <= 7) ||
          (mode === "needs-check" && confidence < 70);

        return matchesSearch && matchesMode;
      })
      .sort((a, b) => b.confidence - a.confidence || (b.promo.priority ?? 0) - (a.promo.priority ?? 0));
  }, [mode, offers, query]);

  const visibleGroups = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return groups;

    return groups.filter((group) => group.casino.name.toLowerCase().includes(search) || group.casino.slug.includes(search));
  }, [groups, query]);

  const latestCheckedAt = offers
    .map(({ promo }) => promo.lastCheckedAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  const averageConfidence = offers.length
    ? Math.round(offers.reduce((total, offer) => total + offer.confidence, 0) / offers.length)
    : 0;

  return (
    <div className="grid gap-8">
      <section className="rounded-card border border-line bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-accent-dark">Offer intelligence</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-normal text-navy md:text-5xl">
              Source-checked casino codes with clear bonus details
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Search casinos, copy source-checked codes, and open the offer page only after the current terms look clean.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Metric label="Casinos tracked" value={String(groups.length)} />
            <Metric label="Active codes" value={String(offers.length)} />
            <Metric label="Avg freshness" value={offers.length ? `${averageConfidence}%` : "Pending"} />
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <label className="relative block">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <span className="sr-only">Search casino codes</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by casino, code, bonus type, or offer"
              className="min-h-12 w-full rounded-card border border-line bg-soft py-3 pl-11 pr-4 text-base text-ink outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
            />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <FilterButton label="All" active={mode === "all"} onClick={() => setMode("all")} />
            <FilterButton label="Top" active={mode === "top"} onClick={() => setMode("top")} />
            <FilterButton label="Recent" active={mode === "recent"} onClick={() => setMode("recent")} />
            <FilterButton label="Needs check" active={mode === "needs-check"} onClick={() => setMode("needs-check")} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="m-0 text-xs font-black uppercase tracking-wide text-accent-dark">Source-checked codes</p>
              <h2 className="m-0 text-2xl font-black text-navy">
                {filteredOffers.length ? `${filteredOffers.length} code${filteredOffers.length === 1 ? "" : "s"} found` : "No matching codes yet"}
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              Last checked: {formatDate(latestCheckedAt)}
            </span>
          </div>

          {filteredOffers.length ? (
            filteredOffers.map((offer, index) => (
              <OfferCard key={`${offer.casino.slug}-${offer.promo.id}`} offer={offer} rank={index + 1} />
            ))
          ) : (
            <EmptyCodes groups={visibleGroups} />
          )}
        </div>

        <aside className="grid gap-4">
          <section className="rounded-card border border-line bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-accent-dark">Casino directory</p>
            <h2 className="mb-4 text-xl font-black text-navy">Tracked offer pages</h2>
            <div className="grid gap-3">
              {visibleGroups.map((group) => {
                const groupAverage = group.promos.length
                  ? Math.round(group.promos.reduce((total, promo) => total + getConfidence(promo), 0) / group.promos.length)
                  : 0;

                return (
                  <Link
                    key={group.casino.slug}
                    href={`/casinos/${group.casino.slug}/promos`}
                    className="grid gap-3 rounded-card border border-line bg-soft p-3 hover:border-slate-300 hover:bg-white hover:no-underline"
                  >
                    <div className="flex items-center gap-3">
                      <CasinoIcon casinoSlug={group.casino.slug} text={group.casino.logoText} iconConfig={group.casino.logoIcon} size="sm" />
                      <div>
                        <strong className="block text-navy">{group.casino.name}</strong>
                        <span className="text-xs text-muted">
                          {group.promos.length} code{group.promos.length === 1 ? "" : "s"} tracked
                        </span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <span
                        className="block h-full rounded-full bg-accent"
                        style={{ width: `${groupAverage || 18}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-card border border-line bg-navy p-5 text-white shadow-sm">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-emerald-200">Evidence model</p>
            <h2 className="text-xl font-black">What freshness means</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-200">
              <EvidenceRow icon={faShieldHalved} title="Source checked" body="Public pages show only codes that have been marked reviewed, active, and source-labeled." />
              <EvidenceRow icon={faClock} title="Freshness" body="Recent checks score higher. Old codes drift into needs-check." />
              <EvidenceRow icon={faGaugeHigh} title="Priority" body="Higher-value and recently checked offers appear first." />
            </div>
          </section>
        </aside>
      </section>

      {offers.length ? (
        <section className="rounded-card border border-line bg-white p-5 shadow-sm">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-accent-dark">Activity</p>
          <h2 className="mb-4 text-2xl font-black text-navy">Latest code signals</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {offers.slice(0, 6).map(({ casino, promo, confidence }) => (
              <div key={`activity-${casino.slug}-${promo.id}`} className="rounded-card border border-line bg-soft p-4">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-accent-dark">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-3.5 w-3.5" aria-hidden="true" />
                  {confidence >= 80 ? "Recently checked" : "Needs review"}
                </span>
                <p className="mt-2 font-black text-navy">{promo.code}</p>
                <p className="m-0 text-sm text-muted">
                  {casino.name} - {promo.bonusType || "Offer"} - {formatDate(promo.lastCheckedAt)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-soft p-4">
      <p className="m-0 text-xs font-black uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-navy">{value}</p>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-card border px-3 py-2 text-sm font-extrabold transition ${
        active ? "border-accent bg-emerald-50 text-accent-dark" : "border-line bg-white text-blue-800 hover:bg-blue-50"
      }`}
    >
      {label}
    </button>
  );
}

function OfferCard({
  offer,
  rank
}: {
  offer: { casino: Casino; affiliateLink: string | null; promo: DisplayPromoCode; confidence: number };
  rank: number;
}) {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { casino, affiliateLink, promo, confidence } = offer;

  async function copyAndPrompt() {
    trackPromoCodeClick({ casinoName: casino.name, casinoSlug: casino.slug, promoCode: promo.code, source: "promo-explorer-card" });
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
    <article className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-sm md:grid-cols-[1fr_220px] md:items-center">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <CasinoIcon casinoSlug={casino.slug} text={casino.logoText} iconConfig={casino.logoIcon} size="sm" />
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">#{rank}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-black ${confidence >= 80 ? "bg-emerald-50 text-accent-dark" : "bg-amber-50 text-amber-900"}`}>
                  {confidence}% confidence
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-900">
                  Source checked
                </span>
                {expiresSoon(promo.validUntil) ? (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-900">
                    Expires soon
                  </span>
                ) : null}
              </div>
              <h3 className="text-xl font-black text-navy">{casino.name}</h3>
              <p className="m-0 text-sm text-muted">{promo.benefitDescription || promo.description || promo.label}</p>
            </div>
          </div>
          <strong className="text-2xl text-navy">{getPromoValue(promo)}</strong>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Fact label="Last checked" value={formatDate(promo.lastCheckedAt)} />
          <Fact label="Bonus type" value={promo.bonusType || "Offer"} />
          <Fact label="Expires" value={promo.validUntil ? formatDate(promo.validUntil) : "No expiry listed"} />
        </div>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={copyAndPrompt}
          className="rounded-card border border-dashed border-amber-500 bg-amber-50 p-3 text-center transition hover:-translate-y-0.5 hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-300/30 dark:bg-amber-400/10 dark:hover:bg-amber-400/20"
        >
          <p className="m-0 text-xs font-black uppercase tracking-wide text-amber-900">Promo code</p>
          <p className="mt-1 text-2xl font-black text-amber-950 dark:text-amber-100">{promo.code}</p>
          <p className="mt-1 text-xs font-bold text-amber-900 dark:text-amber-200">{copied ? "Copied. Registration details opened." : "Click to copy"}</p>
        </button>
        <button
          type="button"
          onClick={copyAndPrompt}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-card bg-navy px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
        >
          <FontAwesomeIcon icon={faClipboard} className="h-4 w-4" aria-hidden="true" />
          {copied ? "Copied" : "Copy code"}
        </button>
        <AffiliateButton casinoName={casino.name} casinoSlug={casino.slug} affiliateLink={affiliateLink} promoCode={promo.code} source="promo-explorer-card" label="Open site only" />
        <Link
          href={`/casinos/${casino.slug}/promos`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-card border border-line bg-white px-4 py-3 text-sm font-extrabold text-blue-800 transition hover:bg-blue-50 hover:no-underline"
        >
          Details
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <PromoRegistrationModal
          affiliateLink={affiliateLink}
          casinoName={casino.name}
          casinoSlug={casino.slug}
          casinoSummary={casino.summary}
          copied={copied}
          onClose={() => setModalOpen(false)}
          open={modalOpen}
          promo={promo}
        />
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-soft p-3">
      <p className="m-0 text-xs font-black uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-bold text-navy">{value}</p>
    </div>
  );
}

function EvidenceRow({ icon, title, body }: { icon: Parameters<typeof FontAwesomeIcon>[0]["icon"]; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-card bg-white/10 text-emerald-200">
        <FontAwesomeIcon icon={icon} className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <strong className="block text-white">{title}</strong>
        <span>{body}</span>
      </div>
    </div>
  );
}

function EmptyCodes({ groups }: { groups: PromoGroup[] }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-white p-6">
      <h3 className="text-xl font-black text-navy">No codes match this view yet</h3>
      <p className="mt-2 text-muted">
        Use the admin finder to scan approved promo pages, or open a casino profile while new codes are being reviewed.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {groups.slice(0, 4).map((group) => (
          <Link
            key={group.casino.slug}
            href={`/casinos/${group.casino.slug}`}
            className="flex items-center gap-3 rounded-card border border-line bg-soft p-3 hover:bg-white hover:no-underline"
          >
            <CasinoIcon casinoSlug={group.casino.slug} text={group.casino.logoText} iconConfig={group.casino.logoIcon} size="sm" />
            <div>
              <strong className="block text-navy">{group.casino.name}</strong>
              <span className="text-sm text-muted">Review profile</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
