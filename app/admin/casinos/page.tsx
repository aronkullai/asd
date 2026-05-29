import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminCasinoManager } from "@/components/AdminCasinoManager";
import { SectionHeader } from "@/components/SectionHeader";
import { getCurrentUser } from "@/lib/auth";
import { getCasinosWithDbOverrides } from "@/lib/casino-service";

export const metadata: Metadata = {
  title: "Casino manager"
};

export const dynamic = "force-dynamic";

export default async function AdminCasinosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const casinos = await getCasinosWithDbOverrides();

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader
            eyebrow="Admin"
            title="Casino trust details"
            description="Edit licensing, payout, support, safety, Trustpilot, and approved promo validation source details without changing code."
          />
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <AdminCasinoManager casinos={casinos} />
        </div>
      </section>
    </main>
  );
}

