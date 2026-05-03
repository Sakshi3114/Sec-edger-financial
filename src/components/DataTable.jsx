import { useApp } from "../context/AppContext";
import { FINANCIAL_METRICS } from "../constants";
import { formatValue, calcGrowth, formatGrowth } from "../utils/api";

export default function DataTable() {
  const { metrics, activeMetric } = useApp();

  const def = FINANCIAL_METRICS[activeMetric];
  const data = metrics[activeMetric];

  if (!def || !data?.series?.length) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-ink-200 text-sm">No table data available.</p>
      </div>
    );
  }

  const rows = [...data.series].reverse();

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <span className="text-xl">{def.icon}</span>
        <div>
          <h3 className="font-display font-bold text-white">{def.label}</h3>
          <p className="text-xs text-ink-200 font-mono">
            Annual history (10-K filings)
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-ink-200">
                Fiscal Year
              </th>
              <th className="text-right px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-ink-200">
                Value
              </th>
              <th className="text-right px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-ink-200">
                YoY Change
              </th>
              <th className="text-right px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-ink-200 hidden sm:table-cell">
                Filing
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, i) => {
              const nextRow = rows[i + 1];
              const growth = nextRow
                ? calcGrowth(row.value, nextRow.value)
                : null;
              const growthStr = formatGrowth(growth);
              const isPositive = growth !== null && growth >= 0;
              const isLatest = i === 0;

              return (
                <tr
                  key={row.date}
                  className={`transition-colors group ${
                    isLatest ? "bg-ledger/5" : "hover:bg-white/3"
                  }`}
                >
                  {/* Year */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {isLatest && (
                        <span className="w-1.5 h-1.5 rounded-full bg-ledger shrink-0" />
                      )}
                      <span
                        className={`font-mono font-medium ${
                          isLatest ? "text-ledger" : "text-white"
                        }`}
                      >
                        {row.date.split("-")[0]}
                      </span>
                      <span className="text-[10px] text-ink-200/60 font-mono hidden sm:inline">
                        {row.date}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`font-mono font-semibold ${
                        isLatest ? "text-white" : "text-ink-100"
                      }`}
                    >
                      {formatValue(row.value, def.format)}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    {growthStr ? (
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded ${
                          isPositive
                            ? "text-bull bg-bull/10"
                            : "text-bear bg-bear/10"
                        }`}
                      >
                        {growthStr}
                      </span>
                    ) : (
                      <span className="text-ink-200/40 text-xs">—</span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                    <span className="tag">{row.form}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] text-ink-200/60 font-mono">
          Source: SEC EDGAR XBRL · All values in USD
        </p>
        <p className="text-[10px] text-ink-200/60 font-mono">
          {rows.length} year{rows.length !== 1 ? "s" : ""} of data
        </p>
      </div>
    </div>
  );
}
