export type PartnerRegistrationBonus = {
  casinoSlug: string;
  title: string;
  description: string;
  isActive?: boolean;
};

export const partnerRegistrationBonuses: PartnerRegistrationBonus[] = [
  {
    casinoSlug: "stake",
    title: "Partner-code welcome rakeback",
    description: "Stake's help center says eligible new users can unlock rakeback by entering a valid affiliate/welcome offer code shortly after creating an account.",
    isActive: true
  },
  {
    casinoSlug: "gamdom",
    title: "Affiliate-code rewards eligibility",
    description: "Gamdom's help center says adding an affiliate code can make eligible users able to claim rewards associated with that code, including promo codes, free spins, and reload bonuses.",
    isActive: true
  }
];

export function getPartnerRegistrationBonus(slug: string) {
  return partnerRegistrationBonuses.find((bonus) => bonus.casinoSlug === slug && bonus.isActive !== false) ?? null;
}
