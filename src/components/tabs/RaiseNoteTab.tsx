import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatNumber, formatPct, formatMultiple } from '../../utils/formatters';
import { FileSignature, ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2, Scale } from 'lucide-react';

export const RaiseNoteTab: React.FC = () => {
  const { results, assumptions, updateAssumption } = useDealStore();
  const r = results.raise;

  return (
    <div className="space-y-6">
      {/* Top Funding Gap Alert */}
      <div className={`p-5 rounded-2xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        r.isFundingCovered ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className={`h-5 w-5 ${r.isFundingCovered ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span className="font-bold text-sm text-white uppercase tracking-wider">
              {r.isFundingCovered ? 'Note Fully Funds Runway' : 'Capital Deficit / Second Tranche Required'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            A $500,000 raise provides approximately <strong>{formatCurrency(r.raiseAmountEur)}</strong>. Peak cash burn before cash-flow positive reaches <strong>{formatCurrency(r.peakFundingNeedEur)}</strong> in Q4 2027.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Net Surplus / (Deficit):</div>
          <div className={`text-2xl font-black font-mono ${r.fundingSurplusDeficitEur >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(r.fundingSurplusDeficitEur)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Runway coverage: {r.runwayMonths} months
          </div>
        </div>
      </div>

      {/* Note Draft Switcher */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Scale className="h-4 w-4 text-amber-400" />
              <span>Select Active Convertible Note Legal Draft</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Toggle between the final execution contract and the earlier August term sheet to see payoff obligations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                updateAssumption('activeNoteDraft', 'final');
                updateAssumption('noteConversionDiscount', 0.20);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                assumptions.activeNoteDraft === 'final'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Final Execution Doc (20% / 20%)
            </button>
            <button
              onClick={() => {
                updateAssumption('activeNoteDraft', 'form081226');
                updateAssumption('noteConversionDiscount', 0.50);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                assumptions.activeNoteDraft === 'form081226'
                  ? 'bg-rose-500 text-white font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              August Term Sheet (100% / 50%)
            </button>
          </div>
        </div>

        {/* Note Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 pr-4">Term</th>
                <th className="py-2.5 px-3">ZIRO_Convertible_Note_Final.docx (Execution)</th>
                <th className="py-2.5 px-3">Convertible Note Form 08 12 26.docx</th>
                <th className="py-2.5 px-3">Unverified Deck Memo Claims</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-2.5 pr-4 font-sans text-slate-300 font-semibold">Principal</td>
                <td className="py-2.5 px-3 text-slate-100">$500,000</td>
                <td className="py-2.5 px-3 text-slate-100">$500,000</td>
                <td className="py-2.5 px-3 text-slate-400">$500k – $1M</td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="py-2.5 pr-4 font-sans text-slate-300 font-semibold">Interest Rate / Coupon</td>
                <td className="py-2.5 px-3 text-amber-400 font-bold">20% simple per annum</td>
                <td className="py-2.5 px-3 text-rose-400 font-bold">100% total return (guaranteed)</td>
                <td className="py-2.5 px-3 text-slate-400">10% claimed</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-sans text-slate-300 font-semibold">Conversion Discount</td>
                <td className="py-2.5 px-3 text-amber-400 font-bold">20% to market price</td>
                <td className="py-2.5 px-3 text-rose-400 font-bold">50% to market price</td>
                <td className="py-2.5 px-3 text-slate-400">Qualified round pricing</td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="py-2.5 pr-4 font-sans text-slate-300 font-semibold">Cash Payoff at 12M Maturity</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold text-sm">$600,000 (1.20x)</td>
                <td className="py-2.5 px-3 text-rose-400 font-bold text-sm">$1,000,000 (2.00x)</td>
                <td className="py-2.5 px-3 text-slate-400">$550,000</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-sans text-slate-300 font-semibold">Beneficial Ownership Blocker</td>
                <td className="py-2.5 px-3 text-slate-200">4.99% equity cap</td>
                <td className="py-2.5 px-3 text-slate-200">4.99% equity cap</td>
                <td className="py-2.5 px-3 text-slate-400">Silent</td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="py-2.5 pr-4 font-sans text-slate-300 font-semibold">Lock-Up & Leak-Out</td>
                <td className="py-2.5 px-3 text-slate-200">60-day lock-up · 10%/20% leak-out</td>
                <td className="py-2.5 px-3 text-slate-200">60-day lock-up · 10%/20% leak-out</td>
                <td className="py-2.5 px-3 text-slate-400">None mentioned</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-sans text-slate-300 font-semibold">Failure to Deliver Penalty</td>
                <td className="py-2.5 px-3 text-rose-400">$100 / day penalty</td>
                <td className="py-2.5 px-3 text-rose-400">$100 / day penalty</td>
                <td className="py-2.5 px-3 text-slate-400">None</td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="py-2.5 pr-4 font-sans text-slate-300 font-semibold">Governing Law</td>
                <td className="py-2.5 px-3 text-slate-200">State of Utah</td>
                <td className="py-2.5 px-3 text-slate-200">State of Utah</td>
                <td className="py-2.5 px-3 text-slate-400">Delaware / UK</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dilution & 4.99% Blocker Mechanics */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
        <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-400" />
          <span>Death-Spiral & Dilution Analysis on OTC: TWSI</span>
        </h4>
        <p className="text-xs text-slate-400 mb-4 max-w-3xl">
          At a base price of $0.00002, a $500,000 note conversion without a valuation floor requires issuing billions of shares, causing over 99% dilution. The 4.99% SEC equity blocker prevents a hostile takeover in a single conversion, forcing the lender into <strong>serial rolling conversions</strong> where they convert 4.99%, dump shares on the OTC market, and convert the next tranche.
        </p>

        {/* Levers: Reverse Split & Stock Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-6">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              OTC: TWSI Share Price (USD)
            </label>
            <input
              type="number"
              step="0.00001"
              value={assumptions.preSplitSharePriceUsd}
              onChange={(e) => updateAssumption('preSplitSharePriceUsd', parseFloat(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Reverse Stock Split Ratio (1-for-N)
            </label>
            <input
              type="number"
              step="100"
              value={assumptions.reverseSplitRatio}
              onChange={(e) => updateAssumption('reverseSplitRatio', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Existing Shares Outstanding
            </label>
            <input
              type="number"
              step="1000000"
              value={assumptions.preSplitSharesOutstanding}
              onChange={(e) => updateAssumption('preSplitSharesOutstanding', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Post-Split Price</div>
            <div className="text-base font-black text-white font-mono mt-0.5">
              ${r.postSplitImpliedPriceUsd.toFixed(4)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Conversion Price</div>
            <div className="text-base font-black text-amber-400 font-mono mt-0.5">
              ${r.conversionPriceUsd.toFixed(4)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Shares Issued</div>
            <div className="text-base font-black text-rose-400 font-mono mt-0.5">
              {formatNumber(r.totalSharesIssuedAtConversion)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Uncapped Dilution</div>
            <div className="text-base font-black text-rose-400 font-mono mt-0.5">
              {r.uncappedOwnershipPct.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Staged Tranches Table */}
        <h5 className="font-bold text-xs text-slate-200 mb-2">
          Staged Rolling Conversion Schedule under 4.99% Blocker
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2 pr-3">Tranche #</th>
                <th className="py-2 px-3 text-right">Shares Issued</th>
                <th className="py-2 px-3 text-right">Running Shares Out</th>
                <th className="py-2 px-3 text-right">Holder Ownership %</th>
                <th className="py-2 px-3 text-left pl-6">Market Impact Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {r.stagedTranches.slice(0, 10).map((t) => (
                <tr key={t.trancheNumber} className="hover:bg-slate-900/40">
                  <td className="py-2 pr-3 font-sans font-bold text-amber-400">Tranche {t.trancheNumber}</td>
                  <td className="py-2 px-3 text-right text-slate-200">{formatNumber(t.sharesIssued)}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{formatNumber(t.runningSharesOutstanding)}</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">
                    {t.noteholderOwnershipPct.toFixed(2)}%
                  </td>
                  <td className="py-2 px-3 text-left pl-6 font-sans text-slate-400 text-[11px]">
                    Noteholder exercises 4.99% tranche, liquidates into market float, then triggers next conversion.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
