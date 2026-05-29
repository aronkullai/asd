import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { curatedPromoCodes } from "../config/curatedPromoCodes";
import { casinos } from "../lib/casino-data";
import { validatePromoCodeInput } from "../lib/promo-code-validation";
import { getAffiliateConfigBySlug } from "../config/affiliateConfig";

const prisma = new PrismaClient();

const removedExpansionSlugs = [
  "betmgm-casino",
  "draftkings-casino",
  "fanduel-casino",
  "caesars-palace-online",
  "unibet-casino",
  "leovegas",
  "betway-casino",
  "888-casino",
  "bet365-casino",
  "pokerstars-casino"
];

async function main() {
  await prisma.promoCodeHistory.deleteMany({ where: { casinoSlug: { in: removedExpansionSlugs } } });
  await prisma.promoCodeCheckLog.deleteMany({ where: { casinoSlug: { in: removedExpansionSlugs } } });
  await prisma.casino.deleteMany({ where: { slug: { in: removedExpansionSlugs } } });
  await prisma.promoCode.deleteMany({
    where: {
      OR: [
        { isAffiliateOwned: true },
        { sourceId: { in: ["PromoGuardAffiliate", "ThirdPartyReported"] } }
      ]
    }
  });

  for (const casino of casinos) {
    const affiliateConfig = getAffiliateConfigBySlug(casino.slug);

    await prisma.casino.upsert({
      where: { slug: casino.slug },
      update: {
        name: casino.name,
        affiliateLink: affiliateConfig?.affiliateLink || "",
        trustpilotProfileUrl: casino.trustpilot.profileUrl,
        promoFetchSourceType: casino.fetchMetadata.sourceType,
        promoFetchSourceUrl: casino.fetchMetadata.sourceUrl,
        regulator: casino.regulator,
        licenseInfo: casino.licenseInfo || casino.regulator,
        areaRegulations: casino.areaRegulations || "",
        payoutSummary: casino.payoutSummary,
        supportQuality: casino.supportQuality,
        supportChannels: (casino.supportChannels || casino.supportNotes).join("\n"),
        safetyFeatures: (casino.safetyFeatures || casino.securityNotes).join("\n")
      },
      create: {
        id: casino.id,
        name: casino.name,
        slug: casino.slug,
        affiliateLink: affiliateConfig?.affiliateLink || "",
        trustpilotProfileUrl: casino.trustpilot.profileUrl,
        promoFetchSourceType: casino.fetchMetadata.sourceType,
        promoFetchSourceUrl: casino.fetchMetadata.sourceUrl,
        regulator: casino.regulator,
        licenseInfo: casino.licenseInfo || casino.regulator,
        areaRegulations: casino.areaRegulations || "",
        payoutSummary: casino.payoutSummary,
        supportQuality: casino.supportQuality,
        supportChannels: (casino.supportChannels || casino.supportNotes).join("\n"),
        safetyFeatures: (casino.safetyFeatures || casino.securityNotes).join("\n")
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

  for (const promo of curatedPromoCodes) {
    const validation = validatePromoCodeInput(promo);
    if (!validation.ok) {
      throw new Error(`Invalid curated promo code ${promo.casinoSlug}:${promo.code} - ${Object.values(validation.fieldErrors).join(" ")}`);
    }

    const casino = await prisma.casino.findUniqueOrThrow({ where: { slug: validation.normalized.casinoSlug } });
    const checkedAt = new Date();

    await prisma.promoCode.upsert({
      where: {
        casinoSlug_code_sourceId: {
          casinoSlug: validation.normalized.casinoSlug,
          code: validation.normalized.code,
          sourceId: validation.normalized.sourceId
        }
      },
      update: {
        ...validation.normalized,
        casinoId: casino.id,
        lastCheckedAt: checkedAt,
        lastUpdatedAt: checkedAt
      },
      create: {
        id: randomUUID(),
        casinoId: casino.id,
        ...validation.normalized,
        discoveredAt: checkedAt,
        lastCheckedAt: checkedAt,
        lastUpdatedAt: checkedAt
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
