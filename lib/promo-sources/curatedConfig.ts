import { curatedPromoCodes } from "@/config/curatedPromoCodes";
import type { PromoSourceProvider } from "@/lib/promo-sources/types";

export const curatedConfigPromoSource: PromoSourceProvider = {
  id: "CuratedConfig",
  label: "Curated config",
  async fetchPromoCodesForCasino(casino) {
    return curatedPromoCodes
      .filter((promo) => promo.casinoSlug === casino.slug)
      .map((promo) => ({
        ...promo,
        source: promo.source || "Manual",
        sourceId: promo.sourceId || "CuratedConfig"
      }));
  }
};

