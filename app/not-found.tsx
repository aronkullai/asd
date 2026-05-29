import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="bg-soft py-20">
      <section className="mx-auto grid w-[min(100%-2rem,760px)] gap-5 rounded-card border border-line bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-accent-dark">404</p>
        <h1 className="text-4xl font-black text-navy">This page is off the board</h1>
        <p className="text-muted">
          The casino, code, or review page you opened is not available. Head back to a verified comparison surface.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/casinos" className="rounded-card bg-accent px-4 py-3 font-extrabold text-white hover:bg-accent-dark hover:text-white hover:no-underline">
            Compare casinos
          </Link>
          <Link href="/promos" className="rounded-card border border-line bg-white px-4 py-3 font-extrabold text-blue-800 hover:bg-blue-50 hover:no-underline">
            Browse promo codes
          </Link>
        </div>
      </section>
    </main>
  );
}
