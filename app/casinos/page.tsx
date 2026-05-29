import type { Metadata } from "next";
import { CasinoDirectoryClient } from "@/components/CasinoDirectoryClient";
import { SectionHeader } from "@/components/SectionHeader";
import { casinos } from "@/lib/casino-data";
import { getBestPromoCodesForCasinoWithDb } from "@/lib/promo-code-db";
import { getCachedBusinessUnitSummary } from "@/lib/trustpilot";

export const metadata: Metadata = {
  title: "Casino reviews"
};

export default async function CasinosPage() {
  const promoEntries = await Promise.all(
    casinos.map(async (casino) => [casino.slug, await getBestPromoCodesForCasinoWithDb(casino.slug)] as const)
  );
  const promoCodesByCasinoSlug = Object.fromEntries(promoEntries);
  const trustpilotEntries = await Promise.all(
    casinos.map(async (casino) => [casino.slug, await getCachedBusinessUnitSummary(casino.slug)] as const)
  );
  const trustpilotByCasinoSlug = Object.fromEntries(trustpilotEntries);

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader
            eyebrow="Top casinos"
            title="Compare casino safety, payouts, and offers"
            description="Every casino card shows review signals, offer codes, Trustpilot placeholders, licensing fields, and key facts. Replace placeholders with verified data before launch."
          />
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <CasinoDirectoryClient
            casinos={casinos}
            promoCodesByCasinoSlug={promoCodesByCasinoSlug}
            trustpilotByCasinoSlug={trustpilotByCasinoSlug}
          />
          <div className="mt-8 rounded-card border border-line bg-white p-5 text-sm text-muted">
            <strong className="text-navy">How rankings are determined:</strong> PromoGuard rankings combine editorial review criteria, licensing checks, payout information, bonus terms, support quality, and Trustpilot data. Affiliate partnerships may influence which casinos are listed, but they should not override safety or transparency standards.
          </div>
        </div>
      </section>
    </main>
  );
}
