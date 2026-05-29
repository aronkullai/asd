import type { ExternalBonusSource } from "@/lib/promo-sources/externalBonusTypes";

export const bonusSiteB: ExternalBonusSource = {
  id: "bonus-site-b",
  async fetchCodesForCasino() {
    // Wire your second external bonus API here using env vars and
    // config/promoSourcesConfig.ts. Return [] until a real source is configured.
    return [];
  }
};
