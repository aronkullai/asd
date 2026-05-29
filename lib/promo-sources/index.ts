import { publicPromoPageSource } from "@/lib/promo-sources/publicPromoPageSource";
import type { ExternalPromoSource } from "@/lib/promo-sources/types";

export const promoSources: Record<string, ExternalPromoSource> = {
  [publicPromoPageSource.id]: publicPromoPageSource
};

export function getPromoSourceById(id: string) {
  return promoSources[id];
}
