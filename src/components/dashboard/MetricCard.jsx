import { METRIC_DEFS } from '../../constants';
import { formatValue, formatGrowth } from '../../utils/api';

export default function MetricCard({ metricKey, data, isActive, onClick }) {
  const def = METRIC_DEFS[metricKey];
  if (!def || !data?.latest) return null;

  const { latest, growth } = data;
  const growthStr = formatGrowth(growth);
  const isUp = growth !== null && growth >= 0;

  return (
    <button
      onClick={() => onClick(metricKey)}
      className={`card p-4 text-left w-full transition-colors hover:border-blue-300 ${
        isActive ? 'border-blue-500 bg-blue-50' : ''
      }`}
    >
      <p className="text-xs text-gray-500 mb-1">{def.label}</p>
      <p className={`text-xl font-bold mb-1 ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
        {formatValue(latest.value, def.format)}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          FY {latest.date?.slice(0, 4)}
        </p>
        {growthStr && (
          <span className={isUp ? 'badge-green' : 'badge-red'}>
            {isUp ? '▲' : '▼'} {growthStr}
          </span>
        )}
      </div>
    </button>
  );
}
