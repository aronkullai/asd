export type PromoApiCasinoEndpoint = {
  casinoSlug: string;
  endpoint: string;
};

export const promoApiConfig = {
  enabled: process.env.PROMO_API_ENABLED === "true",
  baseUrl: process.env.PROMO_API_BASE_URL || "",
  apiKey: process.env.PROMO_API_KEY || "",
  authToken: process.env.PROMO_API_AUTH_TOKEN || "",
  endpoints: [
    { casinoSlug: "stake", endpoint: process.env.PROMO_API_ENDPOINT_STAKE || "" },
    { casinoSlug: "rainbet", endpoint: process.env.PROMO_API_ENDPOINT_RAINBET || "" },
    { casinoSlug: "roobet", endpoint: process.env.PROMO_API_ENDPOINT_ROOBET || "" },
    { casinoSlug: "gamdom", endpoint: process.env.PROMO_API_ENDPOINT_GAMDOM || "" },
    { casinoSlug: "justcasino", endpoint: process.env.PROMO_API_ENDPOINT_JUSTCASINO || "" },
    { casinoSlug: "betpanda", endpoint: process.env.PROMO_API_ENDPOINT_BETPANDA || "" }
  ] satisfies PromoApiCasinoEndpoint[]
};
