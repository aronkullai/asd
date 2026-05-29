import { NextResponse } from "next/server";
import { runPromoResearcherOnce } from "@/lib/promoResearcher";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const casinoSlug = typeof body.casinoSlug === "string" ? body.casinoSlug : undefined;
  const sourceUrls = Array.isArray(body.sourceUrls)
    ? body.sourceUrls.filter((url: unknown): url is string => typeof url === "string" && url.trim().length > 0)
    : undefined;

  // Protect this endpoint with real authentication before production launch.
  const results = await runPromoResearcherOnce(casinoSlug, { sourceUrls });

  return NextResponse.json({ ok: true, results });
}
