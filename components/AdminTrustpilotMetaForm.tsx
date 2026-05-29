"use client";

import { useState } from "react";
import type { Casino } from "@/lib/types";

export function AdminTrustpilotMetaForm({ casinos }: { casinos: Casino[] }) {
  const [casinoSlug, setCasinoSlug] = useState(casinos[0]?.slug || "");
  const [score, setScore] = useState("");
  const [reviewCount, setReviewCount] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const response = await fetch("/api/admin/trustpilot-meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ casinoSlug, score, reviewCount, profileUrl })
    });
    const payload = await response.json().catch(() => null);
    setStatus(response.ok ? "success" : "error");
    setMessage(response.ok ? "Trustpilot summary saved." : payload?.error || "Could not save Trustpilot summary.");
  }

  return (
    <form onSubmit={save} className="mb-6 grid gap-3 rounded-card border border-line bg-white p-5 shadow-sm md:grid-cols-[1fr_140px_160px_1.5fr_auto] md:items-end">
      <label className="grid gap-2 text-sm font-bold text-navy">
        Casino
        <select className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={casinoSlug} onChange={(event) => setCasinoSlug(event.target.value)}>
          {casinos.map((casino) => <option key={casino.slug} value={casino.slug}>{casino.name}</option>)}
        </select>
      </label>
      <Input label="TrustScore" value={score} onChange={setScore} />
      <Input label="Review count" value={reviewCount} onChange={setReviewCount} />
      <Input label="Trustpilot URL" value={profileUrl} onChange={setProfileUrl} />
      <button type="submit" disabled={status === "saving"} className="min-h-11 rounded-card bg-accent px-4 py-3 font-extrabold text-white disabled:opacity-60">
        {status === "saving" ? "Saving..." : "Save"}
      </button>
      {message ? <p className={`md:col-span-5 text-sm font-bold ${status === "error" ? "text-red-700" : "text-accent-dark"}`}>{message}</p> : null}
    </form>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <input className="min-h-11 rounded-card border border-line px-3 py-2 font-normal text-ink" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

