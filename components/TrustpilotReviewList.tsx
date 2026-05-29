import Link from "next/link";
import { RatingStars } from "@/components/RatingStars";
import { formatDate } from "@/lib/format";
import type { TrustpilotReview } from "@/lib/types";

type TrustpilotReviewListProps = {
  reviews: TrustpilotReview[] | null;
  profileUrl?: string | null;
};

export function TrustpilotReviewList({ reviews, profileUrl }: TrustpilotReviewListProps) {
  if (!reviews?.length) {
    return (
      <div className="rounded-card border border-dashed border-line bg-soft p-5 text-muted">
        Trustpilot excerpts are not connected to an API. Paste curated reviews in the admin review manager and link back to the original Trustpilot page.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-card border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
        These are external review excerpts stored by PromoGuard admins. Always follow the original source link for full context.
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-card border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <RatingStars ratingOutOf5={review.stars} />
              <span className="text-xs font-bold text-muted">{formatDate(review.createdAt)}</span>
            </div>
            <h3 className="mt-4 text-lg font-black text-navy">{review.title}</h3>
            <p className="mt-2 line-clamp-4 text-sm text-muted">{review.text}</p>
            <p className="mt-4 text-sm font-bold text-navy">{review.consumerName || "Verified user"}</p>
          </article>
        ))}
      </div>
      {profileUrl ? (
        <Link href={profileUrl} target="_blank" rel="noopener sponsored" className="w-fit rounded-card border border-line bg-white px-4 py-3 text-sm font-extrabold text-blue-800">
          See more on Trustpilot
        </Link>
      ) : null}
    </div>
  );
}
