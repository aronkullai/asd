export type NoCodeOffer = {
  casinoSlug: string;
  label: string;
  description: string;
  category: "tournament" | "raffle" | "cashback" | "rewards" | "promotion";
  source: string;
  sourceUrl: string;
  lastCheckedAt: string;
  priority?: number;
  isActive?: boolean;
};

export const noCodeOffers: NoCodeOffer[] = [
  {
    casinoSlug: "stake",
    label: "Weekly raffle, daily race, and chat drops",
    description: "Stake's help center lists ongoing promotions such as weekly raffles, race prizes, forum challenges, rains, trivia, and drop bonuses.",
    category: "raffle",
    source: "Stake Help Center",
    sourceUrl: "https://help.stake.com/en/articles/4942138-what-are-the-promotions-and-bonuses-that-stake-offers/",
    lastCheckedAt: "2026-05-29T00:00:00.000Z",
    priority: 90,
    isActive: true
  },
  {
    casinoSlug: "rainbet",
    label: "Promotion paths with free spins, deposit bonuses, and rewards",
    description: "Rainbet's promotions page shows selectable promotion paths where players can unlock free spins, deposit bonuses, and rewards through play.",
    category: "promotion",
    source: "Rainbet promotions page",
    sourceUrl: "https://rainbet.com/fr/promotions",
    lastCheckedAt: "2026-05-29T00:00:00.000Z",
    priority: 80,
    isActive: true
  },
  {
    casinoSlug: "spartans-casino",
    label: "CashRake and leaderboard promotions",
    description: "Spartans lists CashRake, daily leaderboard, and monthly leaderboard promotions. These are better represented as offer pages than static codes.",
    category: "cashback",
    source: "Spartans promotions page",
    sourceUrl: "https://spartans.com/promotions",
    lastCheckedAt: "2026-05-29T00:00:00.000Z",
    priority: 90,
    isActive: true
  },
  {
    casinoSlug: "shuffle",
    label: "SHFL Lottery and race promotions",
    description: "Shuffle's official promotions include SHFL Lottery mechanics, ticket races, and level-up rewards. These do not require a static promo code.",
    category: "raffle",
    source: "Shuffle promotions page",
    sourceUrl: "https://shuffle.com/promotions",
    lastCheckedAt: "2026-05-29T00:00:00.000Z",
    priority: 85,
    isActive: true
  },
  {
    casinoSlug: "bitcasino",
    label: "Rewards and tournaments",
    description: "Bitcasino's help center explains rewards from promotions, tournaments, Casino Boost, and loyalty status. Current offers are account/promo dependent.",
    category: "tournament",
    source: "Bitcasino Help Center",
    sourceUrl: "https://bitcasino.io/help-center/help-your-bonuses/bitcasino-bonus-system",
    lastCheckedAt: "2026-05-29T00:00:00.000Z",
    priority: 80,
    isActive: true
  },
  {
    casinoSlug: "betpanda",
    label: "Weekly cashback and weekend slot tournaments",
    description: "BetPanda content describes weekly cashback and weekend slot tournaments as recurring value paths, separate from static promo-code claims.",
    category: "cashback",
    source: "BetPanda content hub",
    sourceUrl: "https://betpandacasino.io/lp/betpanda-casino-review-bonuses-games-and-withdrawal-speed/",
    lastCheckedAt: "2026-05-29T00:00:00.000Z",
    priority: 75,
    isActive: true
  },
  {
    casinoSlug: "gamdom",
    label: "Rewards program and boosted instant rewards",
    description: "Gamdom's help center describes instant, weekly, monthly, and rank-based rewards plus boosted instant rewards for eligible new accounts.",
    category: "rewards",
    source: "Gamdom Help Center",
    sourceUrl: "https://help.gamdom.com/en/articles/10290516-gamdom-rewards",
    lastCheckedAt: "2026-05-29T00:00:00.000Z",
    priority: 85,
    isActive: true
  },
  {
    casinoSlug: "bc-game",
    label: "Rotating promo-code and new-player bonus system",
    description: "BC.Game's guide explains that promo codes and new-player bonuses rotate frequently; check the live offer screen after opening the site.",
    category: "promotion",
    source: "BC.Game guide",
    sourceUrl: "https://betting.bc.game/guidebook/promocodes/",
    lastCheckedAt: "2026-05-29T00:00:00.000Z",
    priority: 70,
    isActive: true
  },
  {
    casinoSlug: "celsius-casino",
    label: "Current promotion terms",
    description: "Celsius publishes bonus terms and notes that each active promotion has its own rules. Treat current on-site terms as the source of truth.",
    category: "promotion",
    source: "Celsius bonus terms",
    sourceUrl: "https://celsiuscasino.com/bonuses-terms",
    lastCheckedAt: "2026-05-29T00:00:00.000Z",
    priority: 70,
    isActive: true
  }
];

export function getNoCodeOffersForCasino(slug: string) {
  return noCodeOffers
    .filter((offer) => offer.casinoSlug === slug && offer.isActive !== false)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
