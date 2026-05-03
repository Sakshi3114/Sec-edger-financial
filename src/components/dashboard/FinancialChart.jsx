import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { METRIC_DEFS } from '../../constants';
import { formatValue } from '../../utils/api';

function CustomTooltip({ active, payload, label, format }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded px-3 py-2 text-sm">
      <p className="text-gray-500 mb-0.5">FY {label}</p>
      <p className="font-semibold text-gray-900">{formatValue(payload[0]?.value, format)}</p>
    </div>
  );
}

export default function FinancialChart() {
  const { metrics, activeMetric } = useApp();
  const [chartType, setChartType] = useState('area');

  const def = METRIC_DEFS[activeMetric];
  const data = metrics[activeMetric];

  if (!def || !data?.series?.length) {
    return (
      <div className="card p-8 text-center text-sm text-gray-500">
        No chart data available for this metric.
      </div>
    );
  }

  const chartData = data.series.map(d => ({
    year: d.date.slice(0, 4),
    value: d.value,
  }));

  const values = chartData.map(d => d.value);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{def.label}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Annual · 10-K · {chartData.length} years</p>
        </div>
        <div className="flex border border-gray-200 rounded overflow-hidden text-xs">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 ${chartType === 'area' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 border-l border-gray-200 ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="h-60 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatValue(v, def.format)} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip format={def.format} />} />
              <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#2563eb', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatValue(v, def.format)} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip format={def.format} />} />
              <Bar dataKey="value" fill="#2563eb" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Earliest', val: values[0] },
          { label: 'Latest',   val: values[values.length - 1] },
          { label: 'Peak',     val: Math.max(...values) },
        ].map(({ label, val }) => (
          <div key={label}>
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{formatValue(val, def.format)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
