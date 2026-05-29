import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPromoManager } from "@/components/AdminPromoManager";
import { SectionHeader } from "@/components/SectionHeader";
import { getCurrentUser } from "@/lib/auth";
import { getCasinosWithDbOverrides } from "@/lib/casino-service";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit promo codes"
};

export const dynamic = "force-dynamic";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

export default async function AdminPromoEditPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const casinos = await getCasinosWithDbOverrides();

  const promos = hasUsableDatabaseUrl()
    ? await prisma.promoCode.findMany({
        orderBy: [{ casinoSlug: "asc" }, { lastUpdatedAt: "desc" }],
        take: 300
      })
    : [];

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader
            eyebrow="Admin"
            title="Edit real promo codes"
            description="Add only manually verified codes from partner dashboards, approved feeds, or sources you have checked yourself. Unverified codes stay hidden from public pages."
          />
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <AdminPromoManager
            casinos={casinos}
            initialPromos={promos.map((promo) => ({
              id: promo.id,
              casinoSlug: promo.casinoSlug,
              code: promo.code,
              label: promo.label,
              benefit: promo.benefit,
              description: promo.description,
              conditions: promo.conditions,
              source: promo.source,
              sourceId: promo.sourceId,
              isAffiliateOwned: promo.isAffiliateOwned,
              isVerified: promo.isVerified,
              isActive: promo.isActive,
              validFrom: promo.validFrom?.toISOString() || null,
              validUntil: promo.validUntil?.toISOString() || null,
              region: promo.region,
              maxUses: promo.maxUses,
              usesSoFar: promo.usesSoFar,
              lastCheckedAt: promo.lastCheckedAt.toISOString()
            }))}
          />
        </div>
      </section>
    </main>
  );
}
