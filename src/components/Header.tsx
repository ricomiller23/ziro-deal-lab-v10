import React, { useState } from 'react';
import { useDealStore } from '../store/useDealStore';
import { formatCompactCurrency, formatCurrency } from '../utils/formatters';
import { DEFAULT_ASSUMPTIONS } from '../engine/defaults';
import { generateShareableUrl } from '../utils/exporter';
import {
  Sliders,
  RotateCcw,
  Share2,
  TrendingUp,
  AlertTriangle,
  Check,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    assumptions,
    results,
    applyCase,
    applyPreset,
    resetToDefaults,
    toggleDrawer,
    updateAssumption
  } = useDealStore();

  const [copied, setCopied] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  // Compute number of changed assumptions
  const changedCount = Object.keys(assumptions).filter(
    (k) => (assumptions as any)[k] !== (DEFAULT_ASSUMPTIONS as any)[k]
  ).length;

  const handleShare = () => {
    const url = generateShareableUrl(assumptions);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const coveragePct = Math.round(
    (results.raise.raiseAmountEur / Math.max(1, results.peakFundingNeed)) * 100
  );

  return (
    <header className="sticky top-0 z-40 bg-[#050811]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand and Case Switcher */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-amber-500/20">
              Z
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base lg:text-lg tracking-tight text-white">
                  ZIRO <span className="text-amber-400">DEAL LAB</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Model V3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                OTC: TWSI Rebrand · At-Home Blood Diagnostics
              </p>
            </div>
          </div>

          {/* Case Switcher Pills */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                applyCase('mgmt');
                updateAssumption('cacMethod', 'bottomUp');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                assumptions.activeCase === 'mgmt' && assumptions.cacMethod === 'bottomUp'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Management
            </button>
            <button
              onClick={() => {
                applyCase('s1');
                updateAssumption('cacMethod', 'bottomUp');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                assumptions.activeCase === 's1' && assumptions.cacMethod === 'bottomUp'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S1 (0.2%)
            </button>
            <button
              onClick={() => {
                applyCase('s2');
                updateAssumption('cacMethod', 'bottomUp');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                assumptions.activeCase === 's2' && assumptions.cacMethod === 'bottomUp'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S2 (0.5%)
            </button>
            <button
              onClick={() => {
                applyCase('s3');
                updateAssumption('cacMethod', 'bottomUp');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                assumptions.activeCase === 's3' && assumptions.cacMethod === 'bottomUp'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              S3 (1.0%)
            </button>
            <button
              onClick={() => {
                applyCase('s1');
                updateAssumption('cacMethod', 'flat99');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                assumptions.cacMethod === 'flat99'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
              title="Stress Model with flat €99 CAC and no AI extraction"
            >
              Stress (€99)
            </button>
          </div>
        </div>

        {/* 3 Live Key Indicators */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                2031 EBITDA
              </div>
              <div className="text-sm font-bold text-emerald-400">
                {formatCompactCurrency(results.ebitda2031)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Peak Cash Need
              </div>
              <div className="text-sm font-bold text-amber-400">
                {formatCompactCurrency(results.peakFundingNeed)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <ShieldAlert className={`h-4 w-4 ${coveragePct >= 100 ? 'text-emerald-400' : 'text-rose-400'}`} />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Note Coverage
              </div>
              <div className={`text-sm font-bold ${coveragePct >= 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coveragePct}% <span className="text-[11px] font-normal text-slate-400">($500k)</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <button
              onClick={toggleDrawer}
              className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Diff vs Defaults"
            >
              <Sliders className="h-4 w-4" />
              {changedCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {changedCount}
                </span>
              )}
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Copy shareable URL"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            </button>

            <button
              onClick={resetToDefaults}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Reset all assumptions to verified workbook defaults"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
