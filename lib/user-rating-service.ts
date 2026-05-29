import { prisma } from "@/lib/prisma";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

export async function getCommunityRatingsForCasino(slug: string) {
  if (!hasUsableDatabaseUrl()) {
    return { average: 0, count: 0, comments: [] };
  }

  const casino = await prisma.casino.findUnique({ where: { slug }, select: { id: true } }).catch(() => null);
  if (!casino) return { average: 0, count: 0, comments: [] };

  const [aggregate, comments] = await Promise.all([
    prisma.userRating.aggregate({
      where: { casinoId: casino.id },
      _avg: { rating: true },
      _count: { rating: true }
    }),
    prisma.userRating.findMany({
      where: { casinoId: casino.id, comment: { not: null } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { user: { select: { email: true } } }
    })
  ]);

  return {
    average: Number((aggregate._avg.rating || 0).toFixed(1)),
    count: aggregate._count.rating,
    comments: comments.map((comment) => ({
      id: comment.id,
      rating: comment.rating,
      comment: comment.comment || "",
      author: comment.user.email.replace(/(.{2}).+(@.+)/, "$1***$2"),
      updatedAt: comment.updatedAt.toISOString()
    }))
  };
}

export type CommunityRatingStats = Awaited<ReturnType<typeof getCommunityRatingsForCasino>>;
