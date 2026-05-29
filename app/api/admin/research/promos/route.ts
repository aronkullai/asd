import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { runPromoResearcherOnce } from "@/lib/promoResearcher";
import { isSameOriginRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const casinoSlug = typeof body.casinoSlug === "string" ? body.casinoSlug : undefined;
  const sourceUrls = Array.isArray(body.sourceUrls)
    ? body.sourceUrls.filter((url: unknown): url is string => typeof url === "string" && url.trim().length > 0)
    : undefined;

  const results = await runPromoResearcherOnce(casinoSlug, { sourceUrls });

  return NextResponse.json({ ok: true, results });
}
