import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Building2, Users, Layers, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export const OverheadTab: React.FC = () => {
  const { results, assumptions, updateAssumption } = useDealStore();
  const ovh = results.overheadBuild;

  return (
    <div className="space-y-6">
      {/* 2027 Run-Rate Highlight Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-slate-900 to-slate-900 border border-purple-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
            2027 Core Overhead Run-Rate (excl. Contingency)
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {formatCurrency(ovh.annual2027RunRateBeforeContingency, 'EUR', 2)} / year
          </div>
          <div className="text-xs text-slate-400 mt-1">
            €33,840.12 / month run-rate across people, platform and tools (Matches brief target of ~€400k)
          </div>
        </div>

        {/* Add-ons toggle */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-200">Optional Add-ons</div>
            <div className="text-[10px] text-slate-400">Governance, insurance, on-costs</div>
          </div>
          <button
            onClick={() => updateAssumption('addOnsEnabled', !assumptions.addOnsEnabled)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] flex items-center gap-1 ${
              assumptions.addOnsEnabled
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {assumptions.addOnsEnabled ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
            {assumptions.addOnsEnabled ? 'ON' : 'OFF (Default)'}
          </button>
        </div>
      </div>

      {/* Headcount Build Table */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
        <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-400" />
          <span>Headcount Architecture (Full-Time Equivalents)</span>
        </h4>

        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-2.5 pr-4">Function</th>
              {ovh.years.map((y) => (
                <th key={y} className="py-2.5 px-3 text-right">
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="py-2 pr-4 font-sans text-slate-300">Leadership / Founders</td>
              {ovh.headcountByYear.leadership.map((h, i) => (
                <td key={i} className="py-2 px-3 text-right text-slate-300">
                  {h}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-sans text-slate-300">Growth & Marketing</td>
              {ovh.headcountByYear.growthMarketing.map((h, i) => (
                <td key={i} className="py-2 px-3 text-right text-slate-300">
                  {h}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-sans text-slate-300">Operations & Customer Care</td>
              {ovh.headcountByYear.opsCare.map((h, i) => (
                <td key={i} className="py-2 px-3 text-right text-slate-300">
                  {h}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-sans text-slate-300">Product, Data & Engineering</td>
              {ovh.headcountByYear.productEng.map((h, i) => (
                <td key={i} className="py-2 px-3 text-right text-slate-300">
                  {h}
                </td>
              ))}
            </tr>
            <tr className="border-t-2 border-slate-700 bg-slate-900/60 font-bold">
              <td className="py-2.5 pr-4 font-sans text-cyan-300">Total Headcount (FTE)</td>
              {ovh.headcountByYear.total.map((h, i) => (
                <td key={i} className="py-2.5 px-3 text-right text-cyan-400 text-sm">
                  {h}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-sans text-slate-400 text-[11px]">Monthly Salary / FTE</td>
              {ovh.years.map((y) => (
                <td key={y} className="py-2 px-3 text-right text-slate-400 text-[11px]">
                  $5,000 (€4,300)
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tech Stack & Platform Table */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl overflow-x-auto">
        <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-400" />
          <span>Platform & Tech Stack Subscriptions (Monthly EUR)</span>
        </h4>

        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-2.5 pr-4">Platform / Software Tool</th>
              {ovh.years.map((y) => (
                <th key={y} className="py-2.5 px-3 text-right">
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {/* Nicoya Platform Base */}
            <tr className="bg-amber-500/5">
              <td className="py-2 pr-4 font-sans text-amber-300 font-semibold">
                Nicoya Premier Plan Base Fee (£730 @ 1.17)
              </td>
              {ovh.years.map((y) => (
                <td key={y} className="py-2 px-3 text-right text-amber-400 font-bold">
                  {formatCurrency(ovh.nicoyaPlatformBaseEur, 'EUR', 2)}
                </td>
              ))}
            </tr>

            {/* Managed White-Label App */}
            <tr className="bg-amber-500/5">
              <td className="py-2 pr-4 font-sans text-amber-300 font-semibold">
                Managed White-Label Mobile App ($10k @ 0.86)
              </td>
              {ovh.years.map((y) => (
                <td key={y} className="py-2 px-3 text-right text-amber-400 font-bold">
                  {formatCurrency(ovh.nicoyaAppFeeEur, 'EUR', 2)}
                </td>
              ))}
            </tr>

            {/* Software Tools */}
            {ovh.techStackItemsMonthly.map((tool) => (
              <tr key={tool.name} className="hover:bg-slate-900/40">
                <td className="py-1.5 pr-4 font-sans text-slate-300">{tool.name}</td>
                {tool.monthlyEurByYear.map((val, i) => (
                  <td key={i} className="py-1.5 px-3 text-right text-slate-300">
                    {formatCurrency(val, 'EUR', 2)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Total Monthly Tech Stack */}
            <tr className="border-t border-slate-700 bg-slate-900/40 font-bold">
              <td className="py-2 pr-4 font-sans text-slate-200">Total Tech Stack / Month</td>
              {ovh.totalTechStackMonthlyByYear.map((val, i) => (
                <td key={i} className="py-2 px-3 text-right text-slate-200">
                  {formatCurrency(val, 'EUR', 2)}
                </td>
              ))}
            </tr>

            {/* Contingency */}
            <tr>
              <td className="py-2 pr-4 font-sans text-slate-400">Contingency (10% of people + tools)</td>
              {ovh.contingencyMonthlyByYear.map((val, i) => (
                <td key={i} className="py-2 px-3 text-right text-purple-400">
                  {formatCurrency(val, 'EUR', 2)}
                </td>
              ))}
            </tr>

            {/* Total P&L Overhead */}
            <tr className="border-t-2 border-slate-700 bg-purple-500/10 font-bold text-sm">
              <td className="py-3 pr-4 font-sans text-purple-300">
                Total Annual Overhead in P&L (EUR)
              </td>
              {ovh.totalOverheadPnlByYear.map((val, i) => (
                <td key={i} className="py-3 px-3 text-right text-purple-400 text-sm font-black">
                  {formatCurrency(val, 'EUR', 2)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
