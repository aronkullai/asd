export default function Loading() {
  return (
    <main className="bg-soft py-16">
      <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-4">
        <div className="h-40 animate-pulse rounded-card border border-line bg-white" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-44 animate-pulse rounded-card border border-line bg-white" />
          <div className="h-44 animate-pulse rounded-card border border-line bg-white" />
          <div className="h-44 animate-pulse rounded-card border border-line bg-white" />
        </div>
      </div>
    </main>
  );
}
