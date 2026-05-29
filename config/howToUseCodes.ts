export type CodeUseGuide = {
  casinoSlug: string;
  intro: string;
  steps: string[];
};

const defaultSteps = [
  "Copy the code from PromoGuard.",
  "Open the casino using the PromoGuard button so you land on the official registration flow.",
  "Create a new account and complete any required email, age, or KYC checks.",
  "Enter the code in the promo, referral, rewards, cashier, or bonus-code field before depositing.",
  "Confirm the live bonus terms, then make any qualifying deposit and check the bonus wallet or rewards area."
];

export const codeUseGuides: CodeUseGuide[] = [
  {
    casinoSlug: "stake",
    intro: "Stake welcome codes are entered from the account offers area and usually must be added shortly after account creation.",
    steps: ["Copy the code.", "Open Stake and register.", "Open the account offers page within the eligible new-account window.", "Paste the code and submit it.", "Check whether rakeback or welcome rewards appear before wagering."]
  },
  {
    casinoSlug: "bitcasino",
    intro: "Bitcasino codes are usually claimed from the Rewards area after signing in.",
    steps: ["Copy the code.", "Open Bitcasino and sign in or create an account.", "Open Deposit or your balance menu, then go to Rewards.", "Choose Claim reward, paste the code, and submit.", "If accepted, activate it from My Rewards before playing."]
  },
  {
    casinoSlug: "shuffle",
    intro: "Shuffle codes are usually entered during registration or the first-deposit flow.",
    steps: ["Copy the code.", "Open Shuffle and start registration.", "Paste the code in the promo/referral field if it is not prefilled.", "Complete signup and any verification prompts.", "Make the qualifying first deposit only after checking the displayed terms."]
  }
];

export function getCodeUseGuide(slug: string) {
  return codeUseGuides.find((guide) => guide.casinoSlug === slug) ?? {
    casinoSlug: slug,
    intro: "Most casino promo codes are entered during registration, cashier deposit, or the rewards/bonus page.",
    steps: defaultSteps
  };
}
