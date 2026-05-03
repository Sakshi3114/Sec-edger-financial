import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FINANCIAL_METRICS } from '../constants';
import { formatValue } from '../utils/api';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, format, color }) {
  if (!active || !payload?.length) return null;

  const val = payload[0]?.value;

  return (
    <div className="glass-card px-4 py-3 border border-white/20 shadow-2xl shadow-black/60">
      <p className="font-mono text-xs text-ink-200 mb-1">FY {label}</p>
      <p className="font-display font-bold text-lg" style={{ color }}>
        {formatValue(val, format)}
      </p>
      {payload[0]?.payload?.form && (
        <p className="font-mono text-[10px] text-ink-200/60 mt-1">{payload[0].payload.form}</p>
      )}
    </div>
  );
}

// ─── Chart Toggle Button ──────────────────────────────────────────────────────
function ChartToggle({ type, active, onClick, children }) {
  return (
    <button
      onClick={() => onClick(type)}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
        active
          ? 'bg-ledger/20 text-ledger border border-ledger/30'
          : 'text-ink-200 hover:text-white border border-transparent hover:border-white/10'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Main Chart ───────────────────────────────────────────────────────────────
export default function FinancialChart() {
  const { metrics, activeMetric } = useApp();
  const [chartType, setChartType] = useState('area');

  const def = FINANCIAL_METRICS[activeMetric];
  const data = metrics[activeMetric];

  if (!def || !data?.series?.length) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-ink-200 text-sm">No chart data available for this metric.</p>
      </div>
    );
  }

  const chartData = data.series.map(d => ({
    year: d.date.split('-')[0],
    value: d.value,
    form: d.form,
    date: d.date,
  }));

  const color = def.color;
  const format = def.format;
  const minVal = Math.min(...chartData.map(d => d.value));
  const hasNegatives = minVal < 0;

  return (
    <div className="glass-card p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-display font-bold text-white text-lg">
            {def.label}
          </h3>
          <p className="text-xs text-ink-200 font-mono mt-0.5">
            Annual (10-K) · {chartData.length} year{chartData.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 self-start sm:self-auto">
          <ChartToggle type="area" active={chartType === 'area'} onClick={setChartType}>
            Area
          </ChartToggle>
          <ChartToggle type="bar" active={chartType === 'bar'} onClick={setChartType}>
            Bar
          </ChartToggle>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id={`grad-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#8FA7D8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatValue(v, format)}
                tick={{ fill: '#8FA7D8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                width={65}
              />
              <Tooltip content={<CustomTooltip format={format} color={color} />} />
              {hasNegatives && <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />}
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#grad-${activeMetric})`}
                dot={{ fill: color, r: 4, strokeWidth: 0 }}
                activeDot={{ fill: color, r: 6, strokeWidth: 2, stroke: '#0D1117' }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: '#8FA7D8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatValue(v, format)}
                tick={{ fill: '#8FA7D8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                width={65}
              />
              <Tooltip content={<CustomTooltip format={format} color={color} />} />
              {hasNegatives && <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />}
              <Bar
                dataKey="value"
                fill={color}
                fillOpacity={0.85}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Sparkline Summary Row */}
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-3">
        {[
          { label: 'Earliest', value: chartData[0]?.value },
          { label: 'Latest', value: chartData[chartData.length - 1]?.value },
          {
            label: 'Peak',
            value: Math.max(...chartData.map(d => d.value)),
          },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="stat-label text-[9px]">{label}</p>
            <p className="font-mono text-sm font-medium text-white mt-0.5">
              {formatValue(value, format)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
