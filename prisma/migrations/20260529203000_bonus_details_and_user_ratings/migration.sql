ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "benefitTitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "benefitDescription" TEXT;
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "bonusType" TEXT;
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "minDeposit" INTEGER;
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "wageringRequirements" TEXT;
ALTER TABLE "PromoCode" ADD COLUMN IF NOT EXISTS "sourceSiteId" TEXT;

UPDATE "PromoCode"
SET
  "benefitTitle" = CASE WHEN "benefitTitle" = '' THEN "label" ELSE "benefitTitle" END,
  "benefitDescription" = COALESCE("benefitDescription", "description"),
  "bonusType" = COALESCE("bonusType", 'Promo code'),
  "wageringRequirements" = COALESCE("wageringRequirements", "conditions"),
  "sourceSiteId" = COALESCE("sourceSiteId", "sourceId");

CREATE TABLE IF NOT EXISTS "UserRating" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "casinoId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserRating_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserRating_userId_casinoId_key" ON "UserRating"("userId", "casinoId");
CREATE INDEX IF NOT EXISTS "UserRating_casinoId_createdAt_idx" ON "UserRating"("casinoId", "createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'UserRating_userId_fkey'
  ) THEN
    ALTER TABLE "UserRating"
    ADD CONSTRAINT "UserRating_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'UserRating_casinoId_fkey'
  ) THEN
    ALTER TABLE "UserRating"
    ADD CONSTRAINT "UserRating_casinoId_fkey"
    FOREIGN KEY ("casinoId") REFERENCES "Casino"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
