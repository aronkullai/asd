import type { ExternalPromoCode } from "@/lib/types";

/**
 * Local fallback for public/third-party promo codes discovered outside PromoGuard.
 *
 * Keep this empty in production unless a code has genuinely been found and verified.
 * The background researcher can also write external codes to PostgreSQL. These
 * codes are NEVER allowed to provide or change affiliate links.
 */
export const externalPromoCodes: ExternalPromoCode[] = [];
