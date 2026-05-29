import type { Casino } from "@/lib/types";
import type { PromoCodeInput } from "@/lib/promo-code-validation";

export type PromoSourceProvider = {
  id: string;
  label: string;
  fetchPromoCodesForCasino: (casino: Casino) => Promise<PromoCodeInput[]>;
};

