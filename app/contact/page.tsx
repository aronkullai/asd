import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialLinks } from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader
            eyebrow="Contact"
            title="Talk to PromoGuard"
            description="Use the form for partner updates, correction requests, responsible gambling resources, or casino review feedback."
          />
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 lg:grid-cols-[1fr_1fr]">
          <ContactForm />
          <aside className="rounded-card border border-line bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-navy">Business contact</h2>
            <div className="mt-4 grid gap-3 text-muted">
              <p><strong className="text-navy">Email:</strong> hello@promoguard.example</p>
              <p><strong className="text-navy">Partnerships:</strong> partners@promoguard.example</p>
              <p><strong className="text-navy">Legal entity:</strong> Add registered business details before launch.</p>
              <p><strong className="text-navy">Address:</strong> Add business address or registered agent details.</p>
            </div>
            <div className="mt-6 rounded-card bg-slate-950 p-4">
              <p className="mb-3 text-sm font-black uppercase tracking-wide text-slate-300">Community</p>
              <SocialLinks showLabels />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
