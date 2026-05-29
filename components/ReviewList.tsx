import Link from "next/link";
import { RatingStars } from "@/components/RatingStars";
import { formatDate } from "@/lib/format";
import { getReviewStats } from "@/lib/review-service";
import type { Review } from "@/lib/types";

type ReviewListProps = {
  reviews: Review[];
};

export function ReviewList({ reviews }: ReviewListProps) {
  const { average, distribution, total } = getReviewStats(reviews);
  const highlighted = [...reviews].sort((a, b) => Number(b.isHighlighted) - Number(a.isHighlighted)).slice(0, 6);

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-card border border-line bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase tracking-wide text-muted">Player review signal</p>
        <div className="mt-2 flex items-baseline gap-2">
          <strong className="text-4xl text-navy">{average ? average.toFixed(1) : "N/A"}</strong>
          <span className="text-muted">/ 5</span>
        </div>
        <p className="mt-1 text-sm text-muted">{total ? `Based on ${total} pasted or internal review${total === 1 ? "" : "s"}` : "No reviews yet"}</p>
        <div className="mt-3">
          <RatingStars ratingOutOf5={average} />
        </div>
        <div className="mt-5 grid gap-2">
          {distribution.map((row) => (
            <div key={row.rating} className="grid grid-cols-[42px_1fr_24px] items-center gap-2 text-sm">
              <span>{row.rating} star</span>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${reviews.length ? (row.count / reviews.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-right font-bold text-navy">{row.count}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="grid gap-3">
        <div className="rounded-card border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
          Reviews shown here are manually added by PromoGuard admins or collected internally. External sources link back to the original page when available.
        </div>
        {highlighted.length ? (
          highlighted.map((review) => (
            <article key={review.id} className="rounded-card border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-accent-dark">
                      From {review.source || "PromoGuard users"}
                    </span>
                    {review.isHighlighted ? <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-900">Highlighted</span> : null}
                  </div>
                  <h3 className="m-0 font-black text-navy">{review.title || review.authorName || review.reviewerName}</h3>
                  <p className="m-0 text-sm text-muted">{review.authorName || review.reviewerName} · {formatDate(review.date)}</p>
                </div>
                <RatingStars ratingOutOf5={review.rating} label={`${review.rating} out of 5 stars`} />
              </div>
              <blockquote className="mt-4 border-l-4 border-accent/70 pl-4 text-muted">
                {review.body || review.text}
              </blockquote>
              {review.externalUrl ? (
                <Link href={review.externalUrl} target="_blank" rel="noopener nofollow" className="mt-4 inline-flex text-sm font-extrabold text-blue-800">
                  Read full review on {review.source || "source"} →
                </Link>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-card border border-dashed border-line bg-white p-6 text-muted">
            No internal PromoGuard reviews yet. Add moderated reviews in the database when ready.
          </div>
        )}
      </div>
    </div>
  );
}
