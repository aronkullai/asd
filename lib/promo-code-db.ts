import { externalToDisplayPromo, rankPromoCodes } from "@/lib/promo-code-service";
import { prisma } from "@/lib/prisma";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

export async function getBestPromoCodesForCasinoWithDb(slug: string) {
  const now = new Date();
  const dbExternalCodes = hasUsableDatabaseUrl()
    ? await prisma.promoCode.findMany({
        where: {
          casinoSlug: slug,
          isVerified: true,
          isActive: true,
          OR: [{ validFrom: null }, { validFrom: { lte: now } }],
          AND: [{ OR: [{ validUntil: null }, { validUntil: { gte: now } }] }]
        }
      })
    : [];

  return rankPromoCodes(
    dbExternalCodes.map((promo) =>
      externalToDisplayPromo({
        id: promo.id,
        casinoSlug: promo.casinoSlug,
        code: promo.code,
        label: promo.label,
        benefit: promo.benefit,
        benefitTitle: promo.benefitTitle || promo.label,
        benefitDescription: promo.benefitDescription,
        bonusType: promo.bonusType,
        minDeposit: promo.minDeposit,
        wageringRequirements: promo.wageringRequirements,
        description: promo.description || undefined,
        conditions: promo.conditions || undefined,
        source: promo.source,
        sourceId: promo.sourceId,
        sourceSiteId: promo.sourceSiteId,
        estimatedValue: promo.estimatedValue || undefined,
        priority: promo.priority,
        validFrom: promo.validFrom?.toISOString() || null,
        validUntil: promo.validUntil?.toISOString() || null,
        maxUses: promo.maxUses,
        usesSoFar: promo.usesSoFar,
        region: promo.region,
        isAffiliateOwned: promo.isAffiliateOwned,
        isVerified: promo.isVerified,
        isActive: promo.isActive,
        lastCheckedAt: promo.lastCheckedAt.toISOString(),
        lastUpdatedAt: promo.lastUpdatedAt.toISOString()
      })
    )
  );
}
