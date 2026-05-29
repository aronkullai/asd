import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountActions } from "@/components/AccountActions";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Account"
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="bg-soft py-16">
      <section className="mx-auto grid w-[min(100%-2rem,720px)] gap-5 rounded-card border border-line bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-accent-dark">Account</p>
          <h1 className="text-3xl font-black text-navy">Your PromoGuard account</h1>
          <p className="mt-2 text-sm text-muted">Manage your active session and admin access.</p>
        </div>
        <div className="rounded-card border border-line bg-soft p-4">
          <p className="m-0 text-xs font-black uppercase tracking-wide text-muted">Signed in as</p>
          <p className="mt-1 font-bold text-navy">{user.email}</p>
        </div>
        <AccountActions />
      </section>
    </main>
  );
}

