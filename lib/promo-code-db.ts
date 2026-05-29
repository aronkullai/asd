import { getAffiliatePromoCodesForCasino, getStaticExternalPromoCodesForCasino, externalToDisplayPromo, rankPromoCodes } from "@/lib/promo-code-service";
import { prisma } from "@/lib/prisma";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

export async function getBestPromoCodesForCasinoWithDb(slug: string) {
  const affiliateCodes = getAffiliatePromoCodesForCasino(slug);
  const staticExternalCodes = getStaticExternalPromoCodesForCasino(slug);
  const dbExternalCodes = hasUsableDatabaseUrl()
    ? await prisma.promoCode.findMany({
        where: {
          casinoSlug: slug,
          isActive: true,
          isAffiliateOwned: false
        }
      })
    : [];

  return rankPromoCodes([
    ...affiliateCodes,
    ...staticExternalCodes,
    ...dbExternalCodes.map((promo) =>
      externalToDisplayPromo({
        id: promo.id,
        casinoSlug: promo.casinoSlug,
        code: promo.code,
        label: promo.label,
        description: promo.description || undefined,
        conditions: promo.conditions || undefined,
        source: promo.source,
        sourceId: promo.sourceId,
        estimatedValue: promo.estimatedValue || undefined,
        priority: promo.priority,
        validUntil: promo.validUntil?.toISOString() || null,
        isActive: promo.isActive,
        lastCheckedAt: promo.lastCheckedAt.toISOString(),
        lastUpdatedAt: promo.lastUpdatedAt.toISOString()
      })
    )
  ]);
}
