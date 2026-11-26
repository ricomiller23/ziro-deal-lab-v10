import React, { useState } from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatNumber, formatPct } from '../../utils/formatters';
import { Users, ChevronDown, ChevronRight, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const MembersRevenueTab: React.FC = () => {
  const { results, assumptions } = useDealStore();
  const [showQuarters, setShowQuarters] = useState(false);

  const annualChartData = results.annual.map((y) => ({
    year: String(y.year),
    baselineRev: Math.round(y.baselineRevenue / 1e6 * 10) / 10,
    optimizeRev: Math.round(y.optimizeRevenue / 1e6 * 10) / 10,
    totalRev: Math.round(y.totalRevenue / 1e6 * 10) / 10,
    activeMembersK: Math.round(y.activeMembersYearEnd / 1000),
  }));

  const quarterlyChartData = results.quarterly.map((q) => ({
    quarter: q.quarterLabel,
    activeMembers: Math.round(q.activeMembers),
    newMembers: Math.round(q.newMembers),
    revenue: Math.round(q.totalRevenue / 1000),
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">2031 Ending Members</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {formatNumber(results.activeMembers2031)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {formatNumber(results.activeMembers2031 * assumptions.optimizeAttachRate)} enrolled in Optimize (30%)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Annual Renewal Rate</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatPct(assumptions.annualRenewalRate)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            40% annual cohort churn (1.0 / (1 - 0.6) = 2.5 yr lifetime)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">2031 Revenue Run-Rate</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatCurrency(results.revenue2031)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Cash-basis revenue recognized upon membership sale
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <h4 className="font-bold text-sm text-white mb-1">Annual Revenue Composition (€M)</h4>
          <p className="text-xs text-slate-400 mb-4">Baseline Membership (€199) vs Optimize Retests (€99)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={annualChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`€${val}M`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="baselineRev" name="Baseline Revenue" stackId="a" fill="#3b82f6" />
                <Bar dataKey="optimizeRev" name="Optimize Retests" stackId="a" fill="#10b981" />
                <Line type="monotone" dataKey="totalRev" name="Total Revenue" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <h4 className="font-bold text-sm text-white mb-1">Active Member Ramp (Quarterly)</h4>
          <p className="text-xs text-slate-400 mb-4">Q4 2026 launch through Q4 2031</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quarterlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="quarter" stroke="#64748b" tick={{ fontSize: 10 }} interval={3} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [formatNumber(val), 'Active Members']}
                />
                <Area type="monotone" dataKey="activeMembers" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Annual Summary Table */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
        <h4 className="font-bold text-sm text-white mb-4">Annual Membership & Revenue Ledger</h4>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 pr-4 font-semibold">Metric</th>
              {results.annual.map((y) => (
                <th key={y.year} className="py-2.5 px-3 text-right font-semibold">
                  {y.year} {y.year === 2026 && '(Launch Q)'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="py-2.5 pr-4 text-slate-300 font-sans">Active Members (Year-End)</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2.5 px-3 text-right font-bold text-cyan-400">
                  {formatNumber(y.activeMembersYearEnd)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 text-slate-400 font-sans">New Memberships Sold</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2 px-3 text-right text-slate-300">
                  {formatNumber(y.newMembersSold)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 text-slate-400 font-sans">Renewals</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2 px-3 text-right text-slate-300">
                  {formatNumber(y.renewals)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 text-slate-400 font-sans">Churn (Non-Renewing)</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2 px-3 text-right text-rose-400">
                  {formatNumber(y.churn)}
                </td>
              ))}
            </tr>
            <tr className="bg-slate-900/40">
              <td className="py-2.5 pr-4 text-slate-200 font-sans font-semibold">Baseline Revenue (€)</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2.5 px-3 text-right font-medium text-slate-200">
                  {formatCurrency(y.baselineRevenue)}
                </td>
              ))}
            </tr>
            <tr className="bg-slate-900/40">
              <td className="py-2.5 pr-4 text-slate-200 font-sans font-semibold">Optimize Retests Revenue (€)</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2.5 px-3 text-right font-medium text-emerald-400">
                  {formatCurrency(y.optimizeRevenue)}
                </td>
              ))}
            </tr>
            <tr className="border-t border-slate-700 bg-amber-500/5">
              <td className="py-3 pr-4 text-amber-300 font-sans font-bold">Total Revenue (€)</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-3 px-3 text-right font-bold text-amber-400">
                  {formatCurrency(y.totalRevenue)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Expandable 21-Quarter Ledger */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
        <button
          onClick={() => setShowQuarters(!showQuarters)}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            {showQuarters ? <ChevronDown className="h-4 w-4 text-amber-400" /> : <ChevronRight className="h-4 w-4 text-amber-400" />}
            <span>Full 21-Quarter Granular Simulation Ledger (Q4 2026 – Q4 2031)</span>
          </div>
          <span className="text-xs font-normal text-amber-400">
            {showQuarters ? 'Collapse quarters' : 'Expand all 21 quarters'}
          </span>
        </button>

        {showQuarters && (
          <div className="mt-4 overflow-x-auto pt-2 border-t border-slate-800">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2 pr-3">Quarter</th>
                  <th className="py-2 px-2 text-right">Active Members</th>
                  <th className="py-2 px-2 text-right">New Members</th>
                  <th className="py-2 px-2 text-right">Renewals</th>
                  <th className="py-2 px-2 text-right">Churn</th>
                  <th className="py-2 px-2 text-right">Total Rev (€)</th>
                  <th className="py-2 px-2 text-right">EBITDA (€)</th>
                  <th className="py-2 px-2 text-right">Cash (€)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {results.quarterly.map((q) => (
                  <tr key={q.quarterLabel} className="hover:bg-slate-900/40">
                    <td className="py-2 pr-3 font-sans font-medium text-slate-300">{q.quarterLabel}</td>
                    <td className="py-2 px-2 text-right text-cyan-400">{formatNumber(q.activeMembers)}</td>
                    <td className="py-2 px-2 text-right text-slate-300">{formatNumber(q.newMembers)}</td>
                    <td className="py-2 px-2 text-right text-slate-400">{formatNumber(q.renewals)}</td>
                    <td className="py-2 px-2 text-right text-rose-400">{formatNumber(q.churn)}</td>
                    <td className="py-2 px-2 text-right text-emerald-400">{formatCurrency(q.totalRevenue)}</td>
                    <td className={`py-2 px-2 text-right ${q.ebitda >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatCurrency(q.ebitda)}
                    </td>
                    <td className={`py-2 px-2 text-right font-bold ${q.cumulativeCash >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
                      {formatCurrency(q.cumulativeCash)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
