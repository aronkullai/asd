import type { PayoutSpeed } from "@/lib/types";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export function payoutSpeedLabel(speed: PayoutSpeed) {
  const labels: Record<PayoutSpeed, string> = {
    instant: "Instant",
    fast: "Fast",
    standard: "Standard",
    "manual-review": "Manual review"
  };

  return labels[speed];
}

export function speedRank(speed: PayoutSpeed) {
  const ranks: Record<PayoutSpeed, number> = {
    instant: 4,
    fast: 3,
    standard: 2,
    "manual-review": 1
  };

  return ranks[speed];
}

export function isPlaceholder(value: string) {
  return value.includes("PLACEHOLDER") || value.startsWith("ADD_") || value.startsWith("PASTE_");
}

export function normalizeExternalUrl(value?: string | null) {
  const url = value?.trim();

  if (!url || isPlaceholder(url)) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;

  return `https://${url}`;
}
