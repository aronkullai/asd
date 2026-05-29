import { promoApiConfig } from "@/config/promoApiConfig";
import type { PromoSourceProvider } from "@/lib/promo-sources/types";
import type { PromoCodeInput } from "@/lib/promo-code-validation";

type ExternalPromoApiCode = {
  code?: string;
  label?: string;
  benefit?: string;
  description?: string;
  conditions?: string;
  source?: string;
  validFrom?: string | null;
  validUntil?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  region?: string | null;
  maxUses?: number | null;
  usesSoFar?: number;
};

function endpointForCasino(slug: string) {
  const endpoint = promoApiConfig.endpoints.find((item) => item.casinoSlug === slug)?.endpoint;
  if (!promoApiConfig.enabled || !promoApiConfig.baseUrl || !endpoint) return null;
  return new URL(endpoint, promoApiConfig.baseUrl).toString();
}

export const externalApiPromoSource: PromoSourceProvider = {
  id: "ExternalPromoAPI",
  label: "External promo API",
  async fetchPromoCodesForCasino(casino) {
    const endpoint = endpointForCasino(casino.slug);
    if (!endpoint) return [];

    const response = await fetch(endpoint, {
      headers: {
        accept: "application/json",
        ...(promoApiConfig.apiKey ? { "x-api-key": promoApiConfig.apiKey } : {}),
        ...(promoApiConfig.authToken ? { authorization: `Bearer ${promoApiConfig.authToken}` } : {})
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`External promo API failed for ${casino.slug}: ${response.status}`);
    }

    const payload = await response.json() as { codes?: ExternalPromoApiCode[]; promos?: ExternalPromoApiCode[] };
    const codes = payload.codes || payload.promos || [];

    return codes
      .filter((item) => item.code && item.label)
      .map((item): PromoCodeInput => ({
        casinoSlug: casino.slug,
        code: item.code!,
        label: item.label!,
        benefit: item.benefit || item.description || item.label,
        description: item.description,
        conditions: item.conditions,
        source: item.source || "Partner API",
        sourceId: "ExternalPromoAPI",
        isAffiliateOwned: false,
        isVerified: Boolean(item.isVerified),
        isActive: item.isActive !== false,
        validFrom: item.validFrom || null,
        validUntil: item.validUntil || null,
        region: item.region || null,
        maxUses: item.maxUses ?? null,
        usesSoFar: item.usesSoFar ?? 0
      }));
  }
};

