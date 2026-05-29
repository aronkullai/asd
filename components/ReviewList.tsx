"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RatingStars } from "@/components/RatingStars";
import { formatDate } from "@/lib/format";
import type { Review } from "@/lib/types";

type ReviewListProps = {
  reviews: Review[];
  siteNote?: string;
};

function getClientReviewStats(reviews: Review[]) {
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length
  }));

  return { average, distribution, total: reviews.length };
}

export function ReviewList({ reviews, siteNote }: ReviewListProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { average, distribution, total } = getClientReviewStats(reviews);
  const filteredReviews = useMemo(
    () => reviews.filter((review) => selectedRating === null || review.rating === selectedRating),
    [reviews, selectedRating]
  );
  const visibleReviews = [...filteredReviews]
    .sort((a, b) => Number(b.isHighlighted) - Number(a.isHighlighted))
    .slice(0, 10);

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <aside className="rounded-card border border-line bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase tracking-wide text-muted">Player review signal</p>
        <div className="mt-2 flex items-baseline gap-2">
          <strong className="text-4xl text-navy">{average ? average.toFixed(1) : "N/A"}</strong>
          <span className="text-muted">/ 5</span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {total ? `Based on ${total} pasted or internal review${total === 1 ? "" : "s"}` : "No reviews yet"}
        </p>
        <div className="mt-3">
          <RatingStars ratingOutOf5={average} />
        </div>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={() => setSelectedRating(null)}
            aria-pressed={selectedRating === null}
            className={`rounded-card border px-3 py-2 text-left text-sm font-extrabold transition ${
              selectedRating === null ? "border-accent bg-emerald-50 text-accent-dark" : "border-line bg-white text-blue-800 hover:bg-blue-50"
            }`}
          >
            All reviews
          </button>
          {distribution.map((row) => (
            <button
              key={row.rating}
              type="button"
              onClick={() => setSelectedRating(row.rating)}
              aria-pressed={selectedRating === row.rating}
              aria-label={`Show ${row.rating} star reviews`}
              className={`grid grid-cols-[52px_1fr_24px] items-center gap-2 rounded-card border px-2 py-2 text-left text-sm transition ${
                selectedRating === row.rating ? "border-accent bg-emerald-50" : "border-line bg-white hover:bg-soft"
              }`}
            >
              <span aria-hidden="true">★ {row.rating}</span>
              <span className="h-2 overflow-hidden rounded-full bg-slate-200">
                <span
                  className="block h-full rounded-full bg-accent"
                  style={{ width: `${reviews.length ? (row.count / reviews.length) * 100 : 0}%` }}
                />
              </span>
              <span className="text-right font-bold text-navy">{row.count}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="grid gap-3">
        <div className="rounded-card border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
          Reviews shown here are manually added by PromoGuard admins or collected internally. External sources link back to the original page when available.
        </div>
        {siteNote ? (
          <div className="rounded-card border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
            <strong className="block text-navy">PromoGuard note</strong>
            <span>{siteNote}</span>
          </div>
        ) : null}
        {visibleReviews.length ? (
          visibleReviews.map((review) => (
            <article key={review.id} className="rounded-card border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-accent-dark">
                      From {review.source || "PromoGuard users"}
                    </span>
                    {review.isHighlighted ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-900">Highlighted</span>
                    ) : null}
                  </div>
                  <h3 className="m-0 font-black text-navy">{review.title || review.authorName || review.reviewerName}</h3>
                  <p className="m-0 text-sm text-muted">{review.authorName || review.reviewerName} - {formatDate(review.date)}</p>
                </div>
                <RatingStars ratingOutOf5={review.rating} label={`${review.rating} out of 5 stars`} />
              </div>
              <blockquote className="mt-4 border-l-4 border-accent/70 pl-4 text-muted">
                {review.body || review.text}
              </blockquote>
              {review.externalUrl ? (
                <Link href={review.externalUrl} target="_blank" rel="noopener nofollow" className="mt-4 inline-flex text-sm font-extrabold text-blue-800">
                  Read full review on {review.source || "source"} -&gt;
                </Link>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-card border border-dashed border-line bg-white p-6 text-muted">
            {selectedRating ? `No ${selectedRating}-star reviews yet.` : "No internal PromoGuard reviews yet. Add moderated reviews in the database when ready."}
          </div>
        )}
      </div>
    </div>
  );
}
