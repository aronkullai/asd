export type AffiliatePromoCode = {
  code: string;
  label: string;
  description?: string;
  conditions?: string;
  priority?: number;
};

export type CasinoAffiliateConfig = {
  name: string;
  slug: string;
  /**
   * Paste your real affiliate tracking URL here for this casino.
   * This is the ONLY source used by outbound offer buttons.
   * External promo research must never overwrite this value.
   */
  affiliateLink: string;
  /**
   * Paste your affiliate-owned promo codes here if you have them.
   * Leave undefined or [] when you do not have a code; the UI will hide
   * affiliate promo code blocks instead of showing placeholders.
   */
  affiliatePromoCodes?: AffiliatePromoCode[];
  notes?: string;
};

export const affiliateConfig: CasinoAffiliateConfig[] = [
  {
    name: "Stake",
    slug: "stake",
    affiliateLink: "stake.com/?c=PromoGuard",
    affiliatePromoCodes: []
  },
  {
    name: "Rainbet",
    slug: "rainbet",
    affiliateLink: "https://rainbet.com?r=promoguard",
    affiliatePromoCodes: []
  },
  {
    name: "Roobet",
    slug: "roobet",
    affiliateLink: "https://roobet.com/?ref=aronkullai",
    affiliatePromoCodes: []
  },
  {
    name: "Celsius Casino",
    slug: "celsius-casino",
    affiliateLink: "https://celsiuscasino.com/?referrer=User76248",
    affiliatePromoCodes: []
  },
  {
    name: "Spartans Casino",
    slug: "spartans-casino",
    affiliateLink: "spartans.com/?c=PromoGuard&modal=register",
    affiliatePromoCodes: []
  },
  {
    name: "Shuffle",
    slug: "shuffle",
    affiliateLink: "https://shuffle.com?r=PromoGuard",
    affiliatePromoCodes: []
  },
  {
    name: "BC.Game",
    slug: "bc-game",
    affiliateLink: "https://bc.game/i-97fnl8tws6-n/",
    affiliatePromoCodes: []
  },
  {
    name: "Bitcasino",
    slug: "bitcasino",
    affiliateLink: "bitcasino.io/ref/U0E2WDTAZDSI",
    affiliatePromoCodes: []
  }
];

export function getAffiliateConfigBySlug(slug: string) {
  const config = affiliateConfig.find((casino) => casino.slug === slug);

  if (!config) {
    console.warn(`[affiliateConfig] Missing affiliate config for casino slug "${slug}". Affiliate CTAs will be disabled.`);
  }

  return config;
}
