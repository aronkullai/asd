import { getPromoSourceUrlsForCasino } from "@/config/researcherConfig";
import { normalizeExternalUrl } from "@/lib/format";
import type { ExternalPromoSource, ExternalPromoCodeResult } from "@/lib/promo-sources/types";

const REQUEST_TIMEOUT_MS = 12000;
const MAX_PAGE_BYTES = 500_000;
const CODE_PATTERN = /\b[A-Z0-9][A-Z0-9_-]{2,23}\b/g;
const CODE_LABEL_PATTERN = /\b(?:promo|bonus|coupon|referral|offer|voucher)\s+code\b|\bcode\b/i;
const BAD_CODE_TOKENS = new Set([
  "ABOUT",
  "ACCOUNT",
  "BONUS",
  "CASINO",
  "COOKIE",
  "COOKIES",
  "EMAIL",
  "ERROR",
  "LOGIN",
  "OFFER",
  "PROMO",
  "REVIEW",
  "SIGN",
  "TERMS",
  "WELCOME"
]);

type Candidate = {
  code: string;
  context: string;
  sourceUrl: string;
  priority: number;
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, "\"")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCode(code: string) {
  return code.trim().replace(/[^A-Za-z0-9_-]/g, "").toUpperCase();
}

function isPlausibleCode(code: string) {
  const normalized = normalizeCode(code);
  if (normalized.length < 3 || normalized.length > 24) return false;
  if (BAD_CODE_TOKENS.has(normalized)) return false;
  if (/^\d+$/.test(normalized)) return false;
  if (/^[A-F0-9]{16,}$/.test(normalized)) return false;

  return /[A-Z]/.test(normalized);
}

function getContext(text: string, index: number, size = 140) {
  return text.slice(Math.max(0, index - size), Math.min(text.length, index + size)).trim();
}

function scoreCandidate(context: string, casinoName: string) {
  let score = 0;
  if (CODE_LABEL_PATTERN.test(context)) score += 50;
  if (/\b(?:deposit|welcome|bonus|free spins|cashback|wagering|new players?)\b/i.test(context)) score += 20;
  if (new RegExp(casinoName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(context)) score += 10;
  if (/\b(?:expired|invalid|not working|ended)\b/i.test(context)) score -= 40;
  return score;
}

async function fetchText(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml,application/json;q=0.8,text/plain;q=0.7,*/*;q=0.5",
        "user-agent": "PromoGuardBot/1.0 (+https://promoguard.local; promo-code verification)"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Fetch failed for ${url}: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!/text|html|json|xml/i.test(contentType)) {
      throw new Error(`Skipped ${url}: unsupported content type ${contentType || "unknown"}`);
    }

    const text = await response.text();
    return text.slice(0, MAX_PAGE_BYTES);
  } finally {
    clearTimeout(timeout);
  }
}

function extractCandidates(rawText: string, sourceUrl: string, casinoName: string) {
  const text = stripHtml(rawText);
  const candidates: Candidate[] = [];

  for (const match of text.matchAll(CODE_PATTERN)) {
    const code = normalizeCode(match[0]);
    if (!isPlausibleCode(code) || match.index === undefined) continue;

    const context = getContext(text, match.index);
    const priority = scoreCandidate(context, casinoName);

    if (priority > 0) {
      candidates.push({ code, context, sourceUrl, priority });
    }
  }

  return candidates;
}

function toResult(candidate: Candidate, casinoSlug: string): ExternalPromoCodeResult {
  return {
    code: candidate.code,
    label: `${candidate.code} promo code`,
    description: candidate.context,
    conditions: `Verify terms on source page: ${candidate.sourceUrl}`,
    discoveredAt: new Date().toISOString(),
    sourceId: "PublicPromoPage",
    priority: candidate.priority,
    estimatedValue: undefined
  };
}

export const publicPromoPageSource: ExternalPromoSource = {
  id: "PublicPromoPage",
  async fetchCodesForCasino(casino, context) {
    const urls = (context?.sourceUrls?.length ? context.sourceUrls : getPromoSourceUrlsForCasino(casino.slug))
      .map(normalizeExternalUrl)
      .filter((url): url is string => Boolean(url));

    if (!urls.length) return [];

    const allCandidates: Candidate[] = [];

    for (const url of urls) {
      const text = await fetchText(url);
      allCandidates.push(...extractCandidates(text, url, casino.name));
    }

    const bestByCode = new Map<string, Candidate>();
    for (const candidate of allCandidates) {
      const existing = bestByCode.get(candidate.code);
      if (!existing || candidate.priority > existing.priority) {
        bestByCode.set(candidate.code, candidate);
      }
    }

    return Array.from(bestByCode.values())
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 12)
      .map((candidate) => toResult(candidate, casino.slug));
  }
};
