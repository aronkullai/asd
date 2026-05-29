import type { Metadata } from "next";
import { PromoCodeExplorer } from "@/components/PromoCodeExplorer";
import { casinos } from "@/lib/casino-data";
import { getBestPromoCodesForCasinoWithDb } from "@/lib/promo-code-db";
import { getConfiguredAffiliateLink } from "@/lib/promo-code-service";

export const metadata: Metadata = {
  title: "Promo codes"
};

export const dynamic = "force-dynamic";

export default async function PromosPage() {
  const groups = await Promise.all(
    casinos.map(async (casino) => ({
      casino,
      promos: await getBestPromoCodesForCasinoWithDb(casino.slug),
      affiliateLink: getConfiguredAffiliateLink(casino.slug)
    }))
  );

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-gradient-to-br from-white via-slate-50 to-emerald-50 py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <PromoCodeExplorer groups={groups} />
        </div>
      </section>
    </main>
  );
}
