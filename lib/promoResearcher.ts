import { getAffiliateConfigBySlug } from "@/config/affiliateConfig";
import { getEnabledSourcesForCasino, getResearcherCronExpression, researcherConfig } from "@/config/researcherConfig";
import { casinos } from "@/lib/casino-data";
import { prisma } from "@/lib/prisma";
import { getPromoSourceById } from "@/lib/promo-sources";
import type { ExternalPromoCodeResult } from "@/lib/promo-sources/types";
import type { Casino } from "@/lib/types";

type PromoResearchResult = {
  casinoSlug: string;
  checkedAt: string;
  sourceResults: Array<{ sourceId: string; fetched: number; added: number; updated: number; errors: string[] }>;
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

async function withRetry<T>(operation: () => Promise<T>, maxRetries: number) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await delay(250 * 2 ** attempt);
      }
    }
  }

  throw lastError;
}

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

function toPromoId(casinoSlug: string, sourceId: string, code: string) {
  return `external_${casinoSlug}_${sourceId}_${normalizeCode(code).replace(/[^A-Z0-9]+/g, "_")}`;
}

async function ensureCasinoForResearch(casino: Casino) {
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
      id: casino.id,
      name: casino.name,
      slug: casino.slug,
      affiliateLink: affiliateConfig?.affiliateLink || "",
      trustpilotProfileUrl: casino.trustpilot.profileUrl,
      promoFetchSourceType: casino.fetchMetadata.sourceType,
      promoFetchSourceUrl: casino.fetchMetadata.sourceUrl
    }
  });
}

async function upsertExternalPromo(casino: Casino, result: ExternalPromoCodeResult) {
  const now = new Date();
  const code = normalizeCode(result.code);
  const id = toPromoId(casino.slug, result.sourceId, code);
  const validUntil = result.validUntil ? new Date(result.validUntil) : null;
  const appearsExpired = Boolean(validUntil && validUntil.getTime() < now.getTime());

  const existing = await prisma.promoCode.findUnique({ where: { id } });
  const data = {
    casinoId: casino.id,
    casinoSlug: casino.slug,
    code,
    label: result.label,
    benefit: result.description || result.label,
    description: result.description,
    conditions: result.conditions,
    source: result.sourceId,
    sourceId: result.sourceId,
    isAffiliateOwned: false,
    priority: result.priority || 0,
    estimatedValue: result.estimatedValue,
    requirements: result.conditions || "Conditions pending verification",
    validFrom: result.validFrom ? new Date(result.validFrom) : null,
    validUntil,
    isActive: !appearsExpired,
    discoveredAt: new Date(result.discoveredAt),
    lastCheckedAt: now,
    lastUpdatedAt: existing ? now : new Date(result.discoveredAt)
  };

  const promo = await prisma.promoCode.upsert({
    where: { id },
    update: data,
    create: { id, ...data }
  });

  await prisma.promoCodeHistory.create({
    data: {
      promoCodeId: promo.id,
      casinoSlug: casino.slug,
      code,
      sourceId: result.sourceId,
      action: existing ? "updated" : "added",
      before: existing || undefined,
      after: data,
      message: existing ? "External promo code refreshed by researcher." : "External promo code discovered by researcher."
    }
  });

  if (existing) {
    await prisma.promoCodeChange.create({
      data: {
        casinoSlug: casino.slug,
        promoCodeId: promo.id,
        oldCode: existing.code,
        newCode: code,
        changeType: "external-code-refreshed"
      }
    });
  }

  return { added: existing ? 0 : 1, updated: existing ? 1 : 0 };
}

async function markMissingCodesInactive(casinoSlug: string, sourceId: string, seenCodes: string[]) {
  const activeCodes = await prisma.promoCode.findMany({
    where: { casinoSlug, sourceId, isAffiliateOwned: false, isActive: true }
  });

  const seen = new Set(seenCodes.map(normalizeCode));
  const missing = activeCodes.filter((promo) => !seen.has(normalizeCode(promo.code)));

  for (const promo of missing) {
    await prisma.promoCode.update({
      where: { id: promo.id },
      data: { isActive: false, lastCheckedAt: new Date() }
    });
    await prisma.promoCodeHistory.create({
      data: {
        promoCodeId: promo.id,
        casinoSlug,
        code: promo.code,
        sourceId,
        action: "marked-inactive",
        before: promo,
        after: { ...promo, isActive: false },
        message: "Code was not returned by the source during the latest run."
      }
    });
  }
}

async function runSourceForCasino(casino: Casino, sourceId: string, options: PromoResearchOptions = {}) {
  const source = getPromoSourceById(sourceId);
  const errors: string[] = [];
  let added = 0;
  let updated = 0;

  if (!source) {
    return { sourceId, fetched: 0, added, updated, errors: [`Unknown source ${sourceId}`] };
  }

  try {
    const fetched = await withRetry(
      () => source.fetchCodesForCasino(casino, { sourceUrls: options.sourceUrls }),
      researcherConfig.maxRetriesPerRun
    );
    const deduped = Array.from(new Map(fetched.map((promo) => [`${normalizeCode(promo.code)}:${promo.sourceId}`, promo])).values());

    for (const promo of deduped) {
      const counts = await upsertExternalPromo(casino, promo);
      added += counts.added;
      updated += counts.updated;
    }

    await markMissingCodesInactive(
      casino.slug,
      sourceId,
      deduped.map((promo) => promo.code)
    );

    return { sourceId, fetched: deduped.length, added, updated, errors };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown source error");
    return { sourceId, fetched: 0, added, updated, errors };
  }
}

export async function runPromoResearcherOnce(casinoSlug?: string, options: PromoResearchOptions = {}): Promise<PromoResearchResult[]> {
  const targetCasinos = casinoSlug ? casinos.filter((casino) => casino.slug === casinoSlug) : casinos;
  const checkedAt = new Date().toISOString();

  logResearch("run-started", { casinoSlug: casinoSlug || "all", casinoCount: targetCasinos.length });

  if (!hasUsableDatabaseUrl()) {
    const results = targetCasinos.map((casino) => ({
      casinoSlug: casino.slug,
      checkedAt,
      sourceResults: [],
      note: "DATABASE_URL is not configured, so no external promo codes were written."
    }));
    logResearch("run-ended", { persisted: false, casinoCount: targetCasinos.length });
    return results;
  }

  const results: PromoResearchResult[] = [];

  for (const casino of targetCasinos) {
    await ensureCasinoForResearch(casino);
    const enabledSources = getEnabledSourcesForCasino(casino.slug);
    const sourceResults = [];

    for (const sourceId of enabledSources) {
      logResearch("source-started", { casinoSlug: casino.slug, sourceId });
      sourceResults.push(await runSourceForCasino(casino, sourceId, options));
      await delay(researcherConfig.delayBetweenCallsMs);
    }

    results.push({
      casinoSlug: casino.slug,
      checkedAt,
      sourceResults,
      note: "Researcher run completed. External codes only; affiliate links were not touched."
    });
  }

  logResearch("run-ended", { persisted: true, casinoCount: targetCasinos.length });
  return results;
}

export function getPromoResearcherSchedule() {
  return getResearcherCronExpression();
}
