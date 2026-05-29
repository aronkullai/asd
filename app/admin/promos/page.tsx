import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPromoRefreshButton } from "@/components/AdminPromoRefreshButton";
import { AdminPromoSourceSyncButton } from "@/components/AdminPromoSourceSyncButton";
import { AdminPromoToggleButton } from "@/components/AdminPromoToggleButton";
import { CasinoIcon } from "@/components/CasinoIcon";
import { SectionHeader } from "@/components/SectionHeader";
import { getCasinosWithDbOverrides } from "@/lib/casino-service";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getCachedBusinessUnitSummary } from "@/lib/trustpilot";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Promo code finder"
};

type PageProps = {
  searchParams: Promise<{ active?: string; source?: string }>;
};

export default async function AdminPromosPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const filters = await searchParams;
  const casinoList = await getCasinosWithDbOverrides();
  const activeFilter = filters.active || "all";
  const sourceFilter = filters.source || "all";

  const rows = await Promise.all(
    casinoList.map(async (casino) => ({
      casino,
      trustpilot: await getCachedBusinessUnitSummary(casino.slug),
      promos: await prisma.promoCode.findMany({ where: { casinoSlug: casino.slug }, orderBy: [{ isVerified: "desc" }, { lastUpdatedAt: "desc" }] }).catch(() => [])
    }))
  );

  const sources = Array.from(new Set(rows.flatMap((row) => row.promos.map((promo) => promo.sourceId || promo.source)))).sort();

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader
            eyebrow="Admin"
            title="Promo code finder"
            description="Scan approved public promo pages, store discovered codes, and track Trustpilot snapshots. Protect this route with authentication before production launch."
          />
          <Link href="/admin/promos/edit" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-card bg-accent px-4 py-3 font-extrabold text-white hover:bg-accent-dark hover:text-white hover:no-underline">
            Add or edit real codes
          </Link>
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-6">
          <div className="flex flex-wrap gap-3 rounded-card border border-line bg-white p-4 shadow-sm">
            <FilterLink label="All" href="/admin/promos" active={activeFilter === "all" && sourceFilter === "all"} />
            <FilterLink label="Active" href="/admin/promos?active=true" active={activeFilter === "true"} />
            <FilterLink label="Inactive" href="/admin/promos?active=false" active={activeFilter === "false"} />
            {sources.map((source) => (
              <FilterLink key={source} label={source} href={`/admin/promos?source=${encodeURIComponent(source)}`} active={sourceFilter === source} />
            ))}
          </div>

          <div className="overflow-hidden rounded-card border border-line bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left text-sm">
                <thead className="bg-slate-100 text-xs font-black uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3">Casino</th>
                    <th className="px-4 py-3">Trustpilot</th>
                    <th className="px-4 py-3">Promo codes</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3">Valid until</th>
                    <th className="px-4 py-3">Last checked</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map(({ promos, casino, trustpilot }) => {
                    const filteredPromos = promos.filter((promo) => {
                      const activeMatch = activeFilter === "all" || String(promo.isActive !== false) === activeFilter;
                      const sourceMatch = sourceFilter === "all" || (promo.sourceId || promo.source) === sourceFilter;
                      return activeMatch && sourceMatch;
                    });

                    return (
                      <tr key={casino.slug} className="align-top">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <CasinoIcon casinoSlug={casino.slug} text={casino.logoText} iconConfig={casino.logoIcon} size="sm" />
                            <div>
                              <span className="block font-black text-navy">{casino.name}</span>
                              <span className="text-xs text-muted">{casino.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {trustpilot ? (
                            <span className="font-bold text-navy">
                              {trustpilot.trustScore.toFixed(1)} / 5, {trustpilot.reviewCount.toLocaleString()} reviews
                            </span>
                          ) : (
                            "Not configured"
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {filteredPromos.length ? (
                            <div className="grid gap-2">
                              {filteredPromos.map((promo) => (
                                <div key={promo.id} className="rounded-card border border-line bg-soft p-3">
                                  <strong className="block text-navy">{promo.code}</strong>
                                  <span className="text-xs text-muted">{promo.label}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted">No codes</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {filteredPromos.length ? filteredPromos.map((promo) => promo.sourceId || promo.source).join(", ") : "-"}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {filteredPromos.length ? filteredPromos.map((promo) => (promo.isActive !== false ? "Active" : "Inactive")).join(", ") : "-"}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {filteredPromos.length
                            ? filteredPromos.map((promo) => (promo.validUntil ? formatDate(promo.validUntil.toISOString()) : "-")).join(", ")
                            : "-"}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {filteredPromos
                            .map((promo) => promo.lastCheckedAt)
                            .filter(Boolean)
                            .sort()
                            .at(-1)
                            ? formatDate(filteredPromos.map((promo) => promo.lastCheckedAt.toISOString()).filter(Boolean).sort().at(-1)!)
                            : "Not checked"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="grid gap-2">
                            <AdminPromoRefreshButton casinoSlug={casino.slug} />
                            <AdminPromoSourceSyncButton casinoSlug={casino.slug} />
                            {filteredPromos
                              .filter((promo) => !promo.isAffiliateOwned)
                              .map((promo) => (
                                <AdminPromoToggleButton key={promo.id} promoCodeId={promo.id} isActive={promo.isActive !== false} />
                              ))}
                            <span className="text-xs text-muted">Owned codes are edited in config/affiliateConfig.ts. Public scans never change partner links.</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-card border px-3 py-2 text-sm font-extrabold hover:no-underline ${
        active ? "border-accent bg-emerald-50 text-accent-dark" : "border-line bg-white text-blue-800"
      }`}
    >
      {label}
    </Link>
  );
}
