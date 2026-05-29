import { getAffiliateConfigBySlug } from "@/config/affiliateConfig";
import { externalPromoCodes } from "@/lib/external-promo-data";
import { isPlaceholder, normalizeExternalUrl } from "@/lib/format";
import type { DisplayPromoCode, ExternalPromoCode } from "@/lib/types";

export function getConfiguredAffiliateLink(slug: string) {
  const config = getAffiliateConfigBySlug(slug);

  return normalizeExternalUrl(config?.affiliateLink);
}

export function getAffiliatePromoCodesForCasino(slug: string): DisplayPromoCode[] {
  const config = getAffiliateConfigBySlug(slug);

  if (!config?.affiliatePromoCodes?.length) return [];

  return config.affiliatePromoCodes
    .filter((promo) => promo.code.trim().length > 0 && !isPlaceholder(promo.code))
    .map((promo, index) => ({
      id: `affiliate-${slug}-${promo.code}-${index}`,
      casinoSlug: slug,
      code: promo.code,
      label: promo.label,
      description: promo.description,
      conditions: promo.conditions,
      source: "PromoGuard",
      sourceId: "AffiliateConfig",
      isAffiliateOwned: true,
      isActive: true,
      priority: promo.priority ?? 0,
      validUntil: null,
      lastCheckedAt: null,
      lastUpdatedAt: null
    }));
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
    description: promo.description,
    conditions: promo.conditions,
    source: promo.source,
    isAffiliateOwned: false,
    priority: promo.priority ?? 0,
    estimatedValue: promo.estimatedValue,
    validUntil: promo.validUntil ?? null,
    isActive: promo.isActive ?? true,
    lastCheckedAt: promo.lastCheckedAt,
    lastUpdatedAt: promo.lastUpdatedAt
  };
}
