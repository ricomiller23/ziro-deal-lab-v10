import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatPct, formatMultiple } from '../../utils/formatters';
import { PieChart, AlertTriangle, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export const UnitEconomicsTab: React.FC = () => {
  const { results, assumptions } = useDealStore();
  const ue = results.unitEconomics;

  return (
    <div className="space-y-6">
      {/* Critical Insight Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-400 font-semibold">The Unit Economics Asymmetry:</strong> A baseline-only member generates <span className="text-rose-400 font-bold">-€18.44 negative contribution</span> in Year 1 before marketing spend. Ziro is structurally unprofitable on single-test customers. Profitability is entirely driven by (a) <span className="text-emerald-400 font-bold">Optimize attach (+€396.27 Year 1 contribution)</span> and (b) <span className="text-cyan-400 font-bold">annual renewals (60% cohort retention)</span>.
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Revenue / Member / Year</div>
          <div className="text-2xl font-black text-white mt-1">
            {formatCurrency(ue.revenuePerActiveMemberYear, 'EUR', 2)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            €199 base + {formatPct(ue.optimizeAttachRate)} attach @ 2.0 tests
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">COGS / Member / Year</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {formatCurrency(ue.totalCostPerActiveMemberYear, 'EUR', 2)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Kit, retests, Nicoya, AI & processing
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Contribution Margin</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(ue.contributionPerActiveMemberYear, 'EUR', 2)}{' '}
            <span className="text-sm font-semibold">({formatPct(ue.contributionMarginPct)})</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Annual gross contribution per active member
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Lifetime Value (LTV)</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {formatCurrency(ue.ltv, 'EUR', 2)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {ue.expectedLifetimeYears.toFixed(1)} yrs lifetime (Max CAC: {formatCurrency(ue.maxCac3x, 'EUR', 2)})
          </div>
        </div>
      </div>

      {/* Year 1 Waterfall Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waterfall A: Baseline Only */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-rose-500/20 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h4 className="font-bold text-sm text-white">Cohort A: Baseline Only (Year 1)</h4>
              <p className="text-xs text-rose-400">Single diagnostic kit, no Optimize enrollments</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold">
              UNPROFITABLE
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-300 font-sans">Annual Membership Fee</span>
              <span className="text-emerald-400 font-bold">+{formatCurrency(ue.year1BaselineOnly.revenue, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span className="font-sans pl-2">Baseline Diagnostic Kit (lab + device)</span>
              <span className="text-rose-400">-{formatCurrency(ue.year1BaselineOnly.testCost, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span className="font-sans pl-2">Nicoya Per-Client Fee (£7/mo @ 1.17)</span>
              <span className="text-rose-400">-{formatCurrency(ue.year1BaselineOnly.nicoyaFee, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span className="font-sans pl-2">AI Extraction (3 pages @ $0.07)</span>
              <span className="text-rose-400">-{formatCurrency(ue.year1BaselineOnly.aiExtraction, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span className="font-sans pl-2">Stripe Payment Fee (2%)</span>
              <span className="text-rose-400">-{formatCurrency(ue.year1BaselineOnly.paymentProcessing, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-slate-700 bg-rose-500/10 px-2 rounded-lg text-sm font-bold">
              <span className="text-rose-300 font-sans">Year 1 Net Contribution</span>
              <span className="text-rose-400">{formatCurrency(ue.year1BaselineOnly.year1Contribution, 'EUR', 2)}</span>
            </div>
          </div>
        </div>

        {/* Waterfall B: Optimize Attached */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-emerald-500/20 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h4 className="font-bold text-sm text-white">Cohort B: Optimize Attached (Year 1)</h4>
              <p className="text-xs text-emerald-400">Base kit + 4 quarterly retests (€99 each)</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              HIGH MARGIN
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-300 font-sans">Total Annual Revenue (€199 + €396)</span>
              <span className="text-emerald-400 font-bold">+{formatCurrency(ue.year1OptimizeAttached.revenue, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span className="font-sans pl-2">Baseline Kit + 4 Retests (€45 each)</span>
              <span className="text-rose-400">-{formatCurrency(ue.year1OptimizeAttached.testCost, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span className="font-sans pl-2">Nicoya Per-Client Fee (£7/mo @ 1.17)</span>
              <span className="text-rose-400">-{formatCurrency(ue.year1OptimizeAttached.nicoyaFee, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span className="font-sans pl-2">AI Extraction (15 pages total)</span>
              <span className="text-rose-400">-{formatCurrency(ue.year1OptimizeAttached.aiExtraction, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span className="font-sans pl-2">Stripe Payment Fee (2%)</span>
              <span className="text-rose-400">-{formatCurrency(ue.year1OptimizeAttached.paymentProcessing, 'EUR', 2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-slate-700 bg-emerald-500/10 px-2 rounded-lg text-sm font-bold">
              <span className="text-emerald-300 font-sans">Year 1 Net Contribution</span>
              <span className="text-emerald-400">+{formatCurrency(ue.year1OptimizeAttached.year1Contribution, 'EUR', 2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2D Heatmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap 1: LTV:CAC Ratio */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
          <h4 className="font-bold text-sm text-white mb-1">LTV : CAC Sensitivity Matrix</h4>
          <p className="text-xs text-slate-400 mb-4">CAC (Rows) vs Annual Renewal Rate (Cols). Target ≥ 3.0x</p>

          <table className="w-full text-xs text-center font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 text-left font-sans font-semibold">CAC (€)</th>
                {ue.renewalAxis.map((r) => (
                  <th key={r} className="py-2 px-2 font-semibold">
                    {(r * 100).toFixed(0)}% Ren
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ue.heatmapCacRenewal.map((row) => (
                <tr key={row.cacRow}>
                  <td className="py-2.5 text-left font-bold text-slate-300 font-sans">€{row.cacRow}</td>
                  {row.values.map((val, idx) => {
                    const isTarget = val >= 3.0;
                    const isDangerous = val < 2.0;
                    return (
                      <td
                        key={idx}
                        className={`py-2 px-2 font-bold ${
                          isTarget
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isDangerous
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {val.toFixed(2)}x
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Heatmap 2: Member LTV */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
          <h4 className="font-bold text-sm text-white mb-1">Lifetime Value (LTV) Matrix (€)</h4>
          <p className="text-xs text-slate-400 mb-4">Attach Rate (Rows) vs Annual Renewal Rate (Cols)</p>

          <table className="w-full text-xs text-center font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 text-left font-sans font-semibold">Attach</th>
                {ue.renewalAxis.map((r) => (
                  <th key={r} className="py-2 px-2 font-semibold">
                    {(r * 100).toFixed(0)}% Ren
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ue.heatmapRenewalAttach.map((row) => (
                <tr key={row.attachRow}>
                  <td className="py-2.5 text-left font-bold text-slate-300 font-sans">
                    {(row.attachRow * 100).toFixed(0)}%
                  </td>
                  {row.values.map((val, idx) => (
                    <td key={idx} className="py-2 px-2 font-bold text-cyan-300 bg-slate-900/60">
                      €{Math.round(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
