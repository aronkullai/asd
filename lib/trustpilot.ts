import { getTrustpilotConfigBySlug } from "@/config/trustpilotConfig";
import { isPlaceholder } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import type { TrustpilotReview, TrustpilotSummary } from "@/lib/types";

type OAuthToken = {
  accessToken: string;
  expiresAt: number;
};

type TrustpilotApiResult<T> = {
  data: T | null;
  error?: string;
};

const DATA_SOLUTIONS_BASE_URL = "https://datasolutions.trustpilot.com/v1";
const BUSINESS_API_BASE_URL = "https://api.trustpilot.com/v1";
const memorySummaryCache = new Map<string, { expiresAt: number; data: TrustpilotSummary }>();
const memoryReviewCache = new Map<string, { expiresAt: number; data: TrustpilotReview[] }>();
let oauthTokenCache: OAuthToken | null = null;

function getApiKey() {
  const value = process.env.TRUSTPILOT_API_KEY;
  return value && !isPlaceholder(value) ? value : null;
}

function getApiSecret() {
  const value = process.env.TRUSTPILOT_API_SECRET;
  return value && !isPlaceholder(value) ? value : null;
}

function cacheTtlMs() {
  return Number(process.env.TRUSTPILOT_CACHE_HOURS || 6) * 60 * 60 * 1000;
}

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

function apiKeyHeaders() {
  const apiKey = getApiKey();
  return apiKey ? { apikey: apiKey } : null;
}

async function trustpilotFetch<T>(url: string, options?: RequestInit): Promise<TrustpilotApiResult<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      // Trustpilot data is additionally cached in our DB/in-memory layer.
      cache: "no-store"
    });

    if (response.status === 401 || response.status === 403) return { data: null, error: "Trustpilot authorization failed." };
    if (response.status === 404) return { data: null, error: "Trustpilot business unit was not found." };
    if (response.status === 429) return { data: null, error: "Trustpilot rate limit reached." };
    if (!response.ok) return { data: null, error: `Trustpilot request failed with ${response.status}.` };

    return { data: (await response.json()) as T };
  } catch {
    return { data: null, error: "Trustpilot request failed." };
  }
}

export async function getTrustpilotOAuthAccessToken(): Promise<string | null> {
  const apiKey = getApiKey();
  const apiSecret = getApiSecret();

  if (!apiKey || !apiSecret) return null;
  if (oauthTokenCache && oauthTokenCache.expiresAt > Date.now() + 60_000) return oauthTokenCache.accessToken;

  const basicToken = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const response = await trustpilotFetch<{ access_token: string; expires_in: string | number }>(
    `${BUSINESS_API_BASE_URL}/oauth/oauth-business-users-for-applications/accesstoken`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicToken}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    }
  );

  if (!response.data?.access_token) return null;

  const expiresIn = Number(response.data.expires_in || 3600);
  oauthTokenCache = {
    accessToken: response.data.access_token,
    expiresAt: Date.now() + expiresIn * 1000
  };

  return oauthTokenCache.accessToken;
}

export async function resolveBusinessUnitIdFromDomain(domain: string): Promise<string | null> {
  const headers = apiKeyHeaders();
  if (!headers || !domain || isPlaceholder(domain)) return null;

  const url = new URL(`${BUSINESS_API_BASE_URL}/business-units/find`);
  url.searchParams.set("name", domain);

  const response = await trustpilotFetch<{ id?: string; businessUnit?: { id?: string }; businessUnits?: Array<{ id?: string }> }>(url.toString(), {
    headers
  });

  return response.data?.id || response.data?.businessUnit?.id || response.data?.businessUnits?.[0]?.id || null;
}

export async function getBusinessUnitSummary(businessUnitId: string, profileUrlFallback?: string | null): Promise<TrustpilotSummary | null> {
  const headers = apiKeyHeaders();
  if (!headers || !businessUnitId || isPlaceholder(businessUnitId)) return null;

  const response = await trustpilotFetch<{
    id?: string;
    score?: { trustScore?: number; stars?: number };
    numberOfReviews?: number;
    profileUrl?: string;
    urls?: { profileUrl?: string };
  }>(`${DATA_SOLUTIONS_BASE_URL}/business-units/${businessUnitId}`, { headers });

  if (!response.data?.id || typeof response.data.score?.trustScore !== "number") return null;

  return {
    businessUnitId: response.data.id,
    trustScore: response.data.score.trustScore,
    stars: response.data.score.stars ?? response.data.score.trustScore,
    reviewCount: response.data.numberOfReviews ?? 0,
    profileUrl: response.data.profileUrl || response.data.urls?.profileUrl || profileUrlFallback || null,
    lastFetchedAt: new Date().toISOString()
  };
}

export async function getLatestReviews(
  businessUnitId: string,
  options: { limit?: number } = {}
): Promise<TrustpilotReview[] | null> {
  const headers = apiKeyHeaders();
  if (!headers || !businessUnitId || isPlaceholder(businessUnitId)) return null;

  const limit = Math.min(Math.max(options.limit ?? 5, 1), 5);
  const url = new URL(`${DATA_SOLUTIONS_BASE_URL}/business-units/${businessUnitId}/reviews/latest`);
  url.searchParams.set("limit", String(limit));

  const response = await trustpilotFetch<{
    reviews?: Array<{
      id?: string;
      stars?: number;
      title?: string;
      text?: string;
      createdAt?: string;
      dates?: { createdAt?: string; experiencedAt?: string };
      consumer?: { displayName?: string; name?: string };
      links?: Array<{ href?: string; rel?: string }>;
    }>;
  }>(url.toString(), { headers });

  if (!response.data?.reviews) return null;

  return response.data.reviews.map((review, index) => ({
    id: review.id || `${businessUnitId}-${index}`,
    stars: review.stars ?? 0,
    title: review.title || "Trustpilot review",
    text: review.text || "",
    createdAt: review.createdAt || review.dates?.createdAt || review.dates?.experiencedAt || new Date().toISOString(),
    consumerName: review.consumer?.displayName || review.consumer?.name || "Verified user",
    reviewUrl: review.links?.find((link) => link.rel === "review" || link.rel === "self")?.href
  }));
}

export async function getCachedBusinessUnitSummary(slug: string): Promise<TrustpilotSummary | null> {
  const config = getTrustpilotConfigBySlug(slug);
  if (!config) return null;

  const now = Date.now();
  const cacheKey = `summary:${slug}`;
  const memoryCached = memorySummaryCache.get(cacheKey);
  if (memoryCached && memoryCached.expiresAt > now) return memoryCached.data;

  if (hasUsableDatabaseUrl()) {
    const cached = await prisma.trustpilotMeta.findUnique({ where: { casinoSlug: slug } });
    if (cached?.lastFetchedAt && now - cached.lastFetchedAt.getTime() < cacheTtlMs()) {
      return {
        businessUnitId: cached.businessUnitId || "",
        trustScore: Number(cached.score),
        stars: Number(cached.stars || cached.score),
        reviewCount: Number(cached.reviewCount),
        profileUrl: cached.profileUrl || config.profileUrl || null,
        lastFetchedAt: cached.lastFetchedAt.toISOString()
      };
    }
  }

  const businessUnitId =
    config.businessUnitId && !isPlaceholder(config.businessUnitId)
      ? config.businessUnitId
      : config.domain
        ? await resolveBusinessUnitIdFromDomain(config.domain)
        : null;

  if (!businessUnitId) return getManualTrustpilotSummary(slug);

  const summary = await getBusinessUnitSummary(businessUnitId, config.profileUrl);
  if (!summary) return getManualTrustpilotSummary(slug);

  memorySummaryCache.set(cacheKey, { data: summary, expiresAt: now + cacheTtlMs() });

  if (hasUsableDatabaseUrl()) {
    await prisma.trustpilotMeta.upsert({
      where: { casinoSlug: slug },
      update: {
        businessUnitId: summary.businessUnitId,
        score: String(summary.trustScore),
        stars: String(summary.stars),
        reviewCount: String(summary.reviewCount),
        profileUrl: summary.profileUrl || "",
        lastFetchedAt: new Date(summary.lastFetchedAt),
        lastUpdatedAt: new Date(summary.lastFetchedAt)
      },
      create: {
        casinoSlug: slug,
        businessUnitId: summary.businessUnitId,
        score: String(summary.trustScore),
        stars: String(summary.stars),
        reviewCount: String(summary.reviewCount),
        profileUrl: summary.profileUrl || "",
        lastFetchedAt: new Date(summary.lastFetchedAt),
        lastUpdatedAt: new Date(summary.lastFetchedAt)
      }
    });
  }

  return summary;
}

async function getManualTrustpilotSummary(slug: string): Promise<TrustpilotSummary | null> {
  if (!hasUsableDatabaseUrl()) return null;
  const cached = await prisma.trustpilotMeta.findUnique({ where: { casinoSlug: slug } }).catch(() => null);
  if (!cached || isPlaceholder(cached.score) || isPlaceholder(cached.reviewCount)) return null;

  const trustScore = Number(cached.score);
  const reviewCount = Number(cached.reviewCount);
  if (Number.isNaN(trustScore) || Number.isNaN(reviewCount)) return null;

  return {
    businessUnitId: cached.businessUnitId || "",
    trustScore,
    stars: Number(cached.stars || cached.score),
    reviewCount,
    profileUrl: cached.profileUrl || null,
    lastFetchedAt: (cached.lastFetchedAt || cached.lastUpdatedAt).toISOString()
  };
}

export async function getCachedLatestReviews(slug: string, limit = 5): Promise<TrustpilotReview[] | null> {
  const summary = await getCachedBusinessUnitSummary(slug);
  if (!summary) return getManualTrustpilotReviews(slug, limit);

  const now = Date.now();
  const cacheKey = `reviews:${slug}:${limit}`;
  const memoryCached = memoryReviewCache.get(cacheKey);
  if (memoryCached && memoryCached.expiresAt > now) return memoryCached.data;

  if (hasUsableDatabaseUrl()) {
    const cached = await prisma.trustpilotMeta.findUnique({ where: { casinoSlug: slug } });
    if (cached?.latestReviews && cached.lastFetchedAt && now - cached.lastFetchedAt.getTime() < cacheTtlMs()) {
      return cached.latestReviews as TrustpilotReview[];
    }
  }

  const reviews = await getLatestReviews(summary.businessUnitId, { limit });
  if (!reviews) return getManualTrustpilotReviews(slug, limit);

  memoryReviewCache.set(cacheKey, { data: reviews, expiresAt: now + cacheTtlMs() });

  if (hasUsableDatabaseUrl()) {
    await prisma.trustpilotMeta.update({
      where: { casinoSlug: slug },
      data: {
        latestReviews: reviews,
        lastFetchedAt: new Date(),
        lastUpdatedAt: new Date()
      }
    });
  }

  return reviews;
}

async function getManualTrustpilotReviews(slug: string, limit: number): Promise<TrustpilotReview[] | null> {
  if (!hasUsableDatabaseUrl()) return null;
  const reviews = await prisma.review.findMany({
    where: { casinoSlug: slug, source: { contains: "Trustpilot", mode: "insensitive" } },
    orderBy: [{ isHighlighted: "desc" }, { reviewedAt: "desc" }],
    take: limit
  }).catch(() => []);

  if (!reviews.length) return null;

  return reviews.map((review) => ({
    id: review.id,
    stars: review.rating,
    title: review.title || "Trustpilot review",
    text: review.body || review.text,
    createdAt: review.reviewedAt.toISOString(),
    consumerName: review.authorName || review.reviewerName,
    reviewUrl: review.externalUrl || undefined
  }));
}
