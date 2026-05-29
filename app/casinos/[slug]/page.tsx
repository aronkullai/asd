import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { AffiliateButton } from "@/components/AffiliateButton";
import { CasinoLogo } from "@/components/CasinoLogo";
import { PromoCodeBadge } from "@/components/PromoCodeBadge";
import { RatingStars } from "@/components/RatingStars";
import { ReviewList } from "@/components/ReviewList";
import { TrustpilotReviewList } from "@/components/TrustpilotReviewList";
import { TrustpilotBadge } from "@/components/TrustpilotBadge";
import { casinos, getCasinoBySlug, getReviewsForCasino } from "@/lib/casino-data";
import { formatDate, payoutSpeedLabel } from "@/lib/format";
import { getBestPromoCodesForCasinoWithDb } from "@/lib/promo-code-db";
import { getConfiguredAffiliateLink } from "@/lib/promo-code-service";
import { getCachedBusinessUnitSummary, getCachedLatestReviews } from "@/lib/trustpilot";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return casinos.map((casino) => ({ slug: casino.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const casino = getCasinoBySlug(slug);
  return {
    title: casino ? `${casino.name} review` : "Casino review"
  };
}

export default async function CasinoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const casino = getCasinoBySlug(slug);

  if (!casino) notFound();

  const promos = await getBestPromoCodesForCasinoWithDb(casino.slug);
  const affiliateLink = getConfiguredAffiliateLink(casino.slug);
  const topPromo = promos[0];
  const internalReviews = getReviewsForCasino(casino.slug);
  const trustpilotSummary = await getCachedBusinessUnitSummary(casino.slug);
  const trustpilotReviews = await getCachedLatestReviews(casino.slug, 5);

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-12">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <CasinoLogo text={casino.logoText} iconConfig={casino.logoIcon} size="lg" />
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
            {topPromo ? (
              <div>
                <p className="mb-2 text-sm font-black uppercase tracking-wide text-muted">Best promo code</p>
                <PromoCodeBadge code={topPromo.code} />
                <p className="mt-2 text-sm text-muted">Click our link first, then enter this code during sign-up.</p>
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
              {promos.length ? promos.map((promo) => (
                <div key={promo.id} className="grid gap-4 rounded-card border border-line bg-white p-5 md:grid-cols-[220px_1fr_auto] md:items-center">
                  <PromoCodeBadge code={promo.code} />
                  <div>
                    <p className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${promo.isAffiliateOwned ? "bg-emerald-100 text-emerald-900" : "bg-blue-100 text-blue-900"}`}>
                      {promo.isAffiliateOwned ? "Highlighted code" : "Public third-party code"}
                    </p>
                    <h3 className="font-black text-navy">{promo.label}</h3>
                    <p className="m-0 text-sm text-muted">{promo.description || promo.conditions || "Conditions pending verification"}</p>
                    <p className="mt-2 text-xs font-bold text-muted">Last checked: {promo.lastCheckedAt ? formatDate(promo.lastCheckedAt) : "Manual config"}</p>
                  </div>
                  <AffiliateButton casinoName={casino.name} affiliateLink={affiliateLink} promoCode={promo.code} label="View offer" />
                </div>
              )) : (
                <div className="rounded-card border border-dashed border-line bg-soft p-5 text-muted">
                  No exclusive or external promo codes are available right now.
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
              <List title="Security notes" items={casino.securityNotes} positive />
            </div>
          </Section>

          <Section id="support" title="Support & user experience">
            <div className="grid gap-4 md:grid-cols-2">
              <Fact label="Support quality" value={casino.supportQuality} />
              <List title="Support notes" items={casino.supportNotes} positive />
            </div>
          </Section>

          <Section id="trustpilot-reviews" title="What players say on Trustpilot">
            <TrustpilotReviewList reviews={trustpilotReviews} profileUrl={trustpilotSummary?.profileUrl} />
          </Section>

          <Section id="reviews" title="PromoGuard user reviews">
            <ReviewList reviews={internalReviews} />
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
