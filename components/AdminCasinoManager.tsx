"use client";

import { useState } from "react";
import type { Casino } from "@/lib/types";

type CasinoAdminRow = {
  slug: string;
  name: string;
  regulator: string;
  licenseInfo: string;
  areaRegulations: string;
  payoutSummary: string;
  supportQuality: string;
  supportChannels: string;
  safetyFeatures: string;
  trustpilotProfileUrl: string;
  promoFetchSourceUrl: string;
};

function fromCasino(casino: Casino): CasinoAdminRow {
  return {
    slug: casino.slug,
    name: casino.name,
    regulator: casino.regulator,
    licenseInfo: casino.licenseInfo || casino.regulator,
    areaRegulations: casino.areaRegulations || "",
    payoutSummary: casino.payoutSummary,
    supportQuality: casino.supportQuality,
    supportChannels: (casino.supportChannels || casino.supportNotes).join("\n"),
    safetyFeatures: (casino.safetyFeatures || casino.securityNotes).join("\n"),
    trustpilotProfileUrl: casino.trustpilot.profileUrl,
    promoFetchSourceUrl: casino.fetchMetadata.sourceUrl
  };
}

export function AdminCasinoManager({ casinos }: { casinos: Casino[] }) {
  const [selectedSlug, setSelectedSlug] = useState(casinos[0]?.slug || "");
  const [form, setForm] = useState<CasinoAdminRow>(fromCasino(casinos[0]));
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function selectCasino(slug: string) {
    const casino = casinos.find((item) => item.slug === slug);
    if (!casino) return;
    setSelectedSlug(slug);
    setForm(fromCasino(casino));
    setStatus("idle");
    setMessage("");
  }

  function updateField<K extends keyof CasinoAdminRow>(key: K, value: CasinoAdminRow[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    const response = await fetch(`/api/admin/casinos/${selectedSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json().catch(() => null);
    setStatus(response.ok ? "success" : "error");
    setMessage(response.ok ? "Casino trust details saved." : payload?.error || "Could not save casino details.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="grid gap-2 rounded-card border border-line bg-white p-4 shadow-sm">
        {casinos.map((casino) => (
          <button
            key={casino.slug}
            type="button"
            onClick={() => selectCasino(casino.slug)}
            className={`rounded-card px-3 py-2 text-left text-sm font-extrabold ${casino.slug === selectedSlug ? "bg-emerald-50 text-accent-dark" : "bg-soft text-blue-800 hover:bg-white"}`}
          >
            {casino.name}
          </button>
        ))}
      </aside>
      <form onSubmit={save} className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-sm">
        <div>
          <p className="m-0 text-xs font-black uppercase tracking-wide text-accent-dark">Casino trust profile</p>
          <h2 className="text-2xl font-black text-navy">{form.name}</h2>
        </div>
        <Input label="Regulator" value={form.regulator} onChange={(value) => updateField("regulator", value)} />
        <Textarea label="License & regulation description" value={form.licenseInfo} onChange={(value) => updateField("licenseInfo", value)} />
        <Textarea label="Area regulations and restricted markets" value={form.areaRegulations} onChange={(value) => updateField("areaRegulations", value)} />
        <Textarea label="Payout description" value={form.payoutSummary} onChange={(value) => updateField("payoutSummary", value)} />
        <Textarea label="Support quality description" value={form.supportQuality} onChange={(value) => updateField("supportQuality", value)} />
        <Textarea label="Support channels, one per line" value={form.supportChannels} onChange={(value) => updateField("supportChannels", value)} />
        <Textarea label="Safety features, one per line" value={form.safetyFeatures} onChange={(value) => updateField("safetyFeatures", value)} />
        <Input label="Trustpilot profile URL" value={form.trustpilotProfileUrl} onChange={(value) => updateField("trustpilotProfileUrl", value)} />
        <Input label="Approved promo validation URL" value={form.promoFetchSourceUrl} onChange={(value) => updateField("promoFetchSourceUrl", value)} />
        <button type="submit" disabled={status === "saving"} className="min-h-11 rounded-card bg-accent px-4 py-3 font-extrabold text-white transition hover:bg-accent-dark disabled:opacity-60">
          {status === "saving" ? "Saving..." : "Save casino details"}
        </button>
        {message ? <p className={`text-sm font-bold ${status === "error" ? "text-red-700" : "text-accent-dark"}`}>{message}</p> : null}
      </form>
    </div>
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

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <textarea className="min-h-24 rounded-card border border-line px-3 py-2 font-normal text-ink" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
