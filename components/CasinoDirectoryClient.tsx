"use client";

import { useMemo, useState } from "react";
import type { Casino } from "@/lib/types";
import { speedRank } from "@/lib/format";
import { CasinoCard } from "@/components/CasinoCard";
import type { DisplayPromoCode, TrustpilotSummary } from "@/lib/types";

type SortMode = "highest-rated" | "best-trustpilot" | "best-bonus" | "fastest-payout";

export function CasinoDirectoryClient({
  casinos,
  promoCodesByCasinoSlug = {},
  trustpilotByCasinoSlug = {}
}: {
  casinos: Casino[];
  promoCodesByCasinoSlug?: Record<string, DisplayPromoCode[]>;
  trustpilotByCasinoSlug?: Record<string, TrustpilotSummary | null>;
}) {
  const [minimumRating, setMinimumRating] = useState("0");
  const [payoutSpeed, setPayoutSpeed] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("highest-rated");

  const filteredCasinos = useMemo(() => {
    const minRating = Number(minimumRating);
    const visible = casinos.filter((casino) => {
      const ratingMatch = casino.rating >= minRating;
      const payoutMatch = payoutSpeed === "all" || casino.payoutSpeed === payoutSpeed;
      return ratingMatch && payoutMatch;
    });

    return visible.sort((a, b) => {
      if (sortMode === "fastest-payout") return speedRank(b.payoutSpeed) - speedRank(a.payoutSpeed);
      if (sortMode === "best-bonus") return a.bonusOverview.localeCompare(b.bonusOverview);
      if (sortMode === "best-trustpilot") return b.trustpilot.score.localeCompare(a.trustpilot.score);
      return b.rating - a.rating;
    });
  }, [casinos, minimumRating, payoutSpeed, sortMode]);

  return (
    <div className="grid gap-6">
      <div className="rounded-card border border-line bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="m-0 text-xs font-black uppercase tracking-wide text-accent-dark">Filters</p>
            <h2 className="m-0 text-lg font-black text-navy">Tune the comparison</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
            {filteredCasinos.length} visible
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-navy">
          Minimum rating
          <select className="min-h-11 rounded-card border border-line bg-white px-3 py-2 font-normal" value={minimumRating} onChange={(event) => setMinimumRating(event.target.value)}>
            <option value="0">All ratings</option>
            <option value="8">8.0 and above</option>
            <option value="8.5">8.5 and above</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Payout speed
          <select className="min-h-11 rounded-card border border-line bg-white px-3 py-2 font-normal" value={payoutSpeed} onChange={(event) => setPayoutSpeed(event.target.value)}>
            <option value="all">All payout speeds</option>
            <option value="instant">Instant</option>
            <option value="fast">Fast</option>
            <option value="standard">Standard</option>
            <option value="manual-review">Manual review</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Sort by
          <select className="min-h-11 rounded-card border border-line bg-white px-3 py-2 font-normal" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
            <option value="highest-rated">Highest rated</option>
            <option value="best-trustpilot">Best Trustpilot</option>
            <option value="best-bonus">Best bonus</option>
            <option value="fastest-payout">Fastest payout</option>
          </select>
        </label>
        </div>
      </div>

      {filteredCasinos.length ? (
        <div className="grid gap-5">
          {filteredCasinos.map((casino, index) => (
            <CasinoCard
              key={casino.id}
              casino={casino}
              rank={index + 1}
              bestPromos={promoCodesByCasinoSlug[casino.slug] || []}
              trustpilotSummary={trustpilotByCasinoSlug[casino.slug] || null}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-line bg-white p-8 text-center text-muted">
          No casinos match those filters yet. Lower the rating filter or add more verified casino data.
        </div>
      )}
    </div>
  );
}
