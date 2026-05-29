import type { Metadata } from "next";
import { CasinoLogo } from "@/components/CasinoLogo";
import { SectionHeader } from "@/components/SectionHeader";
import { TrustBadges } from "@/components/TrustBadges";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader
            eyebrow="About PromoGuard"
            title="A safer way to compare casino promos"
            description="PromoGuard exists to help users understand casino offers, review signals, and risk notes before they make a decision."
          />
        </div>
      </section>
      <section className="bg-soft py-16">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-card border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Mission</h2>
            <p className="mt-3 text-muted">
              PromoGuard is built around transparent casino reviews, clear affiliate disclosure, and responsible gambling. It is intentionally calm and consumer-advocate in tone, with no misleading claims about winning.
            </p>
          </div>
          <div className="rounded-card border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Team placeholders</h2>
            <div className="mt-4 grid gap-3">
              {["Founder / partnerships", "Casino reviewer", "Compliance reviewer"].map((role) => (
                <div key={role} className="flex items-center gap-3 rounded-card border border-line bg-soft p-3">
                  <CasinoLogo text={role.slice(0, 2).toUpperCase()} size="sm" />
                  <div>
                    <strong className="block text-navy">Add team member name</strong>
                    <span className="text-sm text-muted">{role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <TrustBadges />
        </div>
      </section>
    </main>
  );
}
