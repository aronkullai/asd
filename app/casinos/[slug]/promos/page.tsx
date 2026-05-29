import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AffiliateButton } from "@/components/AffiliateButton";
import { CasinoIcon } from "@/components/CasinoIcon";
import { HowToUseCode } from "@/components/HowToUseCode";
import { NoCodeOfferCard } from "@/components/NoCodeOfferCard";
import { PartnerBonusNote } from "@/components/PartnerBonusNote";
import { PromoCodeCard } from "@/components/PromoCodeCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getCodeUseGuide } from "@/config/howToUseCodes";
import { getNoCodeOffersForCasino } from "@/config/noCodeOffers";
import { getPartnerRegistrationBonus } from "@/config/partnerRegistrationBonuses";
import { casinos, getCasinoBySlug } from "@/lib/casino-data";
import { getCasinoWithDbOverrides } from "@/lib/casino-service";
import { getBestPromoCodesForCasinoWithDb } from "@/lib/promo-code-db";
import { getConfiguredAffiliateLink } from "@/lib/promo-code-service";
import type { DisplayPromoCode } from "@/lib/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return casinos.map((casino) => ({ slug: casino.slug }));
}

function toPublicPromo(promo: DisplayPromoCode): DisplayPromoCode {
  return {
    ...promo,
    source: "Reviewed offer",
    sourceId: undefined,
    sourceSiteId: undefined
  };
}

function toPublicNoCodeOffer(offer: ReturnType<typeof getNoCodeOffersForCasino>[number]) {
  const { source: _source, sourceUrl: _sourceUrl, ...publicOffer } = offer;
  return publicOffer;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const casino = await getCasinoWithDbOverrides(slug);
  return {
    title: casino ? `${casino.name} promo codes` : "Casino promo codes"
  };
}

export default async function CasinoPromosPage({ params }: PageProps) {
  const { slug } = await params;
  const casino = getCasinoBySlug(slug);

  if (!casino) notFound();

  const affiliateLink = getConfiguredAffiliateLink(casino.slug);
  const promos = (await getBestPromoCodesForCasinoWithDb(casino.slug)).map(toPublicPromo);
  const recommendedPromos = promos.filter((promo) => promo.isAffiliateOwned);
  const externalPromos = promos.filter((promo) => !promo.isAffiliateOwned);
  const noCodeOffers = getNoCodeOffersForCasino(casino.slug).map(toPublicNoCodeOffer);
  const codeGuide = getCodeUseGuide(casino.slug);
  const partnerBonus = getPartnerRegistrationBonus(casino.slug);
  const topPromo = promos[0];

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex gap-5">
            <CasinoIcon casinoSlug={casino.slug} text={casino.logoText} iconConfig={casino.logoIcon} size="lg" />
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-accent-dark">Best promo codes</p>
              <h1 className="text-5xl font-black tracking-normal text-navy">{casino.name} Promo Codes</h1>
              <p className="mt-4 max-w-3xl text-lg text-muted">
                Codes and no-code offers are shown only after source review. Always compare the current terms on the casino site before using one.
              </p>
            </div>
          </div>
          <aside className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-trust">
            <AffiliateButton casinoName={casino.name} affiliateLink={affiliateLink} promoCode={topPromo?.code} />
            <PartnerBonusNote bonus={partnerBonus} />
            <Link href={`/casinos/${casino.slug}`} className="text-center text-sm font-extrabold text-blue-800">
              Read full {casino.name} review
            </Link>
          </aside>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8">
          <HowToUseCode guide={codeGuide} />
          {promos.length ? (
            <>
              {recommendedPromos.length ? (
                <section>
                  <SectionHeader eyebrow="Recommended" title="Partner offers to check first" />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recommendedPromos.map((promo) => (
                      <PromoCodeCard key={promo.id} casinoName={casino.name} casinoSummary={casino.summary} affiliateLink={affiliateLink} promo={promo} />
                    ))}
                  </div>
                </section>
              ) : null}

              {externalPromos.length ? (
                <section>
                  <SectionHeader eyebrow="Other available offers" title="Additional source-checked codes" />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {externalPromos.map((promo) => (
                      <PromoCodeCard key={promo.id} casinoName={casino.name} casinoSummary={casino.summary} affiliateLink={affiliateLink} promo={promo} />
                    ))}
                  </div>
                </section>
              ) : null}

              {noCodeOffers.length ? (
                <section>
                  <SectionHeader eyebrow="No-code offers" title="Tournaments, raffles, cashback, and rewards" />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {noCodeOffers.map((offer) => (
                      <NoCodeOfferCard key={`${casino.slug}-${offer.label}`} casinoName={casino.name} affiliateLink={affiliateLink} offer={offer} />
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : (
            <>
              {noCodeOffers.length ? (
                <section>
                  <SectionHeader eyebrow="No-code offers" title="Tournaments, raffles, cashback, and rewards" />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {noCodeOffers.map((offer) => (
                      <NoCodeOfferCard key={`${casino.slug}-${offer.label}`} casinoName={casino.name} affiliateLink={affiliateLink} offer={offer} />
                    ))}
                  </div>
                </section>
              ) : (
                <div className="rounded-card border border-dashed border-line bg-white p-8 text-center text-muted">
                  No source-checked codes or no-code promotions are available for {casino.name} right now.
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
