export type PromoSourceMapping = {
  casinoSlug: string;
  sources: Array<{
    sourceSiteId: string;
    kind: "manual-config" | "api" | "html";
    url?: string;
    siteCasinoId?: string;
    apiEndpointEnv?: string;
  }>;
};

// Backend-only source mapping. These IDs are used by the researcher and admin
// audit trail, but source-site names are intentionally not rendered publicly.
export const promoSourcesConfig: PromoSourceMapping[] = [
  { casinoSlug: "rainbet", sources: [{ sourceSiteId: "wethrift-rainbet", kind: "manual-config", url: "https://www.wethrift.com/rainbet" }] },
  { casinoSlug: "shuffle", sources: [{ sourceSiteId: "shufflepromocode", kind: "manual-config", url: "https://shufflepromocode.com/" }, { sourceSiteId: "covers-shuffle", kind: "manual-config", url: "https://www.covers.com/casino/bonuses/shuffle-promo-code" }] },
  { casinoSlug: "celsius-casino", sources: [{ sourceSiteId: "celsius-casino-hungary", kind: "manual-config", url: "https://celsiuss-casino-hungary.com/" }] },
  { casinoSlug: "bc-game", sources: [{ sourceSiteId: "whichcasino-bc-game", kind: "manual-config", url: "https://www.whichcasino.com/bonus/bc-game-promo-code/" }] },
  { casinoSlug: "bitcasino", sources: [{ sourceSiteId: "bitcasino-help-code", kind: "manual-config", url: "https://www.bitcasino.com/support/bonuses/code/" }] },
  { casinoSlug: "justcasino", sources: [{ sourceSiteId: "justcasino-official-bonuses", kind: "manual-config", url: "https://justcasino-official.com/bonuses" }] },
  { casinoSlug: "betpanda", sources: [{ sourceSiteId: "coinstats-betpanda", kind: "manual-config", url: "https://coinstats.app/crypto-casino-reviews/betpanda/promo-code/" }] },
  { casinoSlug: "roobet", sources: [{ sourceSiteId: "jamesswan-roobet", kind: "manual-config", url: "https://www.jamesswan.com/" }] },
  { casinoSlug: "gamdom", sources: [{ sourceSiteId: "gamdom-help-affiliate-code", kind: "manual-config", url: "https://help.gamdom.com/en/articles/13334652-how-to-add-an-affiliate-code" }] }
];

export function getPromoSourceMappingsForCasino(slug: string) {
  return promoSourcesConfig.find((mapping) => mapping.casinoSlug === slug)?.sources ?? [];
}
