import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialLinks } from "@/components/SocialLinks";
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
            <h2 className="text-2xl font-black text-navy">How we verify offers</h2>
            <p className="mt-3 text-muted">
              Promo codes are shown only after an admin adds them from an external bonus source or approved API and marks them reviewed. The scheduled checker refreshes expiry, usage, and backend source-page signals without showing source-site names publicly.
            </p>
          </div>
          <div className="rounded-card border border-line bg-slate-950 p-6 text-white shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-black">Join the community</h2>
            <p className="mt-3 max-w-2xl text-slate-300">Discord, Telegram, and X links appear here once configured in environment variables.</p>
            <SocialLinks className="mt-5" showLabels />
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
