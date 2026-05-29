import { prisma } from "@/lib/prisma";
import type { Review } from "@/lib/types";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

export function normalizeReview(review: {
  id: string;
  casinoSlug: string;
  source?: string | null;
  reviewerName: string;
  authorName?: string | null;
  rating: number;
  title?: string | null;
  body?: string | null;
  text: string;
  reviewedAt: Date | string;
  externalUrl?: string | null;
  isHighlighted?: boolean;
  adminNote?: string | null;
}): Review {
  return {
    id: review.id,
    casinoSlug: review.casinoSlug,
    source: review.source || "PromoGuard user",
    reviewerName: review.reviewerName,
    authorName: review.authorName || review.reviewerName,
    rating: review.rating,
    title: review.title,
    body: review.body || review.text,
    date: typeof review.reviewedAt === "string" ? review.reviewedAt : review.reviewedAt.toISOString(),
    text: review.text,
    externalUrl: review.externalUrl,
    isHighlighted: review.isHighlighted,
    adminNote: review.adminNote
  };
}

export async function getPublishedReviewsForCasino(slug: string) {
  if (!hasUsableDatabaseUrl()) {
    return [];
  }

  const reviews = await prisma.review.findMany({
    where: { casinoSlug: slug },
    orderBy: [{ reviewedAt: "desc" }],
    take: 24
  }).catch(() => {
    return [];
  });

  return reviews.map(normalizeReview);
}

export function getReviewStats(reviews: Review[]) {
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length
  }));

  return { average, distribution, total: reviews.length };
}
