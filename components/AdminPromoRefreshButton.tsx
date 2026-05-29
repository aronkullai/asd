"use client";

import { useState } from "react";

export function AdminPromoRefreshButton({ casinoSlug }: { casinoSlug: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [sourceUrls, setSourceUrls] = useState("");
  const [summary, setSummary] = useState("");

  async function refresh() {
    setStatus("loading");
    setSummary("");
    const urls = sourceUrls
      .split(/\r?\n|,/)
      .map((url) => url.trim())
      .filter(Boolean);

    const response = await fetch("/api/admin/research/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ casinoSlug, sourceUrls: urls.length ? urls : undefined })
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const data = await response.json().catch(() => null);
    const sourceResults = data?.results?.[0]?.sourceResults || [];
    const fetched = sourceResults.reduce((total: number, result: { fetched?: number }) => total + (result.fetched || 0), 0);
    const added = sourceResults.reduce((total: number, result: { added?: number }) => total + (result.added || 0), 0);
    const updated = sourceResults.reduce((total: number, result: { updated?: number }) => total + (result.updated || 0), 0);
    const errors = sourceResults.flatMap((result: { errors?: string[] }) => result.errors || []);

    setSummary(errors.length ? errors.join("; ") : `Found ${fetched}, added ${added}, updated ${updated}.`);
    setStatus("done");
  }

  return (
    <div className="grid gap-2">
      <textarea
        value={sourceUrls}
        onChange={(event) => setSourceUrls(event.target.value)}
        rows={3}
        placeholder="Optional source URLs, one per line"
        className="w-full min-w-48 rounded-card border border-line bg-white px-3 py-2 text-xs text-ink"
      />
      <button
        type="button"
        onClick={refresh}
        disabled={status === "loading"}
        className="rounded-card border border-line bg-white px-3 py-2 font-extrabold text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
      >
        {status === "loading" ? "Scanning..." : status === "done" ? "Scan again" : status === "error" ? "Retry scan" : "Scan for codes"}
      </button>
      {summary ? <span className={`text-xs ${status === "error" ? "text-red-700" : "text-muted"}`}>{summary}</span> : null}
    </div>
  );
}
