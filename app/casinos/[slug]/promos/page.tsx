import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AffiliateButton } from "@/components/AffiliateButton";
import { CasinoLogo } from "@/components/CasinoLogo";
import { PromoCodeCard } from "@/components/PromoCodeCard";
import { SectionHeader } from "@/components/SectionHeader";
import { casinos, getCasinoBySlug } from "@/lib/casino-data";
import { getBestPromoCodesForCasinoWithDb } from "@/lib/promo-code-db";
import { getConfiguredAffiliateLink } from "@/lib/promo-code-service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return casinos.map((casino) => ({ slug: casino.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const casino = getCasinoBySlug(slug);
  return {
    title: casino ? `${casino.name} promo codes` : "Casino promo codes"
  };
}

export default async function CasinoPromosPage({ params }: PageProps) {
  const { slug } = await params;
  const casino = getCasinoBySlug(slug);

  if (!casino) notFound();

  const affiliateLink = getConfiguredAffiliateLink(casino.slug);
  const promos = await getBestPromoCodesForCasinoWithDb(casino.slug);
  const recommendedPromos = promos.filter((promo) => promo.isAffiliateOwned);
  const externalPromos = promos.filter((promo) => !promo.isAffiliateOwned);
  const topPromo = promos[0];

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex gap-5">
            <CasinoLogo text={casino.logoText} iconConfig={casino.logoIcon} size="lg" />
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-accent-dark">Best promo codes</p>
              <h1 className="text-5xl font-black tracking-normal text-navy">{casino.name} Promo Codes</h1>
              <p className="mt-4 max-w-3xl text-lg text-muted">
                Highlighted codes are shown first. Public third-party codes can be useful, but always compare the current terms on the casino site before using one.
              </p>
            </div>
          </div>
          <aside className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-trust">
            <AffiliateButton casinoName={casino.name} affiliateLink={affiliateLink} promoCode={topPromo?.code} />
            <Link href={`/casinos/${casino.slug}`} className="text-center text-sm font-extrabold text-blue-800">
              Read full {casino.name} review
            </Link>
          </aside>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8">
          {promos.length ? (
            <>
              {recommendedPromos.length ? (
                <section>
                  <SectionHeader eyebrow="Recommended first" title="Highlighted codes to check first" />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recommendedPromos.map((promo) => (
                      <PromoCodeCard key={promo.id} casinoName={casino.name} affiliateLink={affiliateLink} promo={promo} />
                    ))}
                  </div>
                </section>
              ) : null}

              {externalPromos.length ? (
                <section>
                  <SectionHeader eyebrow="Additional public codes" title="Third-party promo codes users can try" />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {externalPromos.map((promo) => (
                      <PromoCodeCard key={promo.id} casinoName={casino.name} affiliateLink={affiliateLink} promo={promo} />
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : (
            <div className="rounded-card border border-dashed border-line bg-white p-8 text-center text-muted">
              No exclusive or external promo codes are available for {casino.name} right now. Add your own codes in <code>config/affiliateConfig.ts</code> or let the researcher store verified external codes.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
