import type { Metadata } from "next";
import { AdminReviewManager } from "@/components/AdminReviewManager";
import { SectionHeader } from "@/components/SectionHeader";
import { casinos } from "@/lib/casino-data";
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
            description="Paste Trustpilot excerpts, user comments, ratings, and original links. PromoGuard does not scrape Trustpilot or use their API."
          />
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto w-[min(100%-2rem,1180px)]">
          <AdminReviewManager casinos={casinos} initialReviews={JSON.parse(JSON.stringify(reviews))} />
        </div>
      </section>
    </main>
  );
}
