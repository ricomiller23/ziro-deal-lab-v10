import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatNumber, formatPct, formatCompactCurrency } from '../../utils/formatters';
import { Layers, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const ScenariosTab: React.FC = () => {
  const { results, assumptions, updateAssumption } = useDealStore();
  const sc = results.scenarios;

  const scenarioColumns = [
    { key: 'mgmt', data: sc.managementCase, title: 'Management Case', highlight: true },
    { key: 's1', data: sc.scenario1, title: 'Scenario 1 (0.2%)', highlight: false },
    { key: 's2', data: sc.scenario2, title: 'Scenario 2 (0.5%)', highlight: false },
    { key: 's3', data: sc.scenario3, title: 'Scenario 3 (1.0%)', highlight: false },
    { key: 'custom', data: sc.customScenario, title: `Custom (${(assumptions.customPenetration * 100).toFixed(2)}%)`, highlight: false },
  ];

  const tornadoChartData = sc.tornadoData.map((t) => ({
    lever: t.lever,
    swingM: Math.round(t.swingEbitda / 1e6 * 10) / 10,
    lowM: Math.round(t.lowEbitda / 1e6 * 10) / 10,
    highM: Math.round(t.highEbitda / 1e6 * 10) / 10,
  }));

  return (
    <div className="space-y-6">
      {/* Top Levers & Mode Selection */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-400" />
            <span>Market-Penetration Stress Framework</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Re-runs the verified unit economics, CAC and overhead against lower penetration ceilings of the 73M UK + Ireland adult population.
          </p>
        </div>

        {/* CAC Method Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 px-2 font-medium">CAC Engine:</span>
          <button
            onClick={() => updateAssumption('cacMethod', 'bottomUp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              assumptions.cacMethod === 'bottomUp'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bottom-Up CAC (Workbook)
          </button>
          <button
            onClick={() => updateAssumption('cacMethod', 'flat99')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
              assumptions.cacMethod === 'flat99'
                ? 'bg-rose-500 text-white font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flat €99 (Stress Model)
          </button>
        </div>
      </div>

      {/* Custom Penetration Slider */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-slate-300">
              Interactive Custom Penetration Slider: <strong className="text-amber-400 font-bold">{(assumptions.customPenetration * 100).toFixed(2)}%</strong>
            </span>
            <span className="text-slate-400 font-mono">
              = {formatNumber(assumptions.ukIrelandPopulation * assumptions.customPenetration)} active members in 2031
            </span>
          </div>
          <input
            type="range"
            min={0.0005}
            max={0.02}
            step={0.0005}
            value={assumptions.customPenetration}
            onChange={(e) => updateAssumption('customPenetration', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
        <h4 className="font-bold text-sm text-white mb-4">2031 Side-by-Side Outcomes Matrix</h4>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 pr-4 font-semibold">Outcome Metric (2031)</th>
              {scenarioColumns.map((col) => (
                <th
                  key={col.key}
                  className={`py-2.5 px-3 text-right font-semibold ${
                    col.highlight ? 'text-amber-400 bg-amber-500/10 rounded-t-lg' : 'text-slate-200'
                  }`}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="py-2.5 pr-4 font-sans text-slate-300">Penetration of UK + IE (73M)</td>
              {scenarioColumns.map((col) => (
                <td key={col.key} className={`py-2.5 px-3 text-right font-bold ${col.highlight ? 'bg-amber-500/5 text-amber-300' : 'text-cyan-400'}`}>
                  {(col.data.penetrationCeilingPct * 100).toFixed(2)}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-sans text-slate-300">Active Members (2031)</td>
              {scenarioColumns.map((col) => (
                <td key={col.key} className={`py-2.5 px-3 text-right font-bold ${col.highlight ? 'bg-amber-500/5 text-amber-400' : 'text-slate-100'}`}>
                  {formatNumber(col.data.active2031)}
                </td>
              ))}
            </tr>
            <tr className="bg-slate-900/30">
              <td className="py-2.5 pr-4 font-sans text-slate-200 font-semibold">Total Revenue (EUR)</td>
              {scenarioColumns.map((col) => (
                <td key={col.key} className={`py-2.5 px-3 text-right ${col.highlight ? 'bg-amber-500/5 font-bold text-slate-100' : 'text-slate-200'}`}>
                  {formatCurrency(col.data.revenue2031)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-sans text-slate-300">Gross Profit (EUR)</td>
              {scenarioColumns.map((col) => (
                <td key={col.key} className={`py-2.5 px-3 text-right text-emerald-400 ${col.highlight ? 'bg-amber-500/5 font-bold' : ''}`}>
                  {formatCurrency(col.data.grossProfit2031)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-sans text-slate-300">Marketing / CAC Spend</td>
              {scenarioColumns.map((col) => (
                <td key={col.key} className={`py-2.5 px-3 text-right text-rose-400 ${col.highlight ? 'bg-amber-500/5' : ''}`}>
                  {formatCurrency(col.data.marketing2031)}
                </td>
              ))}
            </tr>
            <tr className="border-t-2 border-slate-700 bg-amber-500/10 font-bold text-sm">
              <td className="py-3 pr-4 font-sans text-amber-300">2031 EBITDA (EUR)</td>
              {scenarioColumns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-3 text-right font-black ${
                    col.data.ebitda2031 >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  } ${col.highlight ? 'bg-amber-500/15 text-base' : ''}`}
                >
                  {formatCurrency(col.data.ebitda2031)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-sans text-slate-300">Cumulative Cash / EBITDA (2026–31)</td>
              {scenarioColumns.map((col) => (
                <td
                  key={col.key}
                  className={`py-2.5 px-3 text-right font-bold ${
                    col.data.cumulativeEbitda >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  } ${col.highlight ? 'bg-amber-500/5' : ''}`}
                >
                  {formatCurrency(col.data.cumulativeEbitda)}
                </td>
              ))}
            </tr>
            <tr className="bg-rose-500/5">
              <td className="py-3 pr-4 font-sans text-rose-300 font-bold">Peak Funding Need (EUR)</td>
              {scenarioColumns.map((col) => (
                <td key={col.key} className={`py-3 px-3 text-right font-black text-rose-400 ${col.highlight ? 'bg-amber-500/5' : ''}`}>
                  {formatCurrency(col.data.peakFundingNeed)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-sans text-slate-300">First EBITDA-Positive Year</td>
              {scenarioColumns.map((col) => (
                <td key={col.key} className={`py-2.5 px-3 text-right font-bold text-white ${col.highlight ? 'bg-amber-500/5' : ''}`}>
                  {String(col.data.firstEbitdaPositiveYear)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2D Heatmap & Tornado Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap: Penetration x Attach */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
          <h4 className="font-bold text-sm text-white mb-1">2D Heatmap: 2031 EBITDA (€M)</h4>
          <p className="text-xs text-slate-400 mb-4">Penetration Ceiling (Rows) vs Optimize Attach Rate (Cols)</p>

          <table className="w-full text-xs text-center font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2 text-left font-sans">Penetration</th>
                <th className="py-2 px-2">10% Attach</th>
                <th className="py-2 px-2">20% Attach</th>
                <th className="py-2 px-2">30% Attach</th>
                <th className="py-2 px-2">40% Attach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sc.heatmapPenetrationAttach.map((row) => (
                <tr key={row.penetrationRow}>
                  <td className="py-2.5 text-left font-bold text-slate-300 font-sans">{row.penetrationRow}</td>
                  {row.values.map((v, i) => {
                    const inMillions = v / 1e6;
                    const isPositive = v >= 0;
                    return (
                      <td
                        key={i}
                        className={`py-2 px-2 font-bold ${
                          inMillions >= 5.0
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isPositive
                            ? 'bg-amber-500/10 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        €{inMillions.toFixed(1)}M
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tornado Sensitivity Chart */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <h4 className="font-bold text-sm text-white mb-1">Tornado Sensitivity: 2031 EBITDA Swing</h4>
          <p className="text-xs text-slate-400 mb-4">Ranked by impact on EBITDA (€M swing)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tornadoChartData} layout="vertical" margin={{ top: 5, right: 10, left: 70, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="lever" type="category" stroke="#64748b" tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`€${val}M`, 'EBITDA Swing']}
                />
                <Bar dataKey="swingM" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
