import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatPct, formatNumber } from '../../utils/formatters';
import { Target, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from 'recharts';

export const CacLabTab: React.FC = () => {
  const { results, assumptions } = useDealStore();
  const cac = results.cacBuild;
  const years = [2026, 2027, 2028, 2029, 2030, 2031];

  const cacInflationData = years.map((yr, idx) => ({
    year: String(yr),
    index: cac.paidCostIndex[idx],
    programmeCac: Math.round(cac.programmeCacByYear[idx] * 10) / 10,
    fullyLoadedCac: Math.round(results.annual[idx]?.fullyLoadedCac * 10) / 10,
  }));

  const channelSpendData = cac.channels.map((c) => ({
    name: c.name,
    baseCac: Math.round(c.baseCac),
  }));

  const currentMix = cac.mixByYear[1]; // 2027 mix
  const isMixValid = currentMix?.mixCheckOk ?? true;

  return (
    <div className="space-y-6">
      {/* Top Bar: Mix Check + Inflation Index */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Channel Mix Check</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-2xl font-black ${isMixValid ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentMix ? (currentMix.totalMix * 100).toFixed(1) : 100}%
            </span>
            {isMixValid ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="h-4 w-4" /> Balanced 100%
              </span>
            ) : (
              <span className="text-xs text-rose-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="h-4 w-4" /> Must equal 100%
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Acquisition volume split across growth channels
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">2027 Programme CAC</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatCurrency(cac.programmeCacByYear[1], 'EUR', 2)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Fully loaded: {formatCurrency(results.annual[1]?.fullyLoadedCac, 'EUR', 2)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">2031 Saturated CAC</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {formatCurrency(cac.programmeCacByYear[5], 'EUR', 2)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Includes {((cac.paidCostIndex[5] - 1) * 100).toFixed(0)}% paid media inflation
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <h4 className="font-bold text-sm text-white mb-1">CAC Saturation & Inflation Curve (€)</h4>
          <p className="text-xs text-slate-400 mb-4">Programme vs Fully-Loaded (includes growth marketing team)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cacInflationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`€${val}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="programmeCac" name="Programme CAC (€)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="fullyLoadedCac" name="Fully-Loaded CAC (€)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <h4 className="font-bold text-sm text-white mb-1">Channel Base CAC Comparison (€)</h4>
          <p className="text-xs text-slate-400 mb-4">Baseline channel acquisition cost at launch</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelSpendData} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`€${val}`, 'Base CAC']}
                />
                <Bar dataKey="baseCac" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Channel Build Table */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
        <h4 className="font-bold text-sm text-white mb-4">Bottom-Up Channel Acquisition Architecture</h4>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-2.5 pr-4">Channel Name</th>
              <th className="py-2.5 px-3 text-right">Base CPA (EUR)</th>
              <th className="py-2.5 px-3 text-right">2027 Spend</th>
              <th className="py-2.5 px-3 text-right">2031 Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {cac.channels.map((c) => (
              <tr key={c.name} className="hover:bg-slate-900/40">
                <td className="py-2.5 pr-4 font-sans font-semibold text-slate-200">{c.name}</td>
                <td className="py-2.5 px-3 text-right text-amber-400 font-bold">
                  {formatCurrency(c.baseCac, 'EUR', 2)}
                </td>
                <td className="py-2.5 px-3 text-right text-slate-300">
                  {formatCurrency(cac.spendByChannelByYear[c.name]?.[1] || 0)}
                </td>
                <td className="py-2.5 px-3 text-right text-cyan-400 font-bold">
                  {formatCurrency(cac.spendByChannelByYear[c.name]?.[5] || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
