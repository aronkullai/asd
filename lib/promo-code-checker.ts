import { getPromoSourceUrlsForCasino, researcherConfig } from "@/config/researcherConfig";
import { normalizeExternalUrl } from "@/lib/format";

export type PromoValidityInput = {
  casinoSlug: string;
  casinoName: string;
  code: string;
  validFrom?: Date | null;
  validUntil?: Date | null;
  maxUses?: number | null;
  usesSoFar?: number | null;
};

export type PromoValidityResult = {
  status: "confirmed" | "expired" | "not-yet-active" | "used-up" | "not-found" | "unchecked" | "error";
  shouldDeactivate: boolean;
  message: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function fetchSafeText(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), researcherConfig.requestTimeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml,text/plain;q=0.8,*/*;q=0.5",
        "user-agent": "PromoGuardBot/1.0 (+https://promoguard.bet; promo-code validation)"
      },
      signal: controller.signal
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (!/text|html|json|xml/i.test(contentType)) {
      throw new Error(`Unsupported content type ${contentType || "unknown"}`);
    }

    return (await response.text()).slice(0, 500_000);
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkPromoCodeValidity(input: PromoValidityInput, overrideUrls?: string[]): Promise<PromoValidityResult> {
  const now = new Date();
  if (input.validUntil && input.validUntil.getTime() < now.getTime()) {
    return { status: "expired", shouldDeactivate: true, message: "Code is past its valid-until date." };
  }
  if (input.validFrom && input.validFrom.getTime() > now.getTime()) {
    return { status: "not-yet-active", shouldDeactivate: false, message: "Code is not active yet." };
  }
  if (input.maxUses !== null && input.maxUses !== undefined && Number(input.usesSoFar || 0) >= input.maxUses) {
    return { status: "used-up", shouldDeactivate: true, message: "Code has reached its configured max uses." };
  }

  const urls = (overrideUrls?.length ? overrideUrls : getPromoSourceUrlsForCasino(input.casinoSlug))
    .map(normalizeExternalUrl)
    .filter((url): url is string => Boolean(url));

  if (!urls.length) {
    return {
      status: "unchecked",
      shouldDeactivate: false,
      message: "No approved validation URL is configured. Date and usage checks passed."
    };
  }

  const codePattern = new RegExp(`\\b${escapeRegExp(input.code)}\\b`, "i");
  const errors: string[] = [];

  for (const url of urls) {
    try {
      const text = await fetchSafeText(url);
      if (codePattern.test(text)) {
        return { status: "confirmed", shouldDeactivate: false, message: `Code appears on approved source: ${url}` };
      }
    } catch (error) {
      errors.push(`${url}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  if (errors.length === urls.length) {
    return { status: "error", shouldDeactivate: false, message: errors.join("; ") };
  }

  return {
    status: "not-found",
    shouldDeactivate: false,
    message: "Code was not found on approved source pages, so it was left active for manual review."
  };
}

