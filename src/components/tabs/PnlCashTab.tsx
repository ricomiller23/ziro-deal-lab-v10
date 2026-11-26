import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatPct, formatCompactCurrency } from '../../utils/formatters';
import { LineChart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const PnlCashTab: React.FC = () => {
  const { results } = useDealStore();

  const pnlChartData = results.annual.map((y) => ({
    year: String(y.year),
    revenue: Math.round(y.totalRevenue / 1e6 * 10) / 10,
    cogs: Math.round((y.totalRevenue - y.grossProfit) / 1e6 * 10) / 10,
    marketing: Math.round(y.marketingSpend / 1e6 * 10) / 10,
    overhead: Math.round(y.overheadExclMarketing / 1e6 * 10) / 10,
    ebitda: Math.round(y.ebitda / 1e6 * 10) / 10,
  }));

  return (
    <div className="space-y-6">
      {/* P&L Callout Notes */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Cash-Basis P&L Accounting:</strong> Revenue is recognized upon sale. No VAT, no corporate tax, and no working capital delays are modeled (preserving exact workbook logic). Opening cash is €0.
          </span>
        </div>
        <div className="shrink-0 text-amber-400 font-semibold">
          Peak Need: {formatCurrency(results.peakFundingNeed)}
        </div>
      </div>

      {/* P&L Breakdown Chart */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
        <h4 className="font-bold text-sm text-white mb-1">Annual Revenue & Cost Bridge (€M)</h4>
        <p className="text-xs text-slate-400 mb-4">Gross Margin, Marketing and Overhead evolution into EBITDA</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pnlChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(val: any) => [`€${val}M`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="revenue" name="Total Revenue" fill="#10b981" />
              <Bar dataKey="cogs" name="Cost of Goods Sold" fill="#ef4444" opacity={0.8} />
              <Bar dataKey="marketing" name="Marketing Spend (CAC)" fill="#f59e0b" opacity={0.8} />
              <Bar dataKey="overhead" name="Fixed Overhead" fill="#8b5cf6" opacity={0.8} />
              <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Annual P&L Table */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
        <h4 className="font-bold text-sm text-white mb-4">Complete Annual P&L & Cash Statement (EUR)</h4>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2.5 pr-4 font-semibold">P&L Line Item (EUR)</th>
              {results.annual.map((y) => (
                <th key={y.year} className="py-2.5 px-3 text-right font-semibold">
                  {y.year} {y.year === 2026 && '(Launch Q)'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {/* Revenue */}
            <tr className="bg-slate-900/40">
              <td className="py-2.5 pr-4 text-slate-200 font-sans font-semibold">Total Revenue</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2.5 px-3 text-right font-bold text-slate-100">
                  {formatCurrency(y.totalRevenue)}
                </td>
              ))}
            </tr>

            {/* Cost of Sales */}
            <tr>
              <td className="py-2 pr-4 text-slate-400 font-sans pl-3">Cost of Sales (COGS)</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2 px-3 text-right text-rose-400">
                  {formatCurrency(-(y.totalRevenue - y.grossProfit))}
                </td>
              ))}
            </tr>

            {/* Gross Profit */}
            <tr className="border-t border-slate-700 bg-emerald-500/5">
              <td className="py-2.5 pr-4 text-emerald-300 font-sans font-bold">Gross Profit</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2.5 px-3 text-right font-bold text-emerald-400">
                  {formatCurrency(y.grossProfit)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-1.5 pr-4 text-slate-400 font-sans pl-3 text-[11px]">Gross Margin %</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-1.5 px-3 text-right text-slate-300 text-[11px]">
                  {formatPct(y.grossMarginPct)}
                </td>
              ))}
            </tr>

            {/* Operating Expenses */}
            <tr>
              <td className="py-2 pr-4 text-slate-400 font-sans pl-3">Marketing / Programme CAC</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2 px-3 text-right text-amber-400">
                  {formatCurrency(-y.marketingSpend)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 text-slate-400 font-sans pl-3">Fixed Overhead (excl. Mktg)</td>
              {results.annual.map((y) => (
                <td key={y.year} className="py-2 px-3 text-right text-purple-400">
                  {formatCurrency(-y.overheadExclMarketing)}
                </td>
              ))}
            </tr>

            {/* EBITDA */}
            <tr className="border-t-2 border-slate-700 bg-amber-500/10">
              <td className="py-3 pr-4 text-amber-300 font-sans font-bold text-sm">EBITDA</td>
              {results.annual.map((y) => (
                <td
                  key={y.year}
                  className={`py-3 px-3 text-right font-black text-sm ${
                    y.ebitda >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(y.ebitda)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-1.5 pr-4 text-slate-400 font-sans pl-3 text-[11px]">EBITDA Margin %</td>
              {results.annual.map((y) => (
                <td
                  key={y.year}
                  className={`py-1.5 px-3 text-right text-[11px] ${
                    y.ebitdaMarginPct >= 0 ? 'text-slate-300' : 'text-rose-400'
                  }`}
                >
                  {formatPct(y.ebitdaMarginPct)}
                </td>
              ))}
            </tr>

            {/* Cumulative Cash */}
            <tr className="border-t border-slate-700 bg-slate-900/60">
              <td className="py-3 pr-4 text-slate-200 font-sans font-bold">Cumulative Cash Position</td>
              {results.annual.map((y) => (
                <td
                  key={y.year}
                  className={`py-3 px-3 text-right font-bold ${
                    y.yearEndCash >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(y.yearEndCash)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 text-slate-400 font-sans pl-3 text-[11px]">Lowest Cash in Year (Trough)</td>
              {results.annual.map((y) => (
                <td
                  key={y.year}
                  className={`py-2 px-3 text-right text-[11px] ${
                    y.lowestCashInYear < 0 ? 'text-rose-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {formatCurrency(y.lowestCashInYear)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
