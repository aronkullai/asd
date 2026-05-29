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
          <SectionHeader eyebrow={eyebrow} title={title} description="Placeholder legal structure. Replace with jurisdiction-specific legal text before launch." />
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto grid w-[min(100%-2rem,900px)] gap-6 text-muted">
          <section>
            <h2 className="text-2xl font-black text-navy">Data we collect</h2>
            <p>Describe contact form submissions, analytics, cookies, affiliate click tracking, and any newsletter consent records.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-navy">How we use data</h2>
            <p>Explain support responses, site analytics, fraud prevention, promo updates, and compliance obligations.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-navy">Cookies and affiliate tracking</h2>
            <p>Explain cookie usage, affiliate attribution, consent choices, retention periods, and user rights.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
