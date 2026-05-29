export type PayoutSpeed = "instant" | "fast" | "standard" | "manual-review";

export type TrustpilotMeta = {
  score: string;
  reviewCount: string;
  profileUrl: string;
  lastUpdatedAt: string;
};

export type CasinoLogoSymbol = "bolt" | "rain" | "gem" | "snow" | "shield" | "dice" | "coins" | "crown";

export type CasinoLogoConfig = {
  symbol: CasinoLogoSymbol;
  gradient: [string, string, string];
  accent: string;
  foreground?: string;
  glint?: string;
  imageSrc?: string;
  imageAlt?: string;
  lightImageSrc?: string;
  darkImageSrc?: string;
};

export type PromoCode = {
  id: string;
  casinoSlug: string;
  code: string;
  label: string;
  benefit: string;
  benefitTitle?: string;
  benefitDescription?: string | null;
  bonusType?: string | null;
  minDeposit?: number | null;
  wageringRequirements?: string | null;
  description?: string;
  conditions?: string;
  source: string;
  sourceId?: string;
  sourceSiteId?: string | null;
  isAffiliateOwned: boolean;
  priority?: number;
  estimatedValue?: number;
  requirements: string;
  validFrom?: string;
  validUntil?: string;
  maxUses?: number | null;
  usesSoFar?: number;
  region?: string | null;
  isVerified?: boolean;
  discoveredAt?: string;
  isActive: boolean;
  lastCheckedAt: string;
  lastUpdatedAt: string;
};

export type ExternalPromoCode = {
  id: string;
  casinoSlug: string;
  code: string;
  label: string;
  benefit?: string;
  benefitTitle?: string;
  benefitDescription?: string | null;
  bonusType?: string | null;
  minDeposit?: number | null;
  wageringRequirements?: string | null;
  description?: string;
  conditions?: string;
  source: string;
  sourceId?: string;
  sourceSiteId?: string | null;
  isAffiliateOwned?: boolean;
  priority?: number;
  estimatedValue?: number;
  validUntil?: string | null;
  validFrom?: string | null;
  maxUses?: number | null;
  usesSoFar?: number;
  region?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
  lastCheckedAt: string | null;
  lastUpdatedAt: string | null;
};

export type DisplayPromoCode = ExternalPromoCode & {
  isAffiliateOwned: boolean;
};

export type TrustpilotSummary = {
  businessUnitId: string;
  trustScore: number;
  stars: number;
  reviewCount: number;
  profileUrl: string | null;
  lastFetchedAt: string;
};

export type TrustpilotReview = {
  id: string;
  stars: number;
  title: string;
  text: string;
  createdAt: string;
  consumerName: string;
  reviewUrl?: string;
};

export type Review = {
  id: string;
  casinoSlug: string;
  source?: string;
  reviewerName: string;
  authorName?: string | null;
  rating: number;
  title?: string | null;
  body?: string | null;
  date: string;
  text: string;
  externalUrl?: string | null;
  isHighlighted?: boolean;
  adminNote?: string | null;
};

export type Casino = {
  id: string;
  name: string;
  slug: string;
  logoText: string;
  logoIcon: CasinoLogoConfig;
  rating: number;
  trustpilot: TrustpilotMeta;
  highlights: string[];
  regulator: string;
  licenseInfo?: string;
  areaRegulations?: string;
  payoutSpeed: PayoutSpeed;
  payoutSummary: string;
  bonusOverview: string;
  supportQuality: string;
  supportChannels?: string[];
  safetyFeatures?: string[];
  gameSelection: string;
  summary: string;
  pros: string[];
  cons: string[];
  paymentMethods: string[];
  securityNotes: string[];
  supportNotes: string[];
  reviewNote?: string;
  fetchMetadata: {
    sourceType: "manual" | "api" | "rss" | "html";
    sourceUrl: string;
    notes: string;
  };
};
