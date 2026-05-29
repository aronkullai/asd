"use client";

import { useState } from "react";

export function AdminPromoSourceSyncButton({ casinoSlug }: { casinoSlug: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function sync() {
    setStatus("loading");
    setMessage("");
    const response = await fetch("/api/admin/promos/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ casinoSlug })
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "Source sync failed.");
      return;
    }

    const imported = (payload?.results || []).reduce((sum: number, result: { imported?: number }) => sum + (result.imported || 0), 0);
    setStatus("done");
    setMessage(`Imported or updated ${imported} codes from configured real sources.`);
  }

  return (
    <div className="grid gap-1">
      <button
        type="button"
        onClick={sync}
        disabled={status === "loading"}
        className="rounded-card border border-line bg-white px-3 py-2 text-xs font-extrabold text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
      >
        {status === "loading" ? "Syncing..." : "Sync real sources"}
      </button>
      {message ? <span className={`text-xs ${status === "error" ? "text-red-700" : "text-muted"}`}>{message}</span> : null}
    </div>
  );
}

