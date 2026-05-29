import type { ExternalPromoSource } from "@/lib/promo-sources/types";

export const mockSourceA: ExternalPromoSource = {
  id: "MockSourceA",
  async fetchCodesForCasino() {
    // Placeholder provider. Replace with approved API/RSS/partner dashboard
    // logic later. Do not add aggressive scraping here.
    return [];
  }
};
