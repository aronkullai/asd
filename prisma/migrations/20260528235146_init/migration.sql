-- CreateTable
CREATE TABLE "Casino" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "affiliateLink" TEXT NOT NULL,
    "trustpilotProfileUrl" TEXT NOT NULL,
    "promoFetchSourceType" TEXT NOT NULL DEFAULT 'manual',
    "promoFetchSourceUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Casino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "casinoId" TEXT,
    "casinoSlug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "benefit" TEXT NOT NULL,
    "description" TEXT,
    "conditions" TEXT,
    "source" TEXT NOT NULL DEFAULT 'external',
    "sourceId" TEXT NOT NULL DEFAULT 'External',
    "isAffiliateOwned" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "estimatedValue" INTEGER,
    "requirements" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "discoveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "casinoSlug" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustpilotMeta" (
    "id" TEXT NOT NULL,
    "casinoSlug" TEXT NOT NULL,
    "businessUnitId" TEXT,
    "score" TEXT NOT NULL,
    "stars" TEXT,
    "reviewCount" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "latestReviews" JSONB,
    "lastFetchedAt" TIMESTAMP(3),
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustpilotMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCodeChange" (
    "id" TEXT NOT NULL,
    "casinoSlug" TEXT NOT NULL,
    "promoCodeId" TEXT,
    "oldCode" TEXT,
    "newCode" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoCodeChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCodeHistory" (
    "id" TEXT NOT NULL,
    "promoCodeId" TEXT,
    "casinoSlug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoCodeHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Casino_slug_key" ON "Casino"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_casinoSlug_code_sourceId_key" ON "PromoCode"("casinoSlug", "code", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "TrustpilotMeta_casinoSlug_key" ON "TrustpilotMeta"("casinoSlug");

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_casinoSlug_fkey" FOREIGN KEY ("casinoSlug") REFERENCES "Casino"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_casinoSlug_fkey" FOREIGN KEY ("casinoSlug") REFERENCES "Casino"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustpilotMeta" ADD CONSTRAINT "TrustpilotMeta_casinoSlug_fkey" FOREIGN KEY ("casinoSlug") REFERENCES "Casino"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCodeChange" ADD CONSTRAINT "PromoCodeChange_casinoSlug_fkey" FOREIGN KEY ("casinoSlug") REFERENCES "Casino"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCodeChange" ADD CONSTRAINT "PromoCodeChange_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCodeHistory" ADD CONSTRAINT "PromoCodeHistory_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
