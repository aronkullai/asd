import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { validatePromoCodeInput } from "@/lib/promo-code-validation";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/request-security";

type RouteProps = {
  params: Promise<{ id: string }>;
};

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

export async function PUT(request: Request, { params }: RouteProps) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });

  const validation = validatePromoCodeInput({ ...body, id });
  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", fieldErrors: validation.fieldErrors }, { status: 400 });
  }

  const before = await prisma.promoCode.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ ok: false, error: "Promo code not found." }, { status: 404 });

  const promo = await prisma.promoCode.update({
    where: { id },
    data: {
      ...validation.normalized,
      lastUpdatedAt: new Date()
    }
  });

  await prisma.promoCodeHistory.create({
    data: {
      promoCodeId: promo.id,
      casinoSlug: promo.casinoSlug,
      code: promo.code,
      sourceId: promo.sourceId,
      action: "manual-updated",
      before,
      after: promo,
      message: "Admin updated a manually curated promo code."
    }
  });

  return NextResponse.json({ ok: true, promo });
}

export async function DELETE(request: Request, { params }: RouteProps) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const { id } = await params;
  const promo = await prisma.promoCode.delete({ where: { id } });

  await prisma.promoCodeHistory.create({
    data: {
      promoCodeId: null,
      casinoSlug: promo.casinoSlug,
      code: promo.code,
      sourceId: promo.sourceId,
      action: "manual-deleted",
      before: promo,
      message: "Admin deleted a promo code."
    }
  });

  return NextResponse.json({ ok: true });
}

