import React, { useState } from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatNumber, formatPct, formatMultiple } from '../../utils/formatters';
import { exportToJson, exportAnnualCsv, generateShareableUrl } from '../../utils/exporter';
import { FileDown, Printer, Share2, Check, FileText, FileSpreadsheet } from 'lucide-react';

export const ExportTab: React.FC = () => {
  const { results, assumptions } = useDealStore();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = generateShareableUrl(assumptions);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Export Action Buttons */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileDown className="h-5 w-5 text-amber-400" />
            <span>Export & Briefing Center</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Download model state, structured spreadsheets, or generate an executive PDF one-pager.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 min-h-[44px]"
          >
            <Printer className="h-4 w-4" />
            Print / PDF One-Pager
          </button>

          <button
            onClick={() => exportAnnualCsv(results)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 min-h-[44px]"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={() => exportToJson(assumptions, results)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 min-h-[44px]"
          >
            <FileText className="h-4 w-4 text-cyan-400" />
            Export JSON
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 min-h-[44px]"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            {copied ? 'Link Copied!' : 'Copy Share URL'}
          </button>
        </div>
      </div>

      {/* Printable Executive One-Pager Document Container */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#090d19] border border-slate-800 shadow-2xl print:border-none print:shadow-none print:p-0 max-w-5xl mx-auto space-y-6">
        {/* Memo Header */}
        <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-xl text-white tracking-tight">ZIRO HEALTH</span>
              <span className="text-xs uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                DEAL MEMO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Live Financial Model & Capital Structure Stress Test
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono">
            <div>Case: <strong className="text-amber-400 uppercase">{assumptions.activeCase}</strong></div>
            <div>Date: {new Date().toLocaleDateString('en-GB')}</div>
            <div>Currency: EUR (€)</div>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
            Executive Briefing
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {results.plainEnglishTakeaway}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">2031 Active Members</div>
            <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
              {formatNumber(results.activeMembers2031)}
            </div>
            <div className="text-[10px] text-slate-400">{results.populationPenetrationPct2031.toFixed(2)}% of UK/IE adults</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">2031 Revenue</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              {formatCurrency(results.revenue2031)}
            </div>
            <div className="text-[10px] text-slate-400">{results.grossMargin2031.toFixed(1)}% Gross Margin</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">2031 EBITDA</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
              {formatCurrency(results.ebitda2031)}
            </div>
            <div className="text-[10px] text-slate-400">1st positive: {results.firstEbitdaPositiveYear}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Peak Cash Deficit</div>
            <div className="text-lg font-black text-rose-400 font-mono mt-0.5">
              {formatCurrency(results.peakFundingNeed)}
            </div>
            <div className="text-[10px] text-slate-400">Trough at Q4 2027</div>
          </div>
        </div>

        {/* Annual Rollup Summary */}
        <div>
          <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">
            Consolidated 6-Year Financial Projections (EUR)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2 pr-4">Metric</th>
                  {results.annual.map((y) => (
                    <th key={y.year} className="py-2 px-2 text-right">
                      {y.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr>
                  <td className="py-2 pr-4 font-sans text-slate-300">Active Members (YE)</td>
                  {results.annual.map((y) => (
                    <td key={y.year} className="py-2 px-2 text-right text-slate-200">
                      {formatNumber(y.activeMembersYearEnd)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-sans text-slate-300">Total Revenue (€)</td>
                  {results.annual.map((y) => (
                    <td key={y.year} className="py-2 px-2 text-right text-slate-200">
                      {formatCurrency(y.totalRevenue)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-sans text-slate-300">Gross Profit (€)</td>
                  {results.annual.map((y) => (
                    <td key={y.year} className="py-2 px-2 text-right text-emerald-400">
                      {formatCurrency(y.grossProfit)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-amber-500/5 font-bold">
                  <td className="py-2 pr-4 font-sans text-amber-300">EBITDA (€)</td>
                  {results.annual.map((y) => (
                    <td
                      key={y.year}
                      className={`py-2 px-2 text-right ${y.ebitda >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                    >
                      {formatCurrency(y.ebitda)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-sans text-slate-400">Year-End Cash (€)</td>
                  {results.annual.map((y) => (
                    <td
                      key={y.year}
                      className={`py-2 px-2 text-right ${y.yearEndCash >= 0 ? 'text-slate-300' : 'text-rose-400'}`}
                    >
                      {formatCurrency(y.yearEndCash)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Note & Dilution Terms Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Convertible Note & Dilution Covenants
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
            <div>
              Active Draft: <strong className="text-slate-200">{results.raise.activeDraft.name}</strong>
            </div>
            <div>
              Payoff at 12M Maturity: <strong className="text-amber-400">${formatNumber(results.raise.maturityCashPayoffUsd)} USD ({results.raise.impliedCashMultiple.toFixed(2)}x)</strong>
            </div>
            <div>
              Conversion Discount: <strong className="text-slate-200">{results.raise.activeDraft.conversionDiscountPct}%</strong>
            </div>
            <div>
              Beneficial Ownership Blocker: <strong className="text-slate-200">4.99% equity cap (serial conversions required)</strong>
            </div>
          </div>
        </div>

        {/* Mandatory Footer Notice */}
        <div className="text-[10px] text-slate-400 pt-4 border-t border-slate-800/80 leading-normal">
          CONFIDENTIAL INVESTMENT MEMORANDUM · FOR QUALIFIED RECIPIENTS ONLY. Generated by Project ZIRO Deal Lab V3 Engine. Oral peptide formulations referenced in pro-forma materials are investigational and provided as an uncommitted upside memo only. No therapeutic, curative, or preventative medical claims are made.
        </div>
      </div>
    </div>
  );
};
