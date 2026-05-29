import type { Casino } from "@/lib/types";

export type ExternalPromoCodeResult = {
  code: string;
  label: string;
  description?: string;
  conditions?: string;
  discoveredAt: string;
  sourceId: string;
  estimatedValue?: number;
  priority?: number;
  validFrom?: string;
  validUntil?: string;
};

export type ExternalPromoSource = {
  id: string;
  fetchCodesForCasino: (casino: Casino, context?: { sourceUrls?: string[] }) => Promise<ExternalPromoCodeResult[]>;
};
