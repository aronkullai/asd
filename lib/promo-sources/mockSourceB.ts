import type { ExternalPromoSource } from "@/lib/promo-sources/types";

export const mockSourceB: ExternalPromoSource = {
  id: "MockSourceB",
  async fetchCodesForCasino() {
    // Placeholder provider for a second external source. Keep mocked/empty
    // until a source is approved and terms are reviewed.
    return [];
  }
};
