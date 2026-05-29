ALTER TABLE "Review"
ADD COLUMN "source" TEXT NOT NULL DEFAULT 'PromoGuard user',
ADD COLUMN "authorName" TEXT,
ADD COLUMN "title" TEXT,
ADD COLUMN "body" TEXT,
ADD COLUMN "externalUrl" TEXT,
ADD COLUMN "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "adminNote" TEXT;

UPDATE "Review"
SET "authorName" = "reviewerName",
    "body" = "text"
WHERE "authorName" IS NULL;

CREATE INDEX "Review_casinoSlug_source_idx" ON "Review"("casinoSlug", "source");
CREATE INDEX "Review_casinoSlug_isHighlighted_idx" ON "Review"("casinoSlug", "isHighlighted");
