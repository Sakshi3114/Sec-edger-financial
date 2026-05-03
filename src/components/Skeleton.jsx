function Skeleton({ className = '' }) {
  return (
    <div className={`bg-white/5 rounded animate-pulse ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Company header skeleton */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-48 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-2.5 w-16 rounded" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Metrics grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="w-7 h-7 rounded" />
              <Skeleton className="w-14 h-5 rounded-full" />
            </div>
            <Skeleton className="h-7 w-28 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-64 sm:h-80 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="w-14 h-5 rounded" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
