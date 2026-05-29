"use client";

import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/components/AuthProvider";
import type { CommunityRatingStats } from "@/lib/user-rating-service";

export function UserRatingSection({ casinoSlug, stats }: { casinoSlug: string; stats: CommunityRatingStats }) {
  const { user, loading } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  async function submitRating(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const response = await fetch(`/api/casinos/${casinoSlug}/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment })
    });
    const payload = await response.json().catch(() => null);
    setStatus("idle");
    setMessage(response.ok ? "Thanks. Your rating has been saved." : payload?.error || "Could not save rating.");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="rounded-card border border-line bg-soft p-5">
        <p className="text-sm font-black uppercase tracking-wide text-accent-dark">Community score</p>
        <p className="mt-2 text-4xl font-black text-navy">{stats.count ? `${stats.average}/5` : "New"}</p>
        <p className="text-sm text-muted">{stats.count ? `from ${stats.count} PromoGuard user${stats.count === 1 ? "" : "s"}` : "Be the first to rate this casino."}</p>
      </div>

      <div className="grid gap-4">
        {!loading && user ? (
          <form onSubmit={submitRating} className="grid gap-3 rounded-card border border-line bg-white p-5">
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`Rate ${value} stars`}
                  className={`grid h-10 w-10 place-items-center rounded-card border ${value <= rating ? "border-amber-300 bg-amber-50 text-amber-500" : "border-line bg-white text-slate-300"}`}
                >
                  <FontAwesomeIcon icon={faStar} className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
            <label className="grid gap-2 text-sm font-bold text-navy">
              Comment
              <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={280} className="min-h-24 rounded-card border border-line p-3 text-sm font-normal" placeholder="Short, useful comment for other players" />
            </label>
            <button type="submit" disabled={status === "saving"} className="inline-flex min-h-11 items-center justify-center rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white hover:bg-accent-dark">
              {status === "saving" ? "Saving..." : "Submit rating"}
            </button>
            {message ? <p className="text-sm font-bold text-muted">{message}</p> : null}
          </form>
        ) : (
          <div className="rounded-card border border-dashed border-line bg-white p-5 text-sm text-muted">
            <Link href="/login" className="font-extrabold text-blue-800">Log in</Link> or <Link href="/register" className="font-extrabold text-blue-800">register</Link> to rate this casino.
          </div>
        )}

        {stats.comments.length ? (
          <div className="grid gap-3">
            {stats.comments.map((item) => (
              <article key={item.id} className="rounded-card border border-line bg-soft p-4">
                <p className="text-sm font-black text-navy">{item.rating}/5 stars - {item.author}</p>
                <p className="m-0 text-sm text-muted">{item.comment}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
