import { getAffiliateConfigBySlug } from "@/config/affiliateConfig";
import { casinos as staticCasinos, getCasinoBySlug } from "@/lib/casino-data";
import { prisma } from "@/lib/prisma";
import type { Casino } from "@/lib/types";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

function splitList(value?: string | null) {
  return (value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isPlaceholderText(value?: string | null) {
  const text = (value || "").trim();
  if (!text) return true;

  return (
    text.startsWith("Add verified") ||
    text.startsWith("ADD_") ||
    text.startsWith("Verify license directly") ||
    text.startsWith("Verify responsible gambling") ||
    text.startsWith("Add license") ||
    text.startsWith("Add security") ||
    text.startsWith("Add account") ||
    text.startsWith("Add support") ||
    text.startsWith("Add response")
  );
}

function pickOverride(value: string | null | undefined, fallback: string | undefined) {
  return isPlaceholderText(value) ? fallback || "" : value || fallback || "";
}

function pickListOverride(value: string | null | undefined, fallback?: string[]) {
  const list = splitList(value);
  if (!list.length || list.every((item) => isPlaceholderText(item))) return fallback;
  return list;
}

function applyCasinoOverrides(casino: Casino, override?: {
  trustpilotProfileUrl: string;
  promoFetchSourceType: string;
  promoFetchSourceUrl: string;
  licenseInfo: string;
  areaRegulations: string;
  regulator: string;
  payoutSummary: string;
  supportQuality: string;
  supportChannels: string;
  safetyFeatures: string;
} | null): Casino {
  if (!override) return casino;

  return {
    ...casino,
    regulator: pickOverride(override.regulator, casino.regulator),
    licenseInfo: pickOverride(override.licenseInfo, casino.licenseInfo),
    areaRegulations: pickOverride(override.areaRegulations, casino.areaRegulations),
    payoutSummary: pickOverride(override.payoutSummary, casino.payoutSummary),
    supportQuality: pickOverride(override.supportQuality, casino.supportQuality),
    supportChannels: pickListOverride(override.supportChannels, casino.supportChannels),
    safetyFeatures: pickListOverride(override.safetyFeatures, casino.safetyFeatures),
    trustpilot: {
      ...casino.trustpilot,
      profileUrl: override.trustpilotProfileUrl || casino.trustpilot.profileUrl
    },
    fetchMetadata: {
      ...casino.fetchMetadata,
      sourceType: override.promoFetchSourceType as Casino["fetchMetadata"]["sourceType"],
      sourceUrl: override.promoFetchSourceUrl || casino.fetchMetadata.sourceUrl
    }
  };
}

export async function ensureCasinoRows() {
  if (!hasUsableDatabaseUrl()) return;

  for (const casino of staticCasinos) {
    const affiliateConfig = getAffiliateConfigBySlug(casino.slug);
    await prisma.casino.upsert({
      where: { slug: casino.slug },
      update: {
        name: casino.name,
        affiliateLink: affiliateConfig?.affiliateLink || "",
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
  }
}

export async function getCasinosWithDbOverrides() {
  if (!hasUsableDatabaseUrl()) return staticCasinos;

  const overrides = await prisma.casino.findMany().catch(() => []);
  const bySlug = new Map(overrides.map((casino) => [casino.slug, casino]));
  return staticCasinos.map((casino) => applyCasinoOverrides(casino, bySlug.get(casino.slug)));
}

export async function getCasinoWithDbOverrides(slug: string) {
  const casino = getCasinoBySlug(slug);
  if (!casino || !hasUsableDatabaseUrl()) return casino;

  const override = await prisma.casino.findUnique({ where: { slug } }).catch(() => null);
  return applyCasinoOverrides(casino, override);
}
