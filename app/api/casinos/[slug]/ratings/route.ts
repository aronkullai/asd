import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in to rate casinos." }, { status: 401 });

  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const rating = Number(body?.rating);
  const comment = String(body?.comment || "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be from 1 to 5." }, { status: 400 });
  }
  if (comment.length > 280) {
    return NextResponse.json({ error: "Comment must be 280 characters or less." }, { status: 400 });
  }

  const casino = await prisma.casino.findUnique({ where: { slug }, select: { id: true } });
  if (!casino) return NextResponse.json({ error: "Casino not found." }, { status: 404 });

  const saved = await prisma.userRating.upsert({
    where: { userId_casinoId: { userId: user.id, casinoId: casino.id } },
    update: { rating, comment: comment || null },
    create: { userId: user.id, casinoId: casino.id, rating, comment: comment || null }
  });

  return NextResponse.json({ ok: true, rating: saved });
}
