import { formatValue, formatGrowth } from "../utils/api";
import { METRIC_DEFS } from "../constants";
import { useApp } from "../context/AppContext";

function MetricCard({ metricKey, data, isActive, onClick }) {
  const def = METRIC_DEFS[metricKey];
  if (!def || !data) return null;

  const { latest, growth } = data;
  const isPositive = growth !== null && growth >= 0;
  const growthStr = formatGrowth(growth);

  return (
    <button
      onClick={() => onClick(metricKey)}
      className={`glass-card p-4 text-left transition-all duration-200 cursor-pointer w-full
        ${
          isActive
            ? "border-ledger/50 bg-ledger/5 ledger-glow"
            : "hover:border-white/20 hover:bg-white/8"
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-lg">{def.icon}</span>
        {growthStr && (
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded-full flex items-center gap-1
            ${
              isPositive
                ? "text-bull bg-bull/10 border border-bull/20"
                : "text-bear bg-bear/10 border border-bear/20"
            }`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isPositive ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
            {growthStr}
          </span>
        )}
      </div>

      <div className="mb-1">
        <span
          className="stat-value text-xl"
          style={{ color: isActive ? def.color : undefined }}
        >
          {formatValue(latest?.value, def.format)}
        </span>
      </div>

      <div>
        <p className="stat-label text-[10px]">{def.label}</p>
        {latest?.date && (
          <p className="text-[10px] text-ink-200/60 font-mono mt-0.5">
            FY {latest.date.split("-")[0]}
          </p>
        )}
      </div>

      {isActive && (
        <div className="mt-3 h-0.5 rounded-full bg-linear-to-r from-ledger to-transparent" />
      )}
    </button>
  );
}

export default function MetricsGrid() {
  const { metrics, activeMetric, setActiveMetric } = useApp();

  const availableMetrics = Object.entries(metrics).filter(
    ([, data]) => data?.latest
  );

  if (availableMetrics.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-ink-200 text-sm">
          No financial data available for this company.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {availableMetrics.map(([key, data], i) => (
        <div
          key={key}
          className="animate-fade-up opacity-0"
          style={{
            animationDelay: `${i * 60}ms`,
            animationFillMode: "forwards",
          }}
        >
          <MetricCard
            metricKey={key}
            data={data}
            isActive={activeMetric === key}
            onClick={setActiveMetric}
          />
        </div>
      ))}
    </div>
  );
}
