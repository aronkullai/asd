export type ResearcherSourceId = "PublicPromoPage";

export type CasinoResearcherConfig = {
  slug: string;
  enabledSources: ResearcherSourceId[];
  sourceUrls?: string[];
};

export const researcherConfig = {
  intervalMinutes: Number(process.env.PROMO_RESEARCHER_INTERVAL_MINUTES || 30),
  maxRetriesPerRun: Number(process.env.PROMO_RESEARCHER_MAX_RETRIES || 2),
  delayBetweenCallsMs: Number(process.env.PROMO_RESEARCHER_DELAY_MS || 500),
  enabledSources: ["PublicPromoPage"] satisfies ResearcherSourceId[],
  casinos: [
    { slug: "stake", enabledSources: ["PublicPromoPage"], sourceUrls: [] },
    { slug: "rainbet", enabledSources: ["PublicPromoPage"], sourceUrls: [] },
    { slug: "roobet", enabledSources: ["PublicPromoPage"], sourceUrls: [] },
    { slug: "celsius-casino", enabledSources: ["PublicPromoPage"], sourceUrls: [] },
    { slug: "spartans-casino", enabledSources: ["PublicPromoPage"], sourceUrls: [] },
    { slug: "shuffle", enabledSources: ["PublicPromoPage"], sourceUrls: [] },
    { slug: "bc-game", enabledSources: ["PublicPromoPage"], sourceUrls: [] },
    { slug: "bitcasino", enabledSources: ["PublicPromoPage"], sourceUrls: [] }
  ] satisfies CasinoResearcherConfig[]
};

export function getResearcherCronExpression() {
  return `*/${researcherConfig.intervalMinutes} * * * *`;
}

export function getEnabledSourcesForCasino(slug: string) {
  return researcherConfig.casinos.find((casino) => casino.slug === slug)?.enabledSources ?? researcherConfig.enabledSources;
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
