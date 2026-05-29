"use client";

import { useMemo, useState } from "react";
import type { Casino } from "@/lib/types";

type AdminPromo = {
  id: string;
  casinoSlug: string;
  code: string;
  label: string;
  benefit: string;
  description: string | null;
  conditions: string | null;
  source: string;
  sourceId: string;
  isAffiliateOwned: boolean;
  isVerified: boolean;
  isActive: boolean;
  validFrom: string | null;
  validUntil: string | null;
  region: string | null;
  maxUses: number | null;
  usesSoFar: number;
  lastCheckedAt: string;
};

type FormState = {
  id?: string;
  casinoSlug: string;
  code: string;
  label: string;
  benefit: string;
  description: string;
  conditions: string;
  source: string;
  sourceId: string;
  isAffiliateOwned: boolean;
  isVerified: boolean;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  region: string;
  maxUses: string;
  usesSoFar: string;
};

function emptyForm(casinoSlug: string): FormState {
  return {
    casinoSlug,
    code: "",
    label: "",
    benefit: "",
    description: "",
    conditions: "",
    source: "Manual",
    sourceId: "Manual",
    isAffiliateOwned: false,
    isVerified: false,
    isActive: true,
    validFrom: "",
    validUntil: "",
    region: "",
    maxUses: "",
    usesSoFar: "0"
  };
}

function toDateInput(value: string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export function AdminPromoManager({ casinos, initialPromos }: { casinos: Casino[]; initialPromos: AdminPromo[] }) {
  const [promos, setPromos] = useState(initialPromos);
  const [form, setForm] = useState<FormState>(emptyForm(casinos[0]?.slug || ""));
  const [casinoFilter, setCasinoFilter] = useState("all");
  const [status, setStatus] = useState<"idle" | "saving" | "importing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const filteredPromos = useMemo(
    () => promos.filter((promo) => casinoFilter === "all" || promo.casinoSlug === casinoFilter),
    [casinoFilter, promos]
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function editPromo(promo: AdminPromo) {
    setForm({
      id: promo.id,
      casinoSlug: promo.casinoSlug,
      code: promo.code,
      label: promo.label,
      benefit: promo.benefit,
      description: promo.description || "",
      conditions: promo.conditions || "",
      source: promo.source,
      sourceId: promo.sourceId,
      isAffiliateOwned: promo.isAffiliateOwned,
      isVerified: promo.isVerified,
      isActive: promo.isActive,
      validFrom: toDateInput(promo.validFrom),
      validUntil: toDateInput(promo.validUntil),
      region: promo.region || "",
      maxUses: promo.maxUses === null ? "" : String(promo.maxUses),
      usesSoFar: String(promo.usesSoFar)
    });
  }

  async function savePromo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const response = await fetch(form.id ? `/api/admin/promos/${form.id}` : "/api/admin/promos", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        usesSoFar: Number(form.usesSoFar || 0),
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null
      })
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.promo) {
      setStatus("error");
      setMessage(payload?.error || "Promo code could not be saved.");
      return;
    }

    setPromos((current) => [payload.promo, ...current.filter((promo) => promo.id !== payload.promo.id)]);
    setForm(emptyForm(form.casinoSlug));
    setStatus("success");
    setMessage("Promo code saved. It will show publicly only when verified, active, and inside its date range.");
  }

  async function deletePromo(id: string) {
    const response = await fetch(`/api/admin/promos/${id}`, { method: "DELETE" });
    if (response.ok) setPromos((current) => current.filter((promo) => promo.id !== id));
  }

  async function importCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("importing");
    setMessage("");
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/admin/promos/import", { method: "POST", body: formData });
    const payload = await response.json().catch(() => null);
    setStatus(response.ok ? "success" : "error");
    setMessage(payload?.errors?.length ? payload.errors.join(" ") : `Imported ${payload?.imported || 0} promo codes. Refresh to see the latest table.`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[430px_1fr]">
      <form onSubmit={savePromo} className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-sm">
        <div>
          <p className="m-0 text-xs font-black uppercase tracking-wide text-accent-dark">{form.id ? "Edit real code" : "Add real code"}</p>
          <h2 className="text-2xl font-black text-navy">Manual promo entry</h2>
          <p className="mt-1 text-sm text-muted">Only add codes from your affiliate dashboard, partner feed, or a source you checked manually.</p>
        </div>
        <label className="grid gap-2 text-sm font-bold text-navy">
          Casino
          <select className="min-h-11 rounded-card border border-line px-3 py-2 font-normal" value={form.casinoSlug} onChange={(event) => updateField("casinoSlug", event.target.value)}>
            {casinos.map((casino) => <option key={casino.slug} value={casino.slug}>{casino.name}</option>)}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Code" value={form.code} onChange={(value) => updateField("code", value)} />
          <Input label="Region" value={form.region} onChange={(value) => updateField("region", value)} placeholder="EU, US, CA" />
        </div>
        <Input label="Label" value={form.label} onChange={(value) => updateField("label", value)} />
        <Input label="Benefit text" value={form.benefit} onChange={(value) => updateField("benefit", value)} />
        <label className="grid gap-2 text-sm font-bold text-navy">
          Description
          <textarea className="min-h-24 rounded-card border border-line px-3 py-2 font-normal" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
        </label>
        <Input label="Conditions" value={form.conditions} onChange={(value) => updateField("conditions", value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Source label" value={form.source} onChange={(value) => updateField("source", value)} />
          <Input label="Source ID" value={form.sourceId} onChange={(value) => updateField("sourceId", value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Valid from" type="date" value={form.validFrom} onChange={(value) => updateField("validFrom", value)} />
          <Input label="Valid until" type="date" value={form.validUntil} onChange={(value) => updateField("validUntil", value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Max uses" type="number" value={form.maxUses} onChange={(value) => updateField("maxUses", value)} />
          <Input label="Uses so far" type="number" value={form.usesSoFar} onChange={(value) => updateField("usesSoFar", value)} />
        </div>
        <div className="grid gap-2">
          <Checkbox label="Recommended partner offer" checked={form.isAffiliateOwned} onChange={(value) => updateField("isAffiliateOwned", value)} />
          <Checkbox label="Verified by admin" checked={form.isVerified} onChange={(value) => updateField("isVerified", value)} />
          <Checkbox label="Active" checked={form.isActive} onChange={(value) => updateField("isActive", value)} />
        </div>
        <button type="submit" disabled={status === "saving"} className="min-h-11 rounded-card bg-accent px-4 py-3 font-extrabold text-white transition hover:bg-accent-dark disabled:opacity-60">
          {status === "saving" ? "Saving..." : form.id ? "Update promo code" : "Save promo code"}
        </button>
        {form.id ? (
          <button type="button" onClick={() => setForm(emptyForm(form.casinoSlug))} className="rounded-card border border-line bg-white px-4 py-3 font-extrabold text-blue-800">
            Cancel edit
          </button>
        ) : null}
        <label className="grid gap-2 rounded-card border border-dashed border-line bg-soft p-3 text-sm font-bold text-navy">
          Import CSV
          <input type="file" accept=".csv,text/csv" onChange={importCsv} className="text-sm font-normal" />
          <span className="text-xs font-normal text-muted">Headers: casinoSlug,code,label,benefit,description,conditions,source,sourceId,isAffiliateOwned,isVerified,isActive,validFrom,validUntil,region,maxUses,usesSoFar</span>
        </label>
        {message ? <p className={`m-0 text-sm font-bold ${status === "error" ? "text-red-700" : "text-accent-dark"}`}>{message}</p> : null}
      </form>

      <section className="grid gap-4 rounded-card border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="m-0 text-xs font-black uppercase tracking-wide text-accent-dark">Verified-code library</p>
            <h2 className="text-2xl font-black text-navy">{filteredPromos.length} codes</h2>
          </div>
          <select className="min-h-10 rounded-card border border-line px-3 py-2 text-sm" value={casinoFilter} onChange={(event) => setCasinoFilter(event.target.value)}>
            <option value="all">All casinos</option>
            {casinos.map((casino) => <option key={casino.slug} value={casino.slug}>{casino.name}</option>)}
          </select>
        </div>
        <div className="grid gap-3">
          {filteredPromos.map((promo) => (
            <article key={promo.id} className="rounded-card border border-line bg-soft p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Pill active={promo.isVerified} label={promo.isVerified ? "Verified" : "Unverified"} />
                    <Pill active={promo.isActive} label={promo.isActive ? "Active" : "Inactive"} />
                    {promo.region ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">{promo.region}</span> : null}
                  </div>
                  <h3 className="mt-2 font-black text-navy">{promo.code}</h3>
                  <p className="m-0 text-sm text-muted">{promo.label} - {promo.source}</p>
                  <p className="mt-2 text-xs text-muted">Last checked: {new Date(promo.lastCheckedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editPromo(promo)} className="rounded-card border border-line bg-white px-3 py-2 text-sm font-extrabold text-blue-800">Edit</button>
                  <button type="button" onClick={() => deletePromo(promo.id)} className="rounded-card border border-line bg-white px-3 py-2 text-sm font-extrabold text-red-700">Delete</button>
                </div>
              </div>
            </article>
          ))}
          {!filteredPromos.length ? (
            <div className="rounded-card border border-dashed border-line bg-soft p-6 text-muted">
              No real promo codes have been entered yet.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <input type={type} className="min-h-11 rounded-card border border-line px-3 py-2 font-normal text-ink" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-card border border-line bg-soft px-3 py-3 text-sm font-bold text-navy">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function Pill({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-black ${active ? "bg-emerald-50 text-accent-dark" : "bg-amber-50 text-amber-900"}`}>
      {label}
    </span>
  );
}

