function Bone({ className = "" }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

export function MetricCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <Bone className="w-20 h-3" />
      <Bone className="w-28 h-6" />
      <Bone className="w-16 h-3" />
    </div>
  );
}

export function CompanyHeaderSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex gap-3">
        <Bone className="w-12 h-12 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Bone className="w-40 h-5" />
          <Bone className="w-24 h-3" />
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1">
            <Bone className="w-14 h-2.5" />
            <Bone className="w-20 h-3.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Bone className="w-28 h-4" />
          <Bone className="w-20 h-3" />
        </div>
        <Bone className="w-24 h-8 rounded-md" />
      </div>
      <Bone className="w-full h-60 rounded" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <CompanyHeaderSkeleton />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
      <ChartSkeleton />
    </div>
  );
}
