export type CasinoResearcherConfig = {
  slug: string;
  sourceUrls?: string[];
};

export const researcherConfig = {
  intervalHours: Number(process.env.PROMO_RESEARCHER_INTERVAL_HOURS || 12),
  requestTimeoutMs: Number(process.env.PROMO_RESEARCHER_TIMEOUT_MS || 8000),
  delayBetweenChecksMs: Number(process.env.PROMO_RESEARCHER_DELAY_MS || 500),
  casinos: [
    { slug: "stake", sourceUrls: [] },
    { slug: "rainbet", sourceUrls: [] },
    { slug: "roobet", sourceUrls: [] },
    { slug: "celsius-casino", sourceUrls: [] },
    { slug: "spartans-casino", sourceUrls: [] },
    { slug: "shuffle", sourceUrls: [] },
    { slug: "bc-game", sourceUrls: [] },
    { slug: "bitcasino", sourceUrls: [] },
    { slug: "gamdom", sourceUrls: ["https://help.gamdom.com/en/articles/10290516-gamdom-rewards"] },
    { slug: "justcasino", sourceUrls: [] },
    { slug: "betpanda", sourceUrls: [] }
  ] satisfies CasinoResearcherConfig[]
};

export function getResearcherCronExpression() {
  return `0 */${researcherConfig.intervalHours} * * *`;
}

export function getPromoSourceUrlsForCasino(slug: string) {
  const fromConfig = researcherConfig.casinos.find((casino) => casino.slug === slug)?.sourceUrls ?? [];
  const envKey = `PROMO_SOURCE_URLS_${slug.replace(/-/g, "_").toUpperCase()}`;
  const fromEnv = (process.env[envKey] || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  return [...fromConfig, ...fromEnv];
}
