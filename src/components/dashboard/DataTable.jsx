import { useApp } from "../../context/AppContext";
import { METRIC_DEFS } from "../../constants";
import { formatValue, calcGrowth, formatGrowth } from "../../utils/api";

export default function DataTable() {
  const { metrics, activeMetric } = useApp();
  const def = METRIC_DEFS[activeMetric];
  const data = metrics[activeMetric];

  if (!def || !data?.series?.length) {
    return (
      <div className="card p-8 text-center text-sm text-gray-500">
        No table data available.
      </div>
    );
  }

  const rows = [...data.series].reverse();

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{def.label}</h3>
        <p className="text-xs text-gray-400 mt-0.5">Annual 10-K filings</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                Year
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                Value
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                YoY Change
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide hidden sm:table-cell">
                Filing
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row, i) => {
              const prev = rows[i + 1];
              const pct = prev ? calcGrowth(row.value, prev.value) : null;
              const growthStr = formatGrowth(pct);
              const isUp = pct !== null && pct >= 0;
              const isLatest = i === 0;

              return (
                <tr
                  key={row.date}
                  className={isLatest ? "bg-blue-50" : "hover:bg-gray-50"}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {isLatest && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      )}
                      <span
                        className={`font-medium ${
                          isLatest ? "text-blue-700" : "text-gray-900"
                        }`}
                      >
                        {row.date.slice(0, 4)}
                      </span>
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        {row.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">
                    {formatValue(row.value, def.format)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {growthStr ? (
                      <span className={isUp ? "badge-green" : "badge-red"}>
                        {isUp ? "▲" : "▼"} {growthStr}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right hidden sm:table-cell">
                    <span className="badge-gray">{row.form}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
        <span>Source: SEC EDGAR XBRL</span>
        <span>
          {rows.length} year{rows.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
