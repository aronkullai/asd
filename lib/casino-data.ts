import type { Casino, PromoCode, Review } from "@/lib/types";

const now = "2026-05-28T00:00:00.000Z";

const coreCasinos: Casino[] = [
  {
    id: "casino_stake",
    name: "Stake",
    slug: "stake",
    logoText: "ST",
    logoIcon: {
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
      "Stake is listed for editorial review while PromoGuard verifies licensing, bonus terms, payment details, and current review data.",
    pros: ["Strong brand recognition", "Broad casino and sports coverage", "Affiliate link supplied"],
    cons: ["Trustpilot values still pending", "Promo terms need manual verification"],
    paymentMethods: ["Crypto methods pending verification", "Local methods pending verification"],
    securityNotes: ["Verify license directly before publication", "Add account security notes after review"],
    supportNotes: ["Add live chat availability", "Add dispute route details"],
    reviewNote: "Players often praise the broad game library and quick crypto cashier flow, while critical notes usually focus on verification friction and bonus-term clarity.",
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
    pros: ["Affiliate URL supplied", "Suitable for offer review", "Trustpilot profile pending verification"],
    cons: ["Trustpilot values still pending", "License summary must be verified"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Verify responsible gambling tools", "Add license reference"],
    supportNotes: ["Add response-time notes", "Add support channels"],
    reviewNote: "Positive comments tend to mention a modern interface and simple onboarding. Watch for user notes about bonus terms and support responsiveness.",
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
      "Roobet is configured with your partner URL and needs final editorial verification before publishing.",
    pros: ["Affiliate URL supplied", "Recognizable brand", "Good candidate for full review"],
    cons: ["Promo code not final", "Trustpilot data not yet verified"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add licensing notes", "Add account protection notes"],
    supportNotes: ["Add support availability", "Add dispute handling notes"],
    reviewNote: "Users typically discuss brand familiarity and crypto-first payments. KYC timing and promo availability should be checked before recommending.",
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
    highlights: ["Affiliate link supplied", "Promo review pending", "Trustpilot data pending"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "standard",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary:
      "Celsius Casino is ready for real promo code, Trustpilot, and review data once your partner terms are confirmed.",
    pros: ["Affiliate URL supplied", "Clear review structure", "Admin review-ready"],
    cons: ["Needs verified offer terms", "Needs current profile URL"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add license data", "Add responsible gambling tools"],
    supportNotes: ["Add customer support notes"],
    reviewNote: "Feedback to monitor: withdrawal consistency, support tone, and whether advertised rewards remain available by region.",
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
    highlights: ["Affiliate URL pending", "Promo review pending", "Review profile ready"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "manual-review",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary:
      "Spartans Casino is included for future review, but its affiliate URL still needs to be supplied.",
    pros: ["Requested casino included", "Promo structure ready", "Detail page generated"],
    cons: ["Affiliate link missing", "Trustpilot and regulator data pending"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add verified license information"],
    supportNotes: ["Add support channels and dispute notes"],
    reviewNote: "Because partner data is still thin, prioritize manual checks for payment reliability, identity review, and customer support channels.",
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
    highlights: ["Affiliate link supplied", "Modern casino profile", "Promo review pending"],
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
    reviewNote: "The strongest user signal is usually speed and product polish. Balance that with careful checks on terms, country limits, and responsible-gambling tools.",
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
    highlights: ["Additional casino candidate", "Promo review pending", "Review data pending"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "standard",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary: "BC.Game is included as an expansion candidate for future partner links and review data.",
    pros: ["Expansion-ready casino", "Promo and review pages generated"],
    cons: ["Affiliate URL pending", "Trustpilot and bonus data pending"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add verified license information"],
    supportNotes: ["Add support notes"],
    reviewNote: "Users often focus on game breadth and promotions. Keep an eye on regional restrictions, verification timelines, and support escalation paths.",
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
    highlights: ["Additional casino candidate", "Crypto-casino candidate", "Terms pending"],
    regulator: "Add verified license / regulator",
    payoutSpeed: "standard",
    payoutSummary: "Add verified payout speed",
    bonusOverview: "Add verified welcome bonus summary",
    supportQuality: "Add verified support quality",
    gameSelection: "Add verified game selection",
    summary: "Bitcasino is included as an additional casino candidate for future expansion.",
    pros: ["Expansion-ready page", "Promo template ready"],
    cons: ["Affiliate URL pending", "Trustpilot data pending"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Add verified license information"],
    supportNotes: ["Add support notes"],
    reviewNote: "Review summaries should separate long-running brand trust from current offer quality, especially when promo terms change quickly.",
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "ADD_PROMO_SOURCE_URL",
      notes: "Add partner source later."
    }
  }
];

const requestedCasinos: Casino[] = [
  {
    id: "casino_gamdom",
    name: "Gamdom",
    slug: "gamdom",
    logoText: "GD",
    logoIcon: {
      symbol: "bolt",
      gradient: ["#06151f", "#123c55", "#25d0a2"],
      accent: "#a7f3d0",
      foreground: "#ecfeff"
    },
    rating: 8.2,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Affiliate link supplied", "Rewards program documented", "Crypto-friendly casino"],
    regulator: "Add verified license / regulator",
    licenseInfo: "Verify Gamdom's current licensing and country restrictions before publishing final recommendation copy.",
    payoutSpeed: "fast",
    payoutSummary: "Add verified withdrawal timing after checking the cashier, terms, or partner documentation.",
    bonusOverview: "Affiliate-code rewards available; current terms must be checked before use.",
    supportQuality: "Add verified support availability, response expectations, and dispute route notes.",
    supportChannels: ["Add live chat availability", "Add email or help center details"],
    safetyFeatures: ["Verify responsible gambling tools", "Verify KYC and withdrawal policy"],
    gameSelection: "Slots, live casino, originals, sportsbook; verify current lobby before publication.",
    summary: "Gamdom is configured with your partner URL and ready for verified PromoGuard offer, review, and safety data.",
    pros: ["Affiliate URL supplied", "Official help center documents affiliate-code rewards", "Good crypto-casino fit"],
    cons: ["License and market restrictions need final verification", "Public promo terms can change quickly"],
    paymentMethods: ["Add verified crypto and fiat payment methods"],
    securityNotes: ["Verify license directly before publication", "Confirm responsible gambling tools"],
    supportNotes: ["Add support channels", "Add response-time notes"],
    reviewNote: "Monitor current user feedback around withdrawals, verification requests, reward activation, and regional access.",
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "https://help.gamdom.com/en/articles/10290516-gamdom-rewards",
      notes: "Official help page confirms affiliate-code activation for boosted new-account rewards."
    }
  },
  {
    id: "casino_justcasino",
    name: "JustCasino",
    slug: "justcasino",
    logoText: "JC",
    logoIcon: {
      symbol: "gem",
      gradient: ["#160f2f", "#4c1d95", "#f59e0b"],
      accent: "#fde68a",
      foreground: "#fff7ed"
    },
    rating: 8.0,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Affiliate link supplied", "Manual review required", "Promo terms pending"],
    regulator: "Add verified license / regulator",
    licenseInfo: "Verify JustCasino's current license, operating entity, and allowed markets before publication.",
    payoutSpeed: "standard",
    payoutSummary: "Add verified payout timing from the cashier, terms, or partner documentation.",
    bonusOverview: "Partner referral code supplied; current public promo terms need direct verification.",
    supportQuality: "Add verified support hours, response expectations, and escalation notes.",
    supportChannels: ["Add live chat availability", "Add email or help center details"],
    safetyFeatures: ["Verify responsible gambling tools", "Verify KYC and withdrawal policy"],
    gameSelection: "Add verified game categories and notable providers.",
    summary: "JustCasino is configured with your PromoGuard referral URL and needs final license, bonus, and review verification before heavy promotion.",
    pros: ["Affiliate URL supplied", "Strong candidate for manual promo verification", "Ready for admin enrichment"],
    cons: ["Promo terms must be verified against the live cashier", "Trustpilot and license data pending"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Verify license directly before publication", "Confirm responsible gambling tools"],
    supportNotes: ["Add support channels", "Add response-time notes"],
    reviewNote: "Separate welcome-package claims from verified referral-code benefits until you confirm the current cashier terms.",
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "https://www.justcasino.casino?ref_code=PromoGuard",
      notes: "User-supplied referral URL. Add official bonus source or partner dashboard URL when available."
    }
  },
  {
    id: "casino_betpanda",
    name: "BetPanda",
    slug: "betpanda",
    logoText: "BP",
    logoIcon: {
      symbol: "shield",
      gradient: ["#0f172a", "#14532d", "#facc15"],
      accent: "#fde047",
      foreground: "#f8fafc"
    },
    rating: 8.1,
    trustpilot: {
      score: "ADD_TRUSTPILOT_SCORE",
      reviewCount: "ADD_REVIEW_COUNT",
      profileUrl: "ADD_TRUSTPILOT_PROFILE_URL",
      lastUpdatedAt: now
    },
    highlights: ["Affiliate link supplied", "Crypto-casino candidate", "Promo terms require confirmation"],
    regulator: "Add verified license / regulator",
    licenseInfo: "Verify BetPanda's current license, operating entity, and market restrictions before publication.",
    payoutSpeed: "fast",
    payoutSummary: "Add verified withdrawal timing from the cashier, terms, or partner documentation.",
    bonusOverview: "Referral code supplied; public sources conflict on whether a promo code is required.",
    supportQuality: "Add verified support hours, response expectations, and escalation notes.",
    supportChannels: ["Add live chat availability", "Add email or help center details"],
    safetyFeatures: ["Verify responsible gambling tools", "Verify KYC and withdrawal policy"],
    gameSelection: "Add verified game categories and notable providers.",
    summary: "BetPanda is configured with your referral URL and should be promoted only after current offer and license details are verified.",
    pros: ["Affiliate URL supplied", "Crypto-casino fit", "Ready for manual review data"],
    cons: ["Public bonus-code sources conflict", "License and Trustpilot data pending"],
    paymentMethods: ["Add verified payment methods"],
    securityNotes: ["Verify license directly before publication", "Confirm responsible gambling tools"],
    supportNotes: ["Add support channels", "Add response-time notes"],
    reviewNote: "Check the live cashier and partner dashboard before claiming a specific welcome code, since public sources disagree.",
    fetchMetadata: {
      sourceType: "manual",
      sourceUrl: "https://betpandacasino.io/?referral=LMLLMN9&type=registration&modal=user&isReferral=true",
      notes: "User-supplied referral URL. Add official bonus source or partner API URL when available."
    }
  }
];

const researchedTrustProfiles: Record<string, Partial<Casino>> = {
  stake: {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/stake.com",
      lastUpdatedAt: now
    },
    highlights: ["Curacao-licensed operator", "24/7 help-center support", "Large casino and sportsbook"],
    regulator: "Curacao Gaming Authority",
    licenseInfo: "Stake's public terms identify Medium Rare N.V. as licensed by the Curacao Gaming Authority under license OGL/2024/1451/0918. Re-check the footer and terms before publishing jurisdiction-specific copy.",
    areaRegulations: "Stake lists prohibited jurisdictions and provider-level restrictions in its terms. Users must be 18+ or the local legal age and should not use VPNs or location masking to bypass restrictions.",
    payoutSummary: "Crypto withdrawals are usually positioned as fast, but first withdrawals, larger wins, or risk reviews can trigger KYC and manual checks.",
    supportQuality: "Mature help-center coverage with live chat and email paths. Public complaints tend to focus on KYC, withdrawal reviews, and bonus-rule disputes rather than lack of support access.",
    supportChannels: ["Help center", "Live chat", "Email support"],
    safetyFeatures: ["Casino exclusion", "Self-exclusion options", "KYC and AML reviews", "Responsible gambling tools"],
    securityNotes: ["Curacao license disclosed in official terms", "Restricted jurisdictions apply", "Do not bypass geolocation controls"],
    supportNotes: ["Live chat and email are referenced by official help articles", "Manual reviews may affect withdrawals"]
  },
  rainbet: {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/rainbet.com",
      lastUpdatedAt: now
    },
    highlights: ["Crypto casino and sportsbook", "Restricted-country terms published", "Support form referenced in terms"],
    regulator: "Offshore license, verify current operator and jurisdiction",
    licenseInfo: "Rainbet publishes restricted-use and support terms; third-party reviews have described offshore licensing. Verify the current legal entity, license number, and regulator from the live footer before using a final badge.",
    areaRegulations: "Rainbet terms restrict access from several markets including the United States, United Kingdom, Germany, Spain, France, Australia, Austria, Netherlands-linked territories, and other prohibited jurisdictions.",
    payoutSummary: "Crypto withdrawals may be fast in ordinary cases, but user reports and review sites highlight account freezes, KYC reviews, and bonus-term disputes after larger wins.",
    supportQuality: "Support appears available through website support/contact flows. Treat this as medium-confidence until you test response time with a real support ticket.",
    supportChannels: ["Website support form", "Account support flow", "Social/community channels to verify"],
    safetyFeatures: ["Restricted-use policy", "Self-exclusion language", "KYC and withdrawal checks"],
    securityNotes: ["Restricted markets are stated in terms", "Verify live license before recommending strongly", "Responsible gambling language present"],
    supportNotes: ["Test ticket response times before ranking high", "Watch for KYC and withdrawal complaint patterns"]
  },
  roobet: {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/roobet.com",
      lastUpdatedAt: now
    },
    highlights: ["Known crypto-casino brand", "Detailed provider restriction docs", "Help-center support"],
    regulator: "Curacao/offshore license, verify current terms",
    licenseInfo: "Roobet has historically operated under offshore gaming licensing. Verify the current operator and license details directly from Roobet's legal footer before publishing a specific license number.",
    areaRegulations: "Roobet help pages list provider-level blocked and restricted territories, including the United States, United Kingdom, Australia, France, Germany, Netherlands, Spain, Portugal, Ontario, and other markets depending on game provider.",
    payoutSummary: "Crypto cashier can be quick, but provider restrictions, KYC, and compliance reviews can interrupt deposits, gameplay, or withdrawals.",
    supportQuality: "Help-center documentation is detailed, especially around regional restrictions. Public feedback still requires caution around KYC timing and account reviews.",
    supportChannels: ["Help center", "Account support", "Live chat to verify"],
    safetyFeatures: ["Provider-level country restrictions", "Age and location checks", "KYC and compliance reviews"],
    securityNotes: ["Provider restrictions can vary by game", "Check eligibility before registering", "Avoid VPN/location bypass"],
    supportNotes: ["Help center covers regional restriction detail", "Escalation path should be verified before launch"]
  },
  "celsius-casino": {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/celsiuscasino.com",
      lastUpdatedAt: now
    },
    highlights: ["Curacao operator details found", "Self-exclusion language", "Manual verification recommended"],
    regulator: "Curacao operator details, verify current license",
    licenseInfo: "Celsius terms reviewed in search results identify Celsius Holdings N.V. as a Curacao company. Confirm the current license authority, license number, and active domain before using a regulator badge.",
    areaRegulations: "Country eligibility must be checked against Celsius' live terms and local gambling law. Do not promote in markets where online gambling or crypto wagering is prohibited.",
    payoutSummary: "Treat payout speed as manual-review until cashier tests or partner documentation confirm normal withdrawal timing.",
    supportQuality: "Official terms reference email-based support for account closure and self-exclusion. Live chat and response times still need direct testing.",
    supportChannels: ["Registered email support", "Help/contact route to verify"],
    safetyFeatures: ["Self-exclusion request path", "Account review/KYC expected", "Local law eligibility required"],
    securityNotes: ["Verify active legal domain", "Confirm license details directly", "Document restricted countries before heavy promotion"],
    supportNotes: ["Email support referenced in terms", "Measure live response time before ranking"]
  },
  "spartans-casino": {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/spartans.com",
      lastUpdatedAt: now
    },
    highlights: ["Anjouan license disclosed in terms", "Restricted-country list published", "Support escalation needs testing"],
    regulator: "Government of the Autonomous Island of Anjouan, Union of Comoros",
    licenseInfo: "Spartans terms state that the site is licensed and regulated by the Government of the Autonomous Island of Anjouan, Union of Comoros. Re-check the current license number in the live terms before publishing exact-number copy.",
    areaRegulations: "Spartans terms list restricted countries including the United States, United Kingdom, Australia, Netherlands, Curacao, Spain, Germany, France, Malta, Brazil, Cyprus, Turkey, Greece, and others.",
    payoutSummary: "Withdrawal timing should be treated as manual-review until you test the cashier and confirm KYC expectations.",
    supportQuality: "Public terms reference contacting support if funds are not received after the expected window. Direct live-chat/email responsiveness still needs a PromoGuard test.",
    supportChannels: ["Website support", "Account support flow", "Email/live chat to verify"],
    safetyFeatures: ["Restricted-country list", "Responsible gaming policy reference", "KYC checks expected"],
    securityNotes: ["Anjouan license disclosed", "Large restricted-market list", "Verify active license number before launch"],
    supportNotes: ["Support referenced for delayed funds", "Run a test support ticket before ranking high"]
  },
  shuffle: {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/shuffle.com",
      lastUpdatedAt: now
    },
    highlights: ["Curacao license disclosed", "Restricted-market docs found", "Help center available"],
    regulator: "Curacao Gaming Control Board",
    licenseInfo: "Shuffle terms disclose Natural Nine B.V. and Curacao Gaming Control Board license OGL/2024/1337/0628. Re-check the live terms before publishing exact-number copy.",
    areaRegulations: "Shuffle terms require users to access only from jurisdictions where online betting is legal and apply prohibited-jurisdiction restrictions. Third-party country guides list several restricted markets, so check live terms before promotion.",
    payoutSummary: "Crypto payout flow can be fast in normal cases, but compliance reviews and game-provider restrictions can affect access and withdrawals.",
    supportQuality: "Support appears available through help-center/account channels, but player reports around compliance reviews mean response-time testing is important.",
    supportChannels: ["Help center", "Account support", "Live chat to verify"],
    safetyFeatures: ["Restricted territories", "KYC/compliance checks", "Responsible play notices"],
    securityNotes: ["Curacao license disclosed in official terms", "Check current terms for country list", "Do not encourage VPN bypass"],
    supportNotes: ["Test compliance escalations", "Record response quality before publishing a top-pick badge"]
  },
  "bc-game": {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/bc.game",
      lastUpdatedAt: now
    },
    highlights: ["Large crypto-casino brand", "Help center available", "Trust signals require caution"],
    regulator: "Multiple/offshore licensing history, verify current entity",
    licenseInfo: "BC.Game has public materials around licensing changes and international operations. Because licensing has changed publicly, verify the current operating entity, regulator, and license status from the live legal footer before using a final badge.",
    areaRegulations: "BC.Game availability varies by country and product. Users must check local gambling law and the live restricted-jurisdiction list before registering.",
    payoutSummary: "Normal crypto withdrawals may be quick, but large review-site complaint clusters mention account access, deposit, withdrawal, and support disputes.",
    supportQuality: "Large help center exists, but public review sentiment is mixed. Treat support quality as moderate-risk until you test account, KYC, and withdrawal escalation flows.",
    supportChannels: ["Help center", "Account support", "Live chat/community support to verify"],
    safetyFeatures: ["KYC/compliance reviews", "Restricted-market checks", "Responsible gambling tools to verify"],
    securityNotes: ["Verify current license after public license changes", "Review recent complaint patterns", "Avoid overclaiming payout reliability"],
    supportNotes: ["Public feedback often mentions account and withdrawal disputes", "Escalation quality needs manual testing"]
  },
  bitcasino: {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/bitcasino.io",
      lastUpdatedAt: now
    },
    highlights: ["Curacao Gaming Authority license disclosed", "24/7 support stated", "Long-running crypto casino"],
    regulator: "Curacao Gaming Authority",
    licenseInfo: "Bitcasino help pages identify Moon Technologies B.V. and disclose Curacao Gaming Authority license OGL/2023/111/0069, issued 01.07.2024 and extended until 25.12.2025.",
    areaRegulations: "Bitcasino terms define restricted jurisdictions as territories restricted by its gaming license. Users should check the current restricted-jurisdiction help page before registering.",
    payoutSummary: "Crypto withdrawals are central to the product, but KYC, AML, and restricted-jurisdiction checks can delay or block account actions.",
    supportQuality: "Bitcasino publicly states 24/7 support through live chat and email. Keep monitoring recent player reviews for KYC-loop and withdrawal complaints.",
    supportChannels: ["24/7 live chat", "Email support", "Help centre"],
    safetyFeatures: ["AML policy", "Self-exclusion terms", "Complaints process", "Responsible gambling resources"],
    securityNotes: ["License details disclosed in help center", "Restricted jurisdictions apply", "Complaint and self-exclusion docs available"],
    supportNotes: ["24/7 live chat stated", "Email route listed in help center"]
  },
  gamdom: {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/gamdom.com",
      lastUpdatedAt: now
    },
    highlights: ["Official rewards documentation", "Support email and live chat referenced", "Crypto casino and sportsbook"],
    regulator: "Offshore license, verify current legal footer",
    licenseInfo: "Gamdom public help content confirms rewards and support paths, but the current operating entity and license should be verified directly from the live legal footer before using a specific regulator badge.",
    areaRegulations: "Gamdom account limits and restrictions apply; users must follow the live terms, age requirements, and local gambling law. Do not use VPNs to bypass regional controls.",
    payoutSummary: "Crypto withdrawals can be fast, but player feedback frequently mentions KYC, account reviews, and reward disputes after risk checks.",
    supportQuality: "Help center is active and public Trustpilot responses reference live chat plus support@gamdom.com. Recent feedback is mixed, so support quality should be monitored with test tickets.",
    supportChannels: ["Help center", "Live chat", "support@gamdom.com"],
    safetyFeatures: ["Account limits and reviews", "Rewards-abuse controls", "KYC checks", "Responsible gambling controls to verify"],
    securityNotes: ["Verify live legal footer", "Account reviews can affect rewards and withdrawals", "Restrictions and abuse rules apply"],
    supportNotes: ["Live chat and email are referenced publicly", "Track response times before ranking"]
  },
  justcasino: {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/justcasino.com",
      lastUpdatedAt: now
    },
    highlights: ["Curacao license disclosed", "Large restricted-country list", "Support route needs testing"],
    regulator: "Curacao Gaming Authority",
    licenseInfo: "JustCasino terms disclose Just Entertainment B.V. as licensed and regulated by the Curacao Gaming Authority under license OGL/2024/164/0246. Re-check the active domain and terms before publishing final badge copy.",
    areaRegulations: "JustCasino terms list a very large restricted-country policy, including the United States, United Kingdom, France, Germany, Spain, Netherlands, Hungary, Portugal, Poland, Belgium, Curacao, and many more.",
    payoutSummary: "Payout speed should be verified against the live cashier and terms. Third-party reviews mention bonus small-print and withdrawal/support complaints, so avoid top ranking until checked.",
    supportQuality: "Support availability should be tested directly. Third-party pages describe live chat and email/ticket support, while the terms emphasize KYC and restriction enforcement.",
    supportChannels: ["Live chat to verify", "Email/ticket support to verify", "Terms/contact page"],
    safetyFeatures: ["Restricted-country policy", "KYC policy", "Responsible gambling tools to verify", "Security controls reported by review sites"],
    securityNotes: ["Curacao license disclosed in terms", "Large restricted market list", "Check bonus and win-limit terms"],
    supportNotes: ["Test live chat before publishing high score", "Monitor withdrawal complaint patterns"]
  },
  betpanda: {
    trustpilot: {
      score: "VERIFY_LIVE_TRUSTPILOT",
      reviewCount: "VERIFY_LIVE_REVIEW_COUNT",
      profileUrl: "https://www.trustpilot.com/review/betpandacasino.io",
      lastUpdatedAt: now
    },
    highlights: ["Crypto casino", "Country restriction guides found", "Manual license verification needed"],
    regulator: "Costa Rica data processing license reported by review sites",
    licenseInfo: "Third-party review sites describe BetPanda as operating with a Costa Rica registration or data-processing license rather than a strong gambling regulator. Verify the active legal footer before using a final regulator badge.",
    areaRegulations: "Third-party reviews list restricted countries including the United States and several high-risk or prohibited markets. Verify the live restricted-country list and local law before promotion.",
    payoutSummary: "Crypto withdrawals may be positioned as fast, but KYC can still be triggered and should be disclosed clearly.",
    supportQuality: "Public information is thinner than larger brands. Treat support quality as manual-review until live chat/email response time and escalation routes are tested.",
    supportChannels: ["Live chat/email to verify", "Account support flow", "Partner manager route if available"],
    safetyFeatures: ["Restricted-country checks", "KYC may be triggered", "Responsible gambling tools to verify"],
    securityNotes: ["Do not overclaim license strength", "Verify terms and operator before launch", "Check country eligibility before sending users"],
    supportNotes: ["Run a real support test", "Record cashier and KYC response quality"]
  }
};

export const casinos: Casino[] = [...coreCasinos, ...requestedCasinos].map((casino) => ({
  ...casino,
  ...researchedTrustProfiles[casino.slug]
}));

// External/public promo codes should be stored by the researcher or added to
// lib/external-promo-data.ts after verification. Affiliate-owned codes belong
// only in config/affiliateConfig.ts.
export const promoCodes: PromoCode[] = [];

export const reviews: Review[] = [];

export function getCasinoBySlug(slug: string) {
  return casinos.find((casino) => casino.slug === slug);
}

export function getReviewsForCasino(slug: string) {
  return reviews.filter((review) => review.casinoSlug === slug);
}
