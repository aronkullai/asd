export type AffiliateClickPayload = {
  casinoName: string;
  casinoSlug?: string;
  promoCode?: string | null;
  href: string;
  source?: string;
};

export function trackAffiliateClick(payload: AffiliateClickPayload) {
  const event = {
    ...payload,
    timestamp: new Date().toISOString()
  };

  console.log("[analytics] affiliate-click", event);

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    navigator.sendBeacon("/api/analytics/track-click", JSON.stringify(event));
    return;
  }

  fetch("/api/analytics/track-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    keepalive: true
  }).catch(() => undefined);
}

export function trackPromoCodeClick(payload: { casinoName: string; casinoSlug: string; promoCode: string; source?: string }) {
  const event = {
    type: "promo-code-click",
    ...payload,
    timestamp: new Date().toISOString()
  };

  console.log("[analytics] promo-code-click", event);

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    keepalive: true
  }).catch(() => undefined);
}
