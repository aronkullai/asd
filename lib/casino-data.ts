import type { Casino, PromoCode, Review } from "@/lib/types";

const now = "2026-05-28T00:00:00.000Z";

export const casinos: Casino[] = [
  {
    id: "casino_stake",
    name: "Stake",
    slug: "stake",
    logoText: "ST",
    logoIcon: {
      imageSrc: "/casino-icons/stake.png",
      imageAlt: "Stake logo",
      symbol: "bolt",
      gradient: ["#07111f", "#12243a", "#1f9d7a"],
      accent: "#9cf6cf",
      glint: "rgba(156, 246, 207, 0.26)"
    },
    rating: 8.8,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Crypto-first cashier", "Large game library", "Popular sportsbook"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "fast",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Slots, live casino, table games, sportsbook",
    summary:
      "Stake is listed as a placeholder profile until PromoGuard verifies licensing, bonus terms, payment details, and current Trustpilot data.",
    pros: ["Strong brand recognition", "Broad casino and sports coverage", "Affiliate link supplied"],
    cons: ["Trustpilot values still pending", "Promo terms need manual verification"],
    paymentMethods: ["Crypto methods pending verification", "Local methods pending verification"],
    securityNotes: ["Verify license directly before publication", "Add account security notes after review"],
    supportNotes: ["Add live chat availability", "Add dispute route details"],
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "ADD_PROMO_SOURCE_URL",
      notes: "Replace with official partner API, affiliate dashboard, RSS feed, or approved manual source."
    }
  },
  {
    id: "casino_rainbet",
    name: "Rainbet",
    slug: "rainbet",
    logoText: "RB",
    logoIcon: {
      imageSrc: "/casino-icons/rainbet1.png",
      imageAlt: "Rainbet logo",
      symbol: "rain",
      gradient: ["#16213e", "#315c93", "#8fd8ff"],
      accent: "#d6f4ff",
      glint: "rgba(143, 216, 255, 0.3)"
    },
    rating: 8.5,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["PromoGuard link supplied", "Modern casino UX", "Bonus terms pending"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "fast",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary:
      "Rainbet has an affiliate URL ready and needs final PromoGuard review data, Trustpilot metadata, and promo terms before launch.",
    pros: ["Affiliate URL supplied", "Suitable for top promo testing", "Trustpilot profile placeholder ready"],
    cons: ["Trustpilot values still pending", "License summary must be verified"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Verify responsible gambling tools", "Add license reference"],
    supportNotes: ["Add response-time notes", "Add support channels"],
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "ADD_PROMO_SOURCE_URL",
      notes: "Use approved partner source only; no aggressive scraping."
    }
  },
  {
    id: "casino_roobet",
    name: "Roobet",
    slug: "roobet",
    logoText: "RO",
    logoIcon: {
      imageSrc: "/casino-icons/roobet1.png",
      imageAlt: "Roobet logo",
      symbol: "gem",
      gradient: ["#371018", "#a61e3d", "#f7b267"],
      accent: "#ffd6a5",
      foreground: "#fff7ed",
      glint: "rgba(255, 214, 165, 0.26)"
    },
    rating: 8.3,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Known casino brand", "Affiliate link supplied", "Review data pending"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "standard",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary:
      "Roobet is configured with your partner URL and placeholder editorial data for verification before publishing.",
    pros: ["Affiliate URL supplied", "Recognizable brand", "Good candidate for full review"],
    cons: ["Promo code not final", "Trustpilot data not yet verified"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add licensing notes", "Add account protection notes"],
    supportNotes: ["Add support availability", "Add dispute handling notes"],
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "ADD_PROMO_SOURCE_URL",
      notes: "Connect to a verified source later."
    }
  },
  {
    id: "casino_celsius",
    name: "Celsius Casino",
    slug: "celsius-casino",
    logoText: "CC",
    logoIcon: {
      imageSrc: "/casino-icons/celsius.png",
      imageAlt: "Celsius Casino logo",
      symbol: "snow",
      gradient: ["#062c43", "#0f766e", "#b8f2e6"],
      accent: "#d8fffb",
      glint: "rgba(216, 255, 251, 0.28)"
    },
    rating: 8.1,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Affiliate link supplied", "Promo review pending", "Trustpilot placeholder"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "standard",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary:
      "Celsius Casino is ready for real promo code, Trustpilot, and review data once your partner terms are confirmed.",
    pros: ["Affiliate URL supplied", "Clear placeholder structure", "Admin refresh-ready"],
    cons: ["Needs verified offer terms", "Needs current profile URL"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add license data", "Add responsible gambling tools"],
    supportNotes: ["Add customer support notes"],
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "ADD_PROMO_SOURCE_URL",
      notes: "Replace with real partner dashboard source."
    }
  },
  {
    id: "casino_spartans",
    name: "Spartans Casino",
    slug: "spartans-casino",
    logoText: "SC",
    logoIcon: {
      imageSrc: "/casino-icons/spartans.png",
      imageAlt: "Spartans Casino logo",
      symbol: "shield",
      gradient: ["#21130d", "#8a2c0d", "#e0a72e"],
      accent: "#ffe08a",
      foreground: "#fff8e6",
      glint: "rgba(255, 224, 138, 0.3)"
    },
    rating: 7.9,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Affiliate URL pending", "Promo placeholder ready", "Review profile ready"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "manual-review",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary:
      "Spartans Casino is included because it was requested, but its affiliate URL is still a visible placeholder.",
    pros: ["Requested casino included", "Promo structure ready", "Detail page generated"],
    cons: ["Affiliate link missing", "Trustpilot and regulator data pending"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add verified license information"],
    supportNotes: ["Add support channels and dispute notes"],
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "ADD_PROMO_SOURCE_URL",
      notes: "Add affiliate source once available."
    }
  },
  {
    id: "casino_shuffle",
    name: "Shuffle",
    slug: "shuffle",
    logoText: "SH",
    logoIcon: {
      imageSrc: "/casino-icons/shuffle1.png",
      imageAlt: "Shuffle logo",
      symbol: "dice",
      gradient: ["#082f2a", "#138a72", "#d5f875"],
      accent: "#efffb4",
      glint: "rgba(213, 248, 117, 0.26)"
    },
    rating: 8.4,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Affiliate link supplied", "Modern casino profile", "Promo placeholder ready"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "fast",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary:
      "Shuffle is configured with your affiliate URL and prepared for verified PromoGuard review and promo code data.",
    pros: ["Affiliate URL supplied", "Strong candidate for promo highlight", "Trustpilot slot ready"],
    cons: ["Trustpilot score pending", "Bonus details pending"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add security review notes"],
    supportNotes: ["Add UX and support review notes"],
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "ADD_PROMO_SOURCE_URL",
      notes: "Use approved source for future updates."
    }
  },
  {
    id: "casino_bcgame",
    name: "BC.Game",
    slug: "bc-game",
    logoText: "BC",
    logoIcon: {
      imageSrc: "/casino-icons/bcgame.png",
      imageAlt: "BC.Game logo",
      symbol: "coins",
      gradient: ["#111827", "#334155", "#facc15"],
      accent: "#fde68a",
      glint: "rgba(250, 204, 21, 0.28)"
    },
    rating: 8,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Additional placeholder casino", "Promo structure ready", "Review template ready"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "standard",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary: "BC.Game is included as an expansion placeholder for future partner links and review data.",
    pros: ["Expansion-ready casino", "Promo and review pages generated"],
    cons: ["Affiliate URL pending", "Trustpilot and bonus data pending"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add verified license information"],
    supportNotes: ["Add support notes"],
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "ADD_PROMO_SOURCE_URL",
      notes: "Add partner source later."
    }
  },
  {
    id: "casino_bitcasino",
    name: "Bitcasino",
    slug: "bitcasino",
    logoText: "BI",
    logoIcon: {
      imageSrc: "/casino-icons/bitcasino.png",
      imageAlt: "Bitcasino logo",
      symbol: "crown",
      gradient: ["#101828", "#4338ca", "#f97316"],
      accent: "#fed7aa",
      glint: "rgba(249, 115, 22, 0.26)"
    },
    rating: 7.8,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Additional placeholder casino", "Crypto-casino candidate", "Terms pending"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "standard",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary: "Bitcasino is included as an additional casino placeholder for future expansion.",
    pros: ["Expansion-ready page", "Promo template ready"],
    cons: ["Affiliate URL pending", "Trustpilot data pending"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add verified license information"],
    supportNotes: ["Add support notes"],
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "ADD_PROMO_SOURCE_URL",
      notes: "Add partner source later."
    }
  }
];

// External/public promo codes should be stored by the researcher or added to
// lib/external-promo-data.ts after verification. Affiliate-owned codes belong
// only in config/affiliateConfig.ts.
export const promoCodes: PromoCode[] = [];

export const reviews: Review[] = [
  {
    id: "review_stake_1",
    casinoSlug: "stake",
    reviewerName: "PromoGuard tester",
    rating: 4,
    date: "2026-05-20T00:00:00.000Z",
    text: "Placeholder internal review. Replace with a real PromoGuard user review after moderation."
  },
  {
    id: "review_rainbet_1",
    casinoSlug: "rainbet",
    reviewerName: "PromoGuard tester",
    rating: 4,
    date: "2026-05-20T00:00:00.000Z",
    text: "Placeholder internal review. Trustpilot reviews remain external and separate."
  },
  {
    id: "review_shuffle_1",
    casinoSlug: "shuffle",
    reviewerName: "PromoGuard tester",
    rating: 5,
    date: "2026-05-20T00:00:00.000Z",
    text: "Placeholder internal review for page structure and rating distribution."
  }
];

export function getCasinoBySlug(slug: string) {
  return casinos.find((casino) => casino.slug === slug);
}

export function getReviewsForCasino(slug: string) {
  return reviews.filter((review) => review.casinoSlug === slug);
}
