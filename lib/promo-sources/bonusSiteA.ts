import { curatedPromoCodes } from "@/config/curatedPromoCodes";
import type { ExternalBonusSource } from "@/lib/promo-sources/externalBonusTypes";

export const bonusSiteA: ExternalBonusSource = {
  id: "bonus-site-a",
  async fetchCodesForCasino(casino) {
    return curatedPromoCodes
      .filter((promo) => promo.casinoSlug === casino.slug && promo.sourceSiteId)
      .map((promo) => ({
        code: promo.code,
        benefitTitle: promo.benefitTitle || promo.label,
        benefitDescription: promo.benefitDescription || promo.description,
        bonusType: promo.bonusType,
        minDeposit: promo.minDeposit,
        wageringRequirements: promo.wageringRequirements || promo.conditions,
        validFrom: promo.validFrom ? new Date(promo.validFrom) : null,
        validUntil: promo.validUntil ? new Date(promo.validUntil) : null,
        sourceSiteId: promo.sourceSiteId!
      }));
  }
};
