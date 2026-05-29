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
    const result = data?.results?.[0];
    const errors = result?.errors || [];

    setSummary(
      errors.length
        ? errors.join("; ")
        : `Checked ${result?.checked || 0}, confirmed ${result?.confirmed || 0}, deactivated ${result?.deactivated || 0}.`
    );
    setStatus("done");
  }

  return (
    <div className="grid gap-2">
      <textarea
        value={sourceUrls}
        onChange={(event) => setSourceUrls(event.target.value)}
        rows={3}
        placeholder="Optional approved validation URLs, one per line"
        className="w-full min-w-48 rounded-card border border-line bg-white px-3 py-2 text-xs text-ink"
      />
      <button
        type="button"
        onClick={refresh}
        disabled={status === "loading"}
        className="rounded-card border border-line bg-white px-3 py-2 font-extrabold text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
      >
        {status === "loading" ? "Checking..." : status === "done" ? "Check again" : status === "error" ? "Retry check" : "Validate codes"}
      </button>
      {summary ? <span className={`text-xs ${status === "error" ? "text-red-700" : "text-muted"}`}>{summary}</span> : null}
    </div>
  );
}
