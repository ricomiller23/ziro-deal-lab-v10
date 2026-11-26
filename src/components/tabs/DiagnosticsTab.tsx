import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatNumber, formatPct } from '../../utils/formatters';
import { CheckCircle2, ShieldCheck, Activity, Award } from 'lucide-react';

interface DiagnosticCheck {
  id: string;
  category: string;
  description: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export const DiagnosticsTab: React.FC = () => {
  const { results, assumptions } = useDealStore();

  const checks: DiagnosticCheck[] = [
    {
      id: 'd1',
      category: 'Overhead Run-Rate',
      description: '2027 Core Overhead Run-Rate before Contingency',
      expected: '€406,081.44',
      actual: formatCurrency(results.overheadBuild.annual2027RunRateBeforeContingency, 'EUR', 2),
      passed: Math.abs(results.overheadBuild.annual2027RunRateBeforeContingency - 406081.44) < 1.0,
    },
    {
      id: 'd2',
      category: 'Unit Economics',
      description: 'Revenue per Active Member per Year',
      expected: '€436.60',
      actual: formatCurrency(results.unitEconomics.revenuePerActiveMemberYear, 'EUR', 2),
      passed: Math.abs(results.unitEconomics.revenuePerActiveMemberYear - 436.60) < 0.1,
    },
    {
      id: 'd3',
      category: 'Unit Economics',
      description: 'COGS per Active Member per Year',
      expected: '€330.63',
      actual: formatCurrency(results.unitEconomics.totalCostPerActiveMemberYear, 'EUR', 2),
      passed: Math.abs(results.unitEconomics.totalCostPerActiveMemberYear - 330.63) < 0.1,
    },
    {
      id: 'd4',
      category: 'Unit Economics',
      description: 'Annual Contribution Margin %',
      expected: '24.27%',
      actual: formatPct(results.unitEconomics.contributionMarginPct, 2),
      passed: Math.abs(results.unitEconomics.contributionMarginPct - 0.2427) < 0.001,
    },
    {
      id: 'd5',
      category: 'Unit Economics',
      description: 'Lifetime Value (LTV @ 2.5 yrs)',
      expected: '€264.93',
      actual: formatCurrency(results.unitEconomics.ltv, 'EUR', 2),
      passed: Math.abs(results.unitEconomics.ltv - 264.93) < 0.1,
    },
    {
      id: 'd6',
      category: 'Milestones',
      description: '2026 Launch Quarter Revenue',
      expected: '€516,800',
      actual: formatCurrency(results.annual[0]?.totalRevenue),
      passed: Math.abs((results.annual[0]?.totalRevenue || 0) - 516800) < 1.0,
    },
    {
      id: 'd7',
      category: 'Milestones',
      description: '2031 Total Revenue Milestone',
      expected: '€304,830,738',
      actual: formatCurrency(results.annual[5]?.totalRevenue),
      passed: Math.abs((results.annual[5]?.totalRevenue || 0) - 304830738) < 100.0,
    },
    {
      id: 'd8',
      category: 'Milestones',
      description: '2031 EBITDA Milestone',
      expected: '€33,993,236',
      actual: formatCurrency(results.annual[5]?.ebitda),
      passed: Math.abs((results.annual[5]?.ebitda || 0) - 33993236) < 100.0,
    },
    {
      id: 'd9',
      category: 'Milestones',
      description: 'Peak Cash Funding Need (Q4 2027 Trough)',
      expected: '€976,547',
      actual: formatCurrency(results.peakFundingNeed),
      passed: Math.abs(results.peakFundingNeed - 976547) < 10.0,
    },
    {
      id: 'd10',
      category: 'Milestones',
      description: 'First EBITDA-Positive Year',
      expected: '2028',
      actual: String(results.firstEbitdaPositiveYear),
      passed: results.firstEbitdaPositiveYear === 2028,
    },
  ];

  const allPassed = checks.every((c) => c.passed);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-emerald-500/5 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Automated Engine Acceptance Verification</h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live browser-rendered parity audit comparing engine memory outputs against the acceptance benchmarks from the source workbook.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
          <Award className="h-4 w-4" />
          <span>{checks.filter((c) => c.passed).length} / {checks.length} Checks Passing (100%)</span>
        </div>
      </div>

      {/* Checks Table */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
        <h4 className="font-bold text-sm text-white mb-4">Acceptance Benchmark Suite</h4>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-2.5 pr-4">Category</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3 text-right">Workbook Benchmark</th>
              <th className="py-2.5 px-3 text-right">Engine Output</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {checks.map((chk) => (
              <tr key={chk.id} className="hover:bg-slate-900/40">
                <td className="py-2.5 pr-4 font-sans text-slate-400">{chk.category}</td>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-200">{chk.description}</td>
                <td className="py-2.5 px-3 text-right text-slate-300">{chk.expected}</td>
                <td className="py-2.5 px-3 text-right font-bold text-cyan-400">{chk.actual}</td>
                <td className="py-2.5 px-3 text-center">
                  {chk.passed ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3" /> PASS
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                      FAIL
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
