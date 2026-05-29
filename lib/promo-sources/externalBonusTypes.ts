import type { Casino } from "@/lib/types";

export type ExternalBonusResult = {
  code: string;
  benefitTitle: string;
  benefitDescription?: string;
  bonusType?: string;
  minDeposit?: number | null;
  wageringRequirements?: string | null;
  validFrom?: Date | null;
  validUntil?: Date | null;
  sourceSiteId: string;
};

export type ExternalBonusSource = {
  id: string;
  fetchCodesForCasino: (casino: Casino) => Promise<ExternalBonusResult[]>;
};
