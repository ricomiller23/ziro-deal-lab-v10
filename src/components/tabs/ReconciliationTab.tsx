import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import { GitCompare, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const ReconciliationTab: React.FC = () => {
  const { results, assumptions, updateAssumption } = useDealStore();
  const conflicts = results.reconciliation;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-emerald-400" />
          <span>7-Point Source of Truth Reconciliation Audit</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          The deal room contains conflicting assertions between narrative pitch memoranda and the primary mathematical workbook (`Ziro_Health_Financials Peptides and testing.xlsx`). Per non-negotiable instruction: <strong>the workbook wins everywhere in the engine</strong>. All 7 discrepancies are audited below with live interactive overrides.
        </p>
      </div>

      {/* 7 Reconciliation Items Cards */}
      <div className="space-y-4">
        {conflicts.map((item, index) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl space-y-3"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <h4 className="font-bold text-sm text-white">{item.topic}</h4>
              </div>

              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Workbook Truth Applied
              </span>
            </div>

            {/* Source A vs Source B Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Source A · Narrative Pitch Memorandum / Secondary
                </div>
                <div className="font-semibold text-slate-300">{item.sourceA.name}</div>
                <div className="text-amber-400 font-mono mt-1 font-medium">{item.sourceA.claim}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30">
                <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">
                  Source B · Primary Financial Workbook (Source of Truth)
                </div>
                <div className="font-semibold text-slate-300">{item.sourceB.name}</div>
                <div className="text-emerald-400 font-mono mt-1 font-bold">{item.sourceB.claim}</div>
              </div>
            </div>

            {/* Resolution Rationale */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-400 font-semibold">Engine Resolution: </strong>
              {item.engineResolution}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
