import { getAffiliateConfigBySlug } from "@/config/affiliateConfig";
import { externalPromoCodes } from "@/lib/external-promo-data";
import { isPlaceholder, normalizeExternalUrl } from "@/lib/format";
import type { DisplayPromoCode, ExternalPromoCode } from "@/lib/types";

export function getConfiguredAffiliateLink(slug: string) {
  const config = getAffiliateConfigBySlug(slug);

  return normalizeExternalUrl(config?.affiliateLink);
}

export function getAffiliatePromoCodesForCasino(slug: string): DisplayPromoCode[] {
  void slug;
  return [];
}

export function getStaticExternalPromoCodesForCasino(slug: string): DisplayPromoCode[] {
  return externalPromoCodes
    .filter((promo) => promo.casinoSlug === slug && promo.code.trim().length > 0 && !isPlaceholder(promo.code))
    .map(externalToDisplayPromo);
}

export function rankPromoCodes(promos: DisplayPromoCode[]) {
  return [...promos].sort((a, b) => {
    if (a.isAffiliateOwned !== b.isAffiliateOwned) return a.isAffiliateOwned ? -1 : 1;
    if ((b.priority ?? 0) !== (a.priority ?? 0)) return (b.priority ?? 0) - (a.priority ?? 0);
    const bDate = b.lastUpdatedAt ? Date.parse(b.lastUpdatedAt) : 0;
    const aDate = a.lastUpdatedAt ? Date.parse(a.lastUpdatedAt) : 0;
    return bDate - aDate;
  });
}

export function getBestPromoCodesForCasino(slug: string) {
  return rankPromoCodes([
    ...getAffiliatePromoCodesForCasino(slug),
    ...getStaticExternalPromoCodesForCasino(slug)
  ]);
}

export function externalToDisplayPromo(promo: ExternalPromoCode): DisplayPromoCode {
  return {
    id: promo.id,
    casinoSlug: promo.casinoSlug,
    code: promo.code,
    label: promo.label,
    benefit: promo.benefit || promo.description || promo.label,
    benefitTitle: promo.benefitTitle || promo.label,
    benefitDescription: promo.benefitDescription || promo.description || null,
    bonusType: promo.bonusType || null,
    minDeposit: promo.minDeposit ?? null,
    wageringRequirements: promo.wageringRequirements || promo.conditions || null,
    description: promo.description,
    conditions: promo.conditions,
    source: promo.source,
    sourceId: promo.sourceId,
    sourceSiteId: promo.sourceSiteId,
    isAffiliateOwned: Boolean(promo.isAffiliateOwned),
    priority: promo.priority ?? 0,
    estimatedValue: promo.estimatedValue,
    validFrom: promo.validFrom ?? null,
    validUntil: promo.validUntil ?? null,
    maxUses: promo.maxUses ?? null,
    usesSoFar: promo.usesSoFar ?? 0,
    region: promo.region ?? null,
    isVerified: promo.isVerified ?? false,
    isActive: promo.isActive ?? true,
    lastCheckedAt: promo.lastCheckedAt,
    lastUpdatedAt: promo.lastUpdatedAt
  };
}
