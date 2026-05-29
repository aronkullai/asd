import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ id: string }>;
};

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

export async function PUT(request: Request, { params }: RouteProps) {
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });

  const authorName = String(body.authorName || body.reviewerName || "Verified user").trim();
  const text = String(body.body || body.text || "").trim();

  const review = await prisma.review.update({
    where: { id },
    data: {
      reviewerName: authorName,
      authorName,
      source: String(body.source || "Trustpilot").trim(),
      rating: Number(body.rating),
      title: body.title ? String(body.title).trim() : null,
      body: text,
      text,
      externalUrl: body.externalUrl ? String(body.externalUrl).trim() : null,
      isHighlighted: Boolean(body.isHighlighted),
      adminNote: body.adminNote ? String(body.adminNote).trim() : null,
      reviewedAt: body.reviewedAt ? new Date(body.reviewedAt) : new Date()
    }
  });

  return NextResponse.json({ ok: true, review });
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const { id } = await params;
  await prisma.review.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
