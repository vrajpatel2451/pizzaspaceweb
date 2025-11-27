export function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="text-center p-4 animate-pulse">
          <div className="relative w-32 h-32 mx-auto rounded-full bg-slate-200" />
          <div className="h-5 bg-slate-200 rounded mt-4 w-3/4 mx-auto" />
          <div className="h-4 bg-slate-200 rounded mt-2 w-full" />
          <div className="h-4 bg-slate-200 rounded mt-1 w-5/6 mx-auto" />
          <div className="h-6 bg-slate-200 rounded mt-2 w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}
