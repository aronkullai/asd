import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faHandshake, faMagnifyingGlassChart, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { SectionHeader } from "@/components/SectionHeader";
import { TrustBadges } from "@/components/TrustBadges";

export const metadata: Metadata = {
  title: "How it works"
};

const steps = [
  {
    icon: faShieldHalved,
    title: "We screen for safety",
    body: "Licensing, responsible gambling tools, payment transparency, bonus terms, and support quality are core review criteria."
  },
  {
    icon: faMagnifyingGlassChart,
    title: "We reference real feedback",
    body: "Trustpilot scores and review counts are tracked as external signals, while PromoGuard user reviews remain separate."
  },
  {
    icon: faClockRotateLeft,
    title: "We monitor promo codes",
    body: "The background researcher is designed to check configured promo sources on a schedule and audit changes."
  },
  {
    icon: faHandshake,
    title: "We disclose partner links",
    body: "Affiliate links can support PromoGuard without costing users extra, but rankings should still prioritize safety and clarity."
  }
];

export default function HowItWorksPage() {
  return (
    <main>
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader
            eyebrow="Transparency"
            title="How PromoGuard evaluates casinos"
            description="PromoGuard is designed to make casino comparison calmer, clearer, and grounded in objective, user-first criteria."
          />
        </div>
      </section>
      <section className="bg-soft py-16">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-5 md:grid-cols-2">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-card border border-line bg-white p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-card bg-emerald-50 text-accent-dark">
                <FontAwesomeIcon icon={step.icon} className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-muted">Step {index + 1}</p>
              <h2 className="text-2xl font-black text-navy">{step.title}</h2>
              <p className="mt-2 text-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="py-16" id="affiliate-disclosure">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="Disclosure" title="How outbound links work" description="Some casino links are partner links, and PromoGuard may earn a commission if a user joins through them. This should not cost the user more, and users should always check casino terms before depositing." />
          <div className="rounded-card border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Promo monitoring</h2>
            <p className="mt-3 text-muted">
              Promo codes can change. The backend includes a scheduled promo researcher that can be connected to partner APIs, approved RSS feeds, affiliate dashboards, or manual sources. It intentionally avoids aggressive scraping and records last-checked timestamps for auditability.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-soft py-16" id="responsible-gambling">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader eyebrow="Responsible gambling" title="18+ only. Play responsibly." description="Never gamble with money you cannot afford to lose. If gambling stops being fun, take a break and use local support or self-exclusion resources." />
          <TrustBadges />
        </div>
      </section>
    </main>
  );
}
