import { RatingStars } from "@/components/RatingStars";
import { formatDate } from "@/lib/format";
import type { Review } from "@/lib/types";

type ReviewListProps = {
  reviews: Review[];
};

export function ReviewList({ reviews }: ReviewListProps) {
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length
  }));

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-card border border-line bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase tracking-wide text-muted">PromoGuard user rating</p>
        <div className="mt-2 flex items-baseline gap-2">
          <strong className="text-4xl text-navy">{average ? average.toFixed(1) : "N/A"}</strong>
          <span className="text-muted">/ 5</span>
        </div>
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
          Trustpilot reviews are referenced externally. Reviews shown here are separate internal PromoGuard reviews and should be moderated before publication.
        </div>
        {reviews.length ? (
          reviews.map((review) => (
            <article key={review.id} className="rounded-card border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="m-0 font-black text-navy">{review.reviewerName}</h3>
                  <p className="m-0 text-sm text-muted">{formatDate(review.date)}</p>
                </div>
                <RatingStars ratingOutOf5={review.rating} label={`${review.rating} out of 5 stars`} />
              </div>
              <p className="mb-0 mt-3 text-muted">{review.text}</p>
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
