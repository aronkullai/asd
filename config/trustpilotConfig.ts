export type CasinoTrustpilotConfig = {
  slug: string;
  /**
   * Preferred: paste the Trustpilot Business Unit ID here.
   * Trustpilot recommends storing Business Unit IDs instead of looking them up
   * on every API request.
   */
  businessUnitId?: string;
  /**
   * Optional fallback: paste the casino domain here if you do not know the
   * Business Unit ID yet. The server can use Trustpilot's Business Units find
   * endpoint to resolve it.
   */
  domain?: string;
  /**
   * Optional manual fallback. If API credentials are missing or an API call
   * fails, UI can still show a "Read reviews on Trustpilot" link.
   */
  profileUrl?: string;
};

export const trustpilotConfig: CasinoTrustpilotConfig[] = [
  { slug: "stake", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "PASTE_DOMAIN_HERE", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "rainbet", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "PASTE_DOMAIN_HERE", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "roobet", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "PASTE_DOMAIN_HERE", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "celsius-casino", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "PASTE_DOMAIN_HERE", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "spartans-casino", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "PASTE_DOMAIN_HERE", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "shuffle", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "PASTE_DOMAIN_HERE", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "bc-game", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "PASTE_DOMAIN_HERE", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "bitcasino", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "PASTE_DOMAIN_HERE", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "gamdom", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "gamdom.com", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "justcasino", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "justcasino.casino", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" },
  { slug: "betpanda", businessUnitId: "PASTE_BUSINESS_UNIT_ID_HERE", domain: "betpandacasino.io", profileUrl: "PASTE_TRUSTPILOT_PROFILE_URL_HERE" }
];

export function getTrustpilotConfigBySlug(slug: string) {
  return trustpilotConfig.find((config) => config.slug === slug);
}
