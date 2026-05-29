import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/request-security";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.promoCodeId || typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "Missing promoCodeId or isActive" }, { status: 400 });
  }

  const promo = await prisma.promoCode.update({
    where: { id: body.promoCodeId },
    data: { isActive: body.isActive, lastUpdatedAt: new Date() }
  });

  await prisma.promoCodeHistory.create({
    data: {
      promoCodeId: promo.id,
      casinoSlug: promo.casinoSlug,
      code: promo.code,
      sourceId: promo.sourceId,
      action: body.isActive ? "manual-activated" : "manual-deactivated",
      after: promo,
      message: "Admin manually changed active state."
    }
  });

  return NextResponse.json({ ok: true, promo });
}
