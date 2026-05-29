import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Terms"
};

export default function TermsPage() {
  return (
    <main>
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,900px)]">
          <SectionHeader eyebrow="Legal" title="Terms of Use" description="Core terms for using PromoGuard. Review with legal counsel before broad promotion." />
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto grid w-[min(100%-2rem,900px)] gap-6 text-muted">
          <section>
            <h2 className="text-2xl font-black text-navy">Affiliate disclosure</h2>
            <p>PromoGuard may earn commissions from partner casinos when users open outbound links and join a partner site. This should not cost users extra.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-navy">No gambling advice</h2>
            <p>PromoGuard provides comparison information only. Casino availability, legal status, and offer eligibility vary by jurisdiction.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-navy">Responsible gambling</h2>
            <p>Users must be 18+ or the legal gambling age in their jurisdiction. Never gamble with money you cannot afford to lose.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
