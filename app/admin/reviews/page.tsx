import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminReviewManager } from "@/components/AdminReviewManager";
import { AdminTrustpilotMetaForm } from "@/components/AdminTrustpilotMetaForm";
import { SectionHeader } from "@/components/SectionHeader";
import { getCasinosWithDbOverrides } from "@/lib/casino-service";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Review manager"
};

export const dynamic = "force-dynamic";

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

export default async function AdminReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const casinos = await getCasinosWithDbOverrides();

  const reviews = hasUsableDatabaseUrl()
    ? await prisma.review.findMany({ orderBy: { reviewedAt: "desc" }, take: 100 }).catch(() => {
        return [];
      })
    : [];

  return (
    <main className="bg-soft">
      <section className="border-b border-line bg-white py-16">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <SectionHeader
            eyebrow="Admin"
            title="Review manager"
            description="Paste Trustpilot excerpts, user comments, ratings, original links, and manual Trustpilot summary metrics. API data is used when configured."
          />
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <AdminTrustpilotMetaForm casinos={casinos} />
          <AdminReviewManager casinos={casinos} initialReviews={JSON.parse(JSON.stringify(reviews))} />
        </div>
      </section>
    </main>
  );
}
