import { getPromoSourceUrlsForCasino, getResearcherCronExpression, researcherConfig } from "@/config/researcherConfig";
import { getCasinosWithDbOverrides } from "@/lib/casino-service";
import { checkPromoCodeValidity } from "@/lib/promo-code-checker";
import { syncPromoSourcesForCasino } from "@/lib/promo-source-sync";
import { prisma } from "@/lib/prisma";

type PromoResearchResult = {
  casinoSlug: string;
  checkedAt: string;
  checked: number;
  confirmed: number;
  deactivated: number;
  needsManualReview: number;
  errors: string[];
  note: string;
};

type PromoResearchOptions = {
  sourceUrls?: string[];
};

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

function logResearch(event: string, payload: Record<string, unknown>) {
  console.log(JSON.stringify({ scope: "promoResearcher", event, at: new Date().toISOString(), ...payload }));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runPromoResearcherOnce(casinoSlug?: string, options: PromoResearchOptions = {}): Promise<PromoResearchResult[]> {
  const checkedAt = new Date();

  if (!hasUsableDatabaseUrl()) {
    return [{
      casinoSlug: casinoSlug || "all",
      checkedAt: checkedAt.toISOString(),
      checked: 0,
      confirmed: 0,
      deactivated: 0,
      needsManualReview: 0,
      errors: ["DATABASE_URL is not configured."],
      note: "No promo codes were checked."
    }];
  }

  const casinoList = await getCasinosWithDbOverrides();
  const targetSlugs = casinoSlug ? [casinoSlug] : casinoList.map((casino) => casino.slug);
  logResearch("run-started", { casinoSlug: casinoSlug || "all", casinoCount: targetSlugs.length });

  const results: PromoResearchResult[] = [];

  for (const slug of targetSlugs) {
    const casino = casinoList.find((item) => item.slug === slug);
    if (!casino) continue;

    const promos = await prisma.promoCode.findMany({
      where: { casinoSlug: slug, isVerified: true },
      orderBy: [{ isAffiliateOwned: "desc" }, { priority: "desc" }, { lastUpdatedAt: "desc" }]
    });

    let confirmed = 0;
    let deactivated = 0;
    let needsManualReview = 0;
    const errors: string[] = [];
    const overrideUrls = options.sourceUrls?.length ? options.sourceUrls : getPromoSourceUrlsForCasino(slug);

    const syncResults = await syncPromoSourcesForCasino(casino);
    for (const syncResult of syncResults) {
      if (syncResult.errors.length) errors.push(...syncResult.errors.map((error) => `${syncResult.sourceId}: ${error}`));
    }

    const refreshedPromos = await prisma.promoCode.findMany({
      where: { casinoSlug: slug, isVerified: true },
      orderBy: [{ priority: "desc" }, { lastUpdatedAt: "desc" }]
    });

    for (const promo of refreshedPromos) {
      const result = await checkPromoCodeValidity(
        {
          casinoSlug: slug,
          casinoName: casino.name,
          code: promo.code,
          validFrom: promo.validFrom,
          validUntil: promo.validUntil,
          maxUses: promo.maxUses,
          usesSoFar: promo.usesSoFar
        },
        overrideUrls
      );

      const isActive = result.shouldDeactivate ? false : promo.isActive;
      await prisma.promoCode.update({
        where: { id: promo.id },
        data: { isActive, lastCheckedAt: checkedAt, lastUpdatedAt: result.shouldDeactivate ? checkedAt : promo.lastUpdatedAt }
      });

      await prisma.promoCodeCheckLog.create({
        data: {
          promoCodeId: promo.id,
          casinoSlug: slug,
          code: promo.code,
          sourceId: promo.sourceId,
          status: result.status,
          message: result.message,
          checkedAt
        }
      });

      logResearch("code-checked", {
        casinoSlug: slug,
        promoCodeId: promo.id,
        code: promo.code,
        status: result.status,
        active: isActive
      });

      if (result.status === "confirmed") confirmed += 1;
      if (result.shouldDeactivate) deactivated += 1;
      if (["not-found", "unchecked", "not-yet-active"].includes(result.status)) needsManualReview += 1;
      if (result.status === "error") errors.push(`${promo.code}: ${result.message}`);

      await delay(researcherConfig.delayBetweenChecksMs);
    }

    results.push({
      casinoSlug: slug,
      checkedAt: checkedAt.toISOString(),
      checked: refreshedPromos.length,
      confirmed,
      deactivated,
      needsManualReview,
      errors,
      note: "External source sync and validation run completed."
    });
  }

  logResearch("run-ended", { persisted: true, casinoCount: results.length });
  return results;
}

export function getPromoResearcherSchedule() {
  return getResearcherCronExpression();
}
