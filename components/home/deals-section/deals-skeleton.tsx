export function DealsSkeleton() {
  return (
    <section className="relative bg-slate-950 py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-10 sm:mb-12 space-y-4">
          <div className="h-6 w-32 mx-auto bg-slate-800 rounded-full animate-pulse" />
          <div className="h-10 w-64 mx-auto bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-5 w-80 mx-auto bg-slate-800 rounded-lg animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="flex gap-5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] sm:w-[320px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800"
            >
              <div className="aspect-[4/3] bg-slate-800 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-slate-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-800 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
