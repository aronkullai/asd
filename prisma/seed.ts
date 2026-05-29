import { PrismaClient } from "@prisma/client";
import { casinos, promoCodes, reviews } from "../lib/casino-data";
import { getAffiliateConfigBySlug } from "../config/affiliateConfig";

const prisma = new PrismaClient();

async function main() {
  for (const casino of casinos) {
    const affiliateConfig = getAffiliateConfigBySlug(casino.slug);

    await prisma.casino.upsert({
      where: { slug: casino.slug },
      update: {
        name: casino.name,
        trustpilotProfileUrl: casino.trustpilot.profileUrl,
        promoFetchSourceType: casino.fetchMetadata.sourceType,
        promoFetchSourceUrl: casino.fetchMetadata.sourceUrl
      },
      create: {
        name: casino.name,
        slug: casino.slug,
        affiliateLink: affiliateConfig?.affiliateLink || "",
        trustpilotProfileUrl: casino.trustpilot.profileUrl,
        promoFetchSourceType: casino.fetchMetadata.sourceType,
        promoFetchSourceUrl: casino.fetchMetadata.sourceUrl
      }
    });

    await prisma.trustpilotMeta.upsert({
      where: { casinoSlug: casino.slug },
      update: {
        score: casino.trustpilot.score,
        reviewCount: casino.trustpilot.reviewCount,
        profileUrl: casino.trustpilot.profileUrl,
        lastUpdatedAt: new Date(casino.trustpilot.lastUpdatedAt)
      },
      create: {
        casinoSlug: casino.slug,
        score: casino.trustpilot.score,
        reviewCount: casino.trustpilot.reviewCount,
        profileUrl: casino.trustpilot.profileUrl,
        lastUpdatedAt: new Date(casino.trustpilot.lastUpdatedAt)
      }
    });
  }

  for (const promo of promoCodes) {
    await prisma.promoCode.upsert({
      where: { id: promo.id },
      update: {
        code: promo.code,
        label: promo.label,
        benefit: promo.benefit,
        description: promo.description,
        conditions: promo.conditions,
        source: promo.source,
        sourceId: promo.sourceId || promo.source,
        isAffiliateOwned: promo.isAffiliateOwned,
        priority: promo.priority || 0,
        estimatedValue: promo.estimatedValue,
        validFrom: null,
        validUntil: null,
        discoveredAt: new Date(promo.lastUpdatedAt),
        requirements: promo.requirements,
        isActive: promo.isActive,
        lastCheckedAt: new Date(promo.lastCheckedAt),
        lastUpdatedAt: new Date(promo.lastUpdatedAt)
      },
      create: {
        id: promo.id,
        casinoSlug: promo.casinoSlug,
        casinoId: promo.casinoSlug,
        code: promo.code,
        label: promo.label,
        benefit: promo.benefit,
        description: promo.description,
        conditions: promo.conditions,
        source: promo.source,
        sourceId: promo.sourceId || promo.source,
        isAffiliateOwned: promo.isAffiliateOwned,
        priority: promo.priority || 0,
        estimatedValue: promo.estimatedValue,
        validFrom: null,
        validUntil: null,
        discoveredAt: new Date(promo.lastUpdatedAt),
        requirements: promo.requirements,
        isActive: promo.isActive,
        lastCheckedAt: new Date(promo.lastCheckedAt),
        lastUpdatedAt: new Date(promo.lastUpdatedAt)
      }
    });
  }

  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {
        reviewerName: review.reviewerName,
        rating: review.rating,
        text: review.text,
        reviewedAt: new Date(review.date)
      },
      create: {
        id: review.id,
        casinoSlug: review.casinoSlug,
        reviewerName: review.reviewerName,
        rating: review.rating,
        text: review.text,
        reviewedAt: new Date(review.date)
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
