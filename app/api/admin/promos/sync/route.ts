import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCasinoWithDbOverrides } from "@/lib/casino-service";
import { syncPromoSourcesForCasino } from "@/lib/promo-source-sync";
import { isSameOriginRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const casinoSlug = String(body?.casinoSlug || "");
  const casino = await getCasinoWithDbOverrides(casinoSlug);
  if (!casino) return NextResponse.json({ ok: false, error: "Unknown casino." }, { status: 400 });

  const results = await syncPromoSourcesForCasino(casino);
  return NextResponse.json({ ok: true, results });
}

