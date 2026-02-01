export function DealsSkeleton() {
  return (
    <section className="relative bg-white dark:bg-slate-950 py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <div className="h-6 w-32 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="h-10 w-64 mx-auto bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-5 w-80 mx-auto bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="aspect-square bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
