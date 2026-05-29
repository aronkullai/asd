import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Privacy"
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" eyebrow="Legal" />;
}

function LegalPage({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <main>
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,900px)]">
          <SectionHeader eyebrow={eyebrow} title={title} description="Privacy notes for contact forms, analytics events, account sessions, and affiliate attribution." />
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto grid w-[min(100%-2rem,900px)] gap-6 text-muted">
          <section>
            <h2 className="text-2xl font-black text-navy">Data we collect</h2>
            <p>PromoGuard may process contact form submissions, account login sessions, analytics events, cookies, affiliate click tracking, and consent records.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-navy">How we use data</h2>
            <p>Data is used for support responses, site analytics, abuse prevention, promo quality checks, and compliance obligations.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-navy">Cookies and affiliate tracking</h2>
            <p>Cookies may support account sessions, affiliate attribution, security, consent choices, and aggregate analytics.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
