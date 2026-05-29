import { NextResponse } from "next/server";
import { casinos } from "@/lib/casino-data";
import { prisma } from "@/lib/prisma";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

function parseRating(value: unknown) {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be a whole number from 1 to 5.");
  }
  return rating;
}

export async function GET(request: Request) {
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const url = new URL(request.url);
  const casinoSlug = url.searchParams.get("casinoSlug") || undefined;
  const source = url.searchParams.get("source") || undefined;
  const rating = url.searchParams.get("rating");

  const reviews = await prisma.review.findMany({
    where: {
      casinoSlug,
      source,
      rating: rating ? Number(rating) : undefined
    },
    orderBy: { reviewedAt: "desc" },
    take: 100
  });

  return NextResponse.json({ ok: true, reviews });
}

export async function POST(request: Request) {
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });

  const casino = casinos.find((item) => item.slug === body.casinoSlug);
  if (!casino) return NextResponse.json({ ok: false, error: "Unknown casino." }, { status: 400 });

  const rating = parseRating(body.rating);
  const authorName = String(body.authorName || body.reviewerName || "Verified user").trim();
  const text = String(body.body || body.text || "").trim();
  if (!text) return NextResponse.json({ ok: false, error: "Review body is required." }, { status: 400 });

  await prisma.casino.upsert({
    where: { slug: casino.slug },
    update: { name: casino.name },
    create: {
      id: casino.id,
      name: casino.name,
      slug: casino.slug,
      affiliateLink: "",
      trustpilotProfileUrl: casino.trustpilot.profileUrl,
      promoFetchSourceType: casino.fetchMetadata.sourceType,
      promoFetchSourceUrl: casino.fetchMetadata.sourceUrl
    }
  });

  const review = await prisma.review.create({
    data: {
      casinoSlug: casino.slug,
      reviewerName: authorName,
      authorName,
      source: String(body.source || "Trustpilot").trim(),
      rating,
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
