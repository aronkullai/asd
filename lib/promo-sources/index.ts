import { curatedConfigPromoSource } from "@/lib/promo-sources/curatedConfig";
import { externalApiPromoSource } from "@/lib/promo-sources/externalApi";
import type { PromoSourceProvider } from "@/lib/promo-sources/types";

export const promoSources: PromoSourceProvider[] = [
  curatedConfigPromoSource,
  externalApiPromoSource
];

