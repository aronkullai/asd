import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { AffiliateButton } from "@/components/AffiliateButton";
import { CasinoIcon } from "@/components/CasinoIcon";
import { ClickablePromoCodeBadge } from "@/components/ClickablePromoCodeBadge";
import { HowToUseCode } from "@/components/HowToUseCode";
import { NordVpnReferral } from "@/components/NordVpnReferral";
import { PartnerBonusNote } from "@/components/PartnerBonusNote";
import { PromoCodeCard } from "@/components/PromoCodeCard";
import { RatingStars } from "@/components/RatingStars";
import { ReviewList } from "@/components/ReviewList";
import { UserRatingSection } from "@/components/UserRatingSection";
import { TrustpilotReviewList } from "@/components/TrustpilotReviewList";
import { TrustpilotBadge } from "@/components/TrustpilotBadge";
import { getCodeUseGuide } from "@/config/howToUseCodes";
import { getPartnerRegistrationBonus } from "@/config/partnerRegistrationBonuses";
import { casinos, getCasinoBySlug } from "@/lib/casino-data";
import { getCasinoWithDbOverrides } from "@/lib/casino-service";
import { payoutSpeedLabel } from "@/lib/format";
import { getBestPromoCodesForCasinoWithDb } from "@/lib/promo-code-db";
import { getConfiguredAffiliateLink } from "@/lib/promo-code-service";
import { getPublishedReviewsForCasino } from "@/lib/review-service";
import { getCachedBusinessUnitSummary, getCachedLatestReviews } from "@/lib/trustpilot";
import { getCommunityRatingsForCasino } from "@/lib/user-rating-service";
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const casino = await getCasinoWithDbOverrides(slug);
  return {
    title: casino ? `${casino.name} review` : "Casino review",
    description: casino?.summary,
    alternates: casino ? { canonical: `/casinos/${casino.slug}` } : undefined,
    openGraph: casino
      ? {
          title: `${casino.name} review | PromoGuard`,
          description: casino.summary,
          url: `https://promoguard.bet/casinos/${casino.slug}`
        }
      : undefined
  };
}

export default async function CasinoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const casino = getCasinoBySlug(slug);

  if (!casino) notFound();

  const promos = (await getBestPromoCodesForCasinoWithDb(casino.slug)).map(toPublicPromo);
  const affiliateLink = getConfiguredAffiliateLink(casino.slug);
  const topPromo = promos[0];
  const internalReviews = await getPublishedReviewsForCasino(casino.slug);
  const trustpilotSummary = await getCachedBusinessUnitSummary(casino.slug);
  const trustpilotReviews = await getCachedLatestReviews(casino.slug, 5);
  const communityRatings = await getCommunityRatingsForCasino(casino.slug);
  const codeGuide = getCodeUseGuide(casino.slug);
  const partnerBonus = getPartnerRegistrationBonus(casino.slug);

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-12">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <CasinoIcon casinoSlug={casino.slug} text={casino.logoText} iconConfig={casino.logoIcon} size="lg" />
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-accent-dark">Casino review</p>
                <h1 className="text-5xl font-black tracking-normal text-navy">{casino.name}</h1>
              </div>
            </div>
            <p className="max-w-3xl text-lg text-muted">{casino.summary}</p>
            <div className="flex flex-wrap items-center gap-4">
              <strong className="text-3xl text-navy">{casino.rating.toFixed(1)}/10</strong>
              <RatingStars ratingOutOf10={casino.rating} />
            </div>
          </div>
          <aside className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-trust">
            <AffiliateButton casinoName={casino.name} affiliateLink={affiliateLink} promoCode={topPromo?.code} />
            <PartnerBonusNote bonus={partnerBonus} />
            {topPromo ? (
              <div>
                <p className="mb-2 text-sm font-black uppercase tracking-wide text-muted">Best promo code</p>
                <ClickablePromoCodeBadge casinoName={casino.name} casinoSummary={casino.summary} affiliateLink={affiliateLink} promo={topPromo} />
                <p className="mt-2 text-sm text-muted">Open the offer page, confirm the current terms, then enter this code during sign-up.</p>
              </div>
            ) : (
              <div className="rounded-card border border-dashed border-line bg-soft p-4 text-sm text-muted">
                No promo codes are available for this casino right now.
              </div>
            )}
            <TrustpilotBadge casinoName={casino.name} trustpilot={casino.trustpilot} summary={trustpilotSummary} />
          </aside>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-6">
          <Section id="overview" title="Overview">
            <div className="grid gap-5 md:grid-cols-2">
              <List title="Pros" items={casino.pros} positive />
              <List title="Cons" items={casino.cons} />
            </div>
          </Section>

          <Section id="bonuses" title="Bonuses & promo codes">
            <div className="grid gap-4">
              <HowToUseCode guide={codeGuide} />
              {promos.length ? promos.map((promo) => (
                <PromoCodeCard key={promo.id} casinoName={casino.name} casinoSummary={casino.summary} affiliateLink={affiliateLink} promo={promo} />
              )) : (
                <div className="rounded-card border border-dashed border-line bg-soft p-5 text-muted">
                  No verified promo codes are available right now.
                </div>
              )}
            </div>
          </Section>

          <Section id="payments" title="Payments & payouts">
            <div className="grid gap-4 md:grid-cols-3">
              <Fact label="Payout speed" value={payoutSpeedLabel(casino.payoutSpeed)} />
              <Fact label="Payout summary" value={casino.payoutSummary} />
              <Fact label="Payment methods" value={casino.paymentMethods.join(", ")} />
            </div>
          </Section>

          <Section id="security" title="Security & licensing">
            <div className="grid gap-4 md:grid-cols-2">
              <Fact label="Regulator" value={casino.regulator} />
              <Fact label="License notes" value={casino.licenseInfo || casino.regulator} />
              <Fact label="Area restrictions" value={casino.areaRegulations || "Check local law and the casino's current terms before registering."} />
              <List title="Security notes" items={casino.securityNotes} positive />
              <List title="Safety features" items={casino.safetyFeatures?.length ? casino.safetyFeatures : casino.securityNotes} positive />
            </div>
            <div className="mt-4">
              <NordVpnReferral compact />
            </div>
          </Section>

          <Section id="support" title="Support & user experience">
            <div className="grid gap-4 md:grid-cols-2">
              <Fact label="Support quality" value={casino.supportQuality} />
              <List title="Support channels" items={casino.supportChannels?.length ? casino.supportChannels : casino.supportNotes} positive />
            </div>
          </Section>

          <Section id="trustpilot-reviews" title="What players say on Trustpilot">
            <TrustpilotReviewList reviews={trustpilotReviews} profileUrl={trustpilotSummary?.profileUrl} />
          </Section>

          <Section id="reviews" title="What players say">
            <ReviewList reviews={internalReviews} siteNote={casino.reviewNote} />
          </Section>

          <Section id="community" title="PromoGuard community rating">
            <UserRatingSection casinoSlug={casino.slug} stats={communityRatings} />
          </Section>

          <section className="rounded-card bg-navy p-6 text-white">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-2xl font-black">Want to check the live offer?</h2>
                <p className="m-0 text-slate-200">Open the casino in a new tab and compare the current terms before depositing.</p>
              </div>
              <AffiliateButton casinoName={casino.name} affiliateLink={affiliateLink} promoCode={topPromo?.code} />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-card border border-line bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-black text-navy">{title}</h2>
      {children}
    </section>
  );
}

function List({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div className="rounded-card border border-line bg-soft p-5">
      <h3 className="mb-3 font-black text-navy">{title}</h3>
      <ul className="grid gap-2 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <FontAwesomeIcon icon={positive ? faCircleCheck : faCircleXmark} className={`mt-1 h-4 w-4 shrink-0 ${positive ? "text-accent" : "text-slate-400"}`} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-soft p-5">
      <p className="mb-1 text-xs font-black uppercase tracking-wide text-muted">{label}</p>
      <p className="m-0 font-bold text-navy">{value}</p>
    </div>
  );
}
