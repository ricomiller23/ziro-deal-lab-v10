import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatPct, formatNumber, formatCompactCurrency } from '../../utils/formatters';
import { Sparkles, AlertTriangle, ShieldAlert, Info, Pill } from 'lucide-react';
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

export const PeptideUpsideTab: React.FC = () => {
  const { results, assumptions, updateAssumption } = useDealStore();
  const pep = results.peptides;

  const chartData = results.annual.map((y, idx) => ({
    year: String(y.year),
    baseEbitda: Math.round(pep.baseEbitda[idx] / 1e6 * 10) / 10,
    peptideEbitda: Math.round(pep.annualGrossProfitAfterHaircut[idx] / 1e6 * 10) / 10,
    totalWithPeptides: Math.round(pep.ebitdaWithPeptides[idx] / 1e6 * 10) / 10,
  }));

  return (
    <div className="space-y-6">
      {/* Strict Memo-Only Exclusion Callout */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-400 font-semibold">MEMO ONLY — EXCLUDED FROM CORE MODEL:</strong> Per primary workbook convention, peptide upsells are modeled strictly as an optional informational addendum. They are excluded from all headline Cockpit figures, senior covenants, and base P&L cash flows.
        </div>
      </div>

      {/* Regulatory & Safety Mandatory Warning */}
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs text-rose-300 leading-relaxed">
          <strong className="text-rose-400 font-bold uppercase tracking-wider block mb-1">
            Regulatory Compliance Notice (UK MHRA & Irish HPRA)
          </strong>
          Peptides are formulated as orally dissolvable sublingual wafers (never transdermal patches; never subcutaneous injections). Products are investigational wellness supplements; no medical, therapeutic, curative, or disease-prevention claims may be made under applicable UK/EU advertising regulations.
        </div>
      </div>

      {/* Controls: Conservative vs Management Case + Regulatory Haircut */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Peptide Pro-Forma Case
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateAssumption('peptideCase', 'conservative')}
              className={`p-3 rounded-xl text-left border transition-all ${
                assumptions.peptideCase === 'conservative'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs">Conservative Case</div>
              <div className="text-[11px] text-slate-400 mt-1">15% attach · €600/yr spend · 65% gross margin</div>
            </button>

            <button
              onClick={() => updateAssumption('peptideCase', 'management')}
              className={`p-3 rounded-xl text-left border transition-all ${
                assumptions.peptideCase === 'management'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs">Management Case</div>
              <div className="text-[11px] text-slate-400 mt-1">25% attach · €1,200/yr spend · 75% gross margin</div>
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Regulatory Haircut Discount
            </label>
            <span className="text-xs font-bold font-mono text-rose-400">
              {((assumptions.peptideRegulatoryHaircut ?? 0.20) * 100).toFixed(0)}% Haircut
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={assumptions.peptideRegulatoryHaircut ?? 0.20}
            onChange={(e) => updateAssumption('peptideRegulatoryHaircut', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-2"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-2">
            <span>0% (Full pro-forma)</span>
            <span>20% (Base audit discount)</span>
            <span>100% (Full regulatory ban)</span>
          </div>
        </div>
      </div>

      {/* 9 Product Cost Base */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
        <h4 className="font-bold text-sm text-white mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-cyan-400" />
            <span>9 Orally Dissolvable Product Formulations & Cost Base</span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            Average Unit Cost: ${pep.averageProductCostUsd.toFixed(2)} USD
          </span>
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          Sublingual lozenges / dissolvable wafers manufactured under cGMP third-party peptide contract labs.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pep.productCostBase.map((p) => (
            <div key={p.name} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-semibold text-slate-200 truncate">{p.name}</div>
              <div className="text-base font-black text-amber-400 mt-1 font-mono">${p.costUsd.toFixed(2)}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">USD / monthly unit</div>
            </div>
          ))}
        </div>
      </div>

      {/* EBITDA Impact Comparison Chart */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
        <h4 className="font-bold text-sm text-white mb-1">EBITDA Expansion with Peptides (€M)</h4>
        <p className="text-xs text-slate-400 mb-4">Base Diagnostics P&L vs Upside Potential (after haircut)</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(val: any) => [`€${val}M`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="baseEbitda" name="Core Diagnostic EBITDA" fill="#0ea5e9" />
              <Bar dataKey="peptideEbitda" name="Peptide Gross Profit" fill="#f59e0b" />
              <Line type="monotone" dataKey="totalWithPeptides" name="Combined EBITDA" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cell I22 Typo Callout */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-400 font-semibold">Peptide Pro-Forma Cell I22 Audit Notice:</strong> In the auxiliary `Peptide Pro-Forma.xlsx` sheet, cell I22 contains a hardcoded typo spiking 2029 new memberships to 362,580 (instead of 197,397 from the verified 12% formula). This creates an artificial €8.4M phantom EBITDA jump in unverified investor decks. The Deal Lab engine sanitizes this and uses the verified member cadence.
        </div>
      </div>
    </div>
  );
};
