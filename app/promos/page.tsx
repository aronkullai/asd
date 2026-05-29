import type { Metadata } from "next";
import { NoCodeOfferCard } from "@/components/NoCodeOfferCard";
import { PromoCodeExplorer } from "@/components/PromoCodeExplorer";
import { noCodeOffers } from "@/config/noCodeOffers";
import { getCasinosWithDbOverrides } from "@/lib/casino-service";
import { getBestPromoCodesForCasinoWithDb } from "@/lib/promo-code-db";
import { getConfiguredAffiliateLink } from "@/lib/promo-code-service";
import type { DisplayPromoCode } from "@/lib/types";

export const metadata: Metadata = {
  title: "Promo codes"
};

export const dynamic = "force-dynamic";

function toPublicPromo(promo: DisplayPromoCode): DisplayPromoCode {
  return {
    ...promo,
    source: "Reviewed offer",
    sourceId: undefined,
    sourceSiteId: undefined
  };
}

function toPublicNoCodeOffer(offer: (typeof noCodeOffers)[number]) {
  const { source: _source, sourceUrl: _sourceUrl, ...publicOffer } = offer;
  return publicOffer;
}

export default async function PromosPage() {
  const casinoList = await getCasinosWithDbOverrides();
  const groups = await Promise.all(
    casinoList.map(async (casino) => ({
      casino: { ...casino, fetchMetadata: { ...casino.fetchMetadata, sourceUrl: "" } },
      promos: (await getBestPromoCodesForCasinoWithDb(casino.slug)).map(toPublicPromo),
      affiliateLink: getConfiguredAffiliateLink(casino.slug)
    }))
  );
  const activeNoCodeOffers = noCodeOffers
    .filter((offer) => offer.isActive !== false)
    .map((offer) => {
      const group = groups.find((item) => item.casino.slug === offer.casinoSlug);
      return group ? { offer: toPublicNoCodeOffer(offer), casino: group.casino, affiliateLink: group.affiliateLink } : null;
    })
    .filter(Boolean)
    .sort((a, b) => ((b?.offer.priority ?? 0) - (a?.offer.priority ?? 0)));

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-gradient-to-br from-white via-slate-50 to-emerald-50 py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <PromoCodeExplorer groups={groups} />
          {activeNoCodeOffers.length ? (
            <section className="mt-8 rounded-card border border-line bg-white p-5 shadow-sm">
              <div className="mb-5">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-accent-dark">No-code offers</p>
                <h2 className="text-2xl font-black text-navy">Tournaments, raffles, cashback, and rewards</h2>
                <p className="mt-2 text-sm text-muted">These are active offer paths where a static promo code is not the best source of truth.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeNoCodeOffers.map((item) =>
                  item ? <NoCodeOfferCard key={`${item.casino.slug}-${item.offer.label}`} casinoName={item.casino.name} affiliateLink={item.affiliateLink} offer={item.offer} /> : null
                )}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
