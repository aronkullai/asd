-- Add production verification fields for real, admin-curated promo codes.
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "maxUses" INTEGER;
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "usesSoFar" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "region" TEXT;
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- Hide and remove old mock/demo promo rows so user-facing pages cannot show fabricated codes.
DELETE FROM "PromoCodeHistory" WHERE "sourceId" IN ('MockSourceA', 'MockSourceB', 'MockSourceC', 'StaticPromoSeed');
DELETE FROM "PromoCodeChange" WHERE "promoCodeId" IN (
  SELECT "id" FROM "PromoCode" WHERE "sourceId" IN ('MockSourceA', 'MockSourceB', 'MockSourceC', 'StaticPromoSeed')
);
DELETE FROM "PromoCode" WHERE "sourceId" IN ('MockSourceA', 'MockSourceB', 'MockSourceC', 'StaticPromoSeed');

-- Remove seeded placeholder reviews generated for layout testing.
DELETE FROM "Review"
WHERE "id" LIKE 'seed_review_%'
   OR "text" ILIKE '%placeholder seed content%'
   OR "body" ILIKE '%placeholder seed content%'
   OR "adminNote" ILIKE '%Seeded placeholder%'
   OR "text" ILIKE '%Placeholder internal review%'
   OR "body" ILIKE '%Placeholder internal review%';

CREATE TABLE IF NOT EXISTS "PromoCodeCheckLog" (
  "id" TEXT NOT NULL,
  "promoCodeId" TEXT,
  "casinoSlug" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "message" TEXT,
  "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PromoCodeCheckLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PromoCode_casinoSlug_isVerified_isActive_idx" ON "PromoCode"("casinoSlug", "isVerified", "isActive");
CREATE INDEX IF NOT EXISTS "PromoCodeCheckLog_promoCodeId_checkedAt_idx" ON "PromoCodeCheckLog"("promoCodeId", "checkedAt");
CREATE INDEX IF NOT EXISTS "PromoCodeCheckLog_casinoSlug_checkedAt_idx" ON "PromoCodeCheckLog"("casinoSlug", "checkedAt");

ALTER TABLE "PromoCodeCheckLog"
  ADD CONSTRAINT "PromoCodeCheckLog_promoCodeId_fkey"
  FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
