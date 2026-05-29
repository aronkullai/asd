"use client";

import { useMemo, useState } from "react";
import type { Casino } from "@/lib/types";

type AdminReview = {
  id: string;
  casinoSlug: string;
  source: string;
  authorName: string | null;
  reviewerName: string;
  rating: number;
  title: string | null;
  body: string | null;
  text: string;
  reviewedAt: string;
  externalUrl: string | null;
  isHighlighted: boolean;
  adminNote: string | null;
};

type FormState = {
  id?: string;
  casinoSlug: string;
  source: string;
  authorName: string;
  rating: string;
  title: string;
  body: string;
  reviewedAt: string;
  externalUrl: string;
  isHighlighted: boolean;
  adminNote: string;
};

const defaultForm = (casinoSlug: string): FormState => ({
  casinoSlug,
  source: "Trustpilot",
  authorName: "Verified user",
  rating: "5",
  title: "",
  body: "",
  reviewedAt: new Date().toISOString().slice(0, 10),
  externalUrl: "",
  isHighlighted: true,
  adminNote: ""
});

export function AdminReviewManager({ casinos, initialReviews }: { casinos: Casino[]; initialReviews: AdminReview[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [casinoFilter, setCasinoFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [form, setForm] = useState<FormState>(defaultForm(casinos[0]?.slug || ""));
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const sources = useMemo(() => Array.from(new Set(reviews.map((review) => review.source))).sort(), [reviews]);
  const filteredReviews = reviews.filter((review) => {
    const casinoMatch = casinoFilter === "all" || review.casinoSlug === casinoFilter;
    const sourceMatch = sourceFilter === "all" || review.source === sourceFilter;
    const ratingMatch = ratingFilter === "all" || String(review.rating) === ratingFilter;
    return casinoMatch && sourceMatch && ratingMatch;
  });

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function editReview(review: AdminReview) {
    setForm({
      id: review.id,
      casinoSlug: review.casinoSlug,
      source: review.source,
      authorName: review.authorName || review.reviewerName,
      rating: String(review.rating),
      title: review.title || "",
      body: review.body || review.text,
      reviewedAt: new Date(review.reviewedAt).toISOString().slice(0, 10),
      externalUrl: review.externalUrl || "",
      isHighlighted: review.isHighlighted,
      adminNote: review.adminNote || ""
    });
  }

  async function saveReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    if (!form.body.trim()) {
      setStatus("error");
      setMessage("Please paste a review body or excerpt.");
      return;
    }

    const response = await fetch(form.id ? `/api/admin/reviews/${form.id}` : "/api/admin/reviews", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.review) {
      setStatus("error");
      setMessage(payload?.error || "Review could not be saved.");
      return;
    }

    setReviews((current) => {
      const next = current.filter((review) => review.id !== payload.review.id);
      return [payload.review, ...next];
    });
    setForm(defaultForm(form.casinoSlug));
    setStatus("success");
    setMessage("Review saved. It is ready to display on the casino page.");
  }

  async function deleteReview(id: string) {
    const response = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (response.ok) {
      setReviews((current) => current.filter((review) => review.id !== id));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form onSubmit={saveReview} className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-sm">
        <div>
          <p className="m-0 text-xs font-black uppercase tracking-wide text-accent-dark">{form.id ? "Edit review" : "Add review"}</p>
          <h2 className="text-2xl font-black text-navy">Paste review content</h2>
        </div>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Casino
          <select className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={form.casinoSlug} onChange={(event) => updateField("casinoSlug", event.target.value)}>
            {casinos.map((casino) => (
              <option key={casino.slug} value={casino.slug}>{casino.name}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-navy">
            Source
            <input className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={form.source} onChange={(event) => updateField("source", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-navy">
            Rating
            <select className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={form.rating} onChange={(event) => updateField("rating", event.target.value)}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>{rating} stars</option>
              ))}
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Author
          <input className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={form.authorName} onChange={(event) => updateField("authorName", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Title
          <input className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Review body or excerpt
          <textarea className="min-h-32 rounded-card border border-line px-3 py-2 font-normal" value={form.body} onChange={(event) => updateField("body", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Original review/profile URL
          <input className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={form.externalUrl} onChange={(event) => updateField("externalUrl", event.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-navy">
            Reviewed at
            <input type="date" className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={form.reviewedAt} onChange={(event) => updateField("reviewedAt", event.target.value)} />
          </label>
          <label className="flex items-center gap-2 self-end rounded-card border border-line bg-soft px-3 py-3 text-sm font-bold text-navy">
            <input type="checkbox" checked={form.isHighlighted} onChange={(event) => updateField("isHighlighted", event.target.checked)} />
            Highlight
          </label>
        </div>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Internal note
          <input className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={form.adminNote} onChange={(event) => updateField("adminNote", event.target.value)} />
        </label>
        <button type="submit" disabled={status === "saving"} className="min-h-11 rounded-card bg-accent px-4 py-3 font-extrabold text-white transition hover:bg-accent-dark disabled:opacity-60">
          {status === "saving" ? "Saving..." : form.id ? "Update review" : "Save review"}
        </button>
        {form.id ? (
          <button type="button" onClick={() => setForm(defaultForm(form.casinoSlug))} className="rounded-card border border-line bg-white px-4 py-3 font-extrabold text-blue-800">
            Cancel edit
          </button>
        ) : null}
        {message ? <p className={`m-0 text-sm font-bold ${status === "error" ? "text-red-700" : "text-accent-dark"}`}>{message}</p> : null}
      </form>

      <section className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="m-0 text-xs font-black uppercase tracking-wide text-accent-dark">Review library</p>
            <h2 className="text-2xl font-black text-navy">{filteredReviews.length} reviews</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <select className="min-h-10 rounded-card border border-line px-3 py-2 text-sm" value={casinoFilter} onChange={(event) => setCasinoFilter(event.target.value)}>
              <option value="all">All casinos</option>
              {casinos.map((casino) => <option key={casino.slug} value={casino.slug}>{casino.name}</option>)}
            </select>
            <select className="min-h-10 rounded-card border border-line px-3 py-2 text-sm" value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              <option value="all">All sources</option>
              {sources.map((source) => <option key={source} value={source}>{source}</option>)}
            </select>
            <select className="min-h-10 rounded-card border border-line px-3 py-2 text-sm" value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
              <option value="all">All ratings</option>
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-3">
          {filteredReviews.map((review) => (
            <article key={review.id} className="rounded-card border border-line bg-soft p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-accent-dark">{review.source}</span>
                    {review.isHighlighted ? <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-900">Highlighted</span> : null}
                  </div>
                  <h3 className="mt-2 font-black text-navy">{review.title || "Untitled review"}</h3>
                  <p className="m-0 text-sm text-muted">{review.authorName || review.reviewerName} · {review.rating}/5</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editReview(review)} className="rounded-card border border-line bg-white px-3 py-2 text-sm font-extrabold text-blue-800">Edit</button>
                  <button type="button" onClick={() => deleteReview(review.id)} className="rounded-card border border-line bg-white px-3 py-2 text-sm font-extrabold text-red-700">Delete</button>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted">{review.body || review.text}</p>
            </article>
          ))}
          {!filteredReviews.length ? (
            <div className="rounded-card border border-dashed border-line bg-soft p-6 text-muted">
              No reviews match those filters yet.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
