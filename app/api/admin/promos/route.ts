import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getAffiliateConfigBySlug } from "@/config/affiliateConfig";
import { getCurrentUser } from "@/lib/auth";
import { casinos } from "@/lib/casino-data";
import { validatePromoCodeInput } from "@/lib/promo-code-validation";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/request-security";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

async function ensureCasino(slug: string) {
  const casino = casinos.find((item) => item.slug === slug);
  if (!casino) return null;
  const affiliateConfig = getAffiliateConfigBySlug(slug);

  await prisma.casino.upsert({
    where: { slug },
    update: {
      name: casino.name,
      affiliateLink: affiliateConfig?.affiliateLink || "",
      trustpilotProfileUrl: casino.trustpilot.profileUrl,
      promoFetchSourceType: casino.fetchMetadata.sourceType,
      promoFetchSourceUrl: casino.fetchMetadata.sourceUrl
    },
    create: {
      id: casino.id,
      slug,
      name: casino.name,
      affiliateLink: affiliateConfig?.affiliateLink || "",
      trustpilotProfileUrl: casino.trustpilot.profileUrl,
      promoFetchSourceType: casino.fetchMetadata.sourceType,
      promoFetchSourceUrl: casino.fetchMetadata.sourceUrl
    }
  });

  return casino;
}

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });

  const validation = validatePromoCodeInput(body);
  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", fieldErrors: validation.fieldErrors }, { status: 400 });
  }

  const casino = await ensureCasino(validation.normalized.casinoSlug);
  if (!casino) return NextResponse.json({ ok: false, error: "Unknown casino." }, { status: 400 });

  const now = new Date();
  const promo = await prisma.promoCode.create({
    data: {
      id: randomUUID(),
      casinoId: casino.id,
      ...validation.normalized,
      discoveredAt: now,
      lastCheckedAt: now,
      lastUpdatedAt: now
    }
  });

  await prisma.promoCodeHistory.create({
    data: {
      promoCodeId: promo.id,
      casinoSlug: promo.casinoSlug,
      code: promo.code,
      sourceId: promo.sourceId,
      action: "manual-created",
      after: promo,
      message: "Admin created a manually curated promo code."
    }
  });

  return NextResponse.json({ ok: true, promo });
}

