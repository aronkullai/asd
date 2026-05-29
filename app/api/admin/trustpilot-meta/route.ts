import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.casinoSlug) return NextResponse.json({ ok: false, error: "casinoSlug is required." }, { status: 400 });

  const score = String(body.score || "").trim();
  const reviewCount = String(body.reviewCount || "").trim();
  if (!score || !reviewCount) return NextResponse.json({ ok: false, error: "Score and review count are required." }, { status: 400 });

  const meta = await prisma.trustpilotMeta.upsert({
    where: { casinoSlug: String(body.casinoSlug) },
    update: {
      score,
      stars: String(body.stars || score),
      reviewCount,
      profileUrl: String(body.profileUrl || "").trim(),
      lastUpdatedAt: new Date()
    },
    create: {
      casinoSlug: String(body.casinoSlug),
      score,
      stars: String(body.stars || score),
      reviewCount,
      profileUrl: String(body.profileUrl || "").trim(),
      lastUpdatedAt: new Date()
    }
  });

  return NextResponse.json({ ok: true, meta });
}

