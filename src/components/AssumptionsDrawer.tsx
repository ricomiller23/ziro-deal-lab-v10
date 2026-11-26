import React from 'react';
import { useDealStore } from '../store/useDealStore';
import { DEFAULT_ASSUMPTIONS, INPUT_METADATA } from '../engine/defaults';
import { Assumptions } from '../engine/types';
import { X, RotateCcw, Sliders, CheckCircle } from 'lucide-react';

export const AssumptionsDrawer: React.FC = () => {
  const { isDrawerOpen, setDrawerOpen, assumptions, updateAssumption, resetToDefaults } = useDealStore();

  if (!isDrawerOpen) return null;

  // Find all keys that differ from defaults
  const diffs = Object.keys(assumptions)
    .filter((k) => (assumptions as any)[k] !== (DEFAULT_ASSUMPTIONS as any)[k])
    .map((k) => {
      const key = k as keyof Assumptions;
      const meta = INPUT_METADATA[key];
      const currentVal = assumptions[key];
      const defaultVal = DEFAULT_ASSUMPTIONS[key];
      return {
        key,
        label: meta?.label || key,
        currentVal,
        defaultVal,
        badge: meta?.statusBadge || 'ASSUMPTION',
        unit: meta?.unit || '',
      };
    });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#0b1120] border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Diff vs Defaults</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              {diffs.length} {diffs.length === 1 ? 'change' : 'changes'}
            </span>
          </div>

          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {diffs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CheckCircle className="h-12 w-12 text-emerald-500/60 mx-auto mb-3" />
              <p className="font-medium text-slate-300">All assumptions match verified defaults</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Any slider adjustment or term override will appear here with instant reset controls.
              </p>
            </div>
          ) : (
            diffs.map((d) => (
              <div
                key={d.key}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-slate-200 truncate">{d.label}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {d.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="text-slate-400 line-through">
                      Default: {String(d.defaultVal)} {d.unit}
                    </span>
                    <span className="text-amber-400 font-semibold">
                      → {String(d.currentVal)} {d.unit}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => updateAssumption(d.key, d.defaultVal as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1 min-h-[36px]"
                  title="Reset this lever"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {diffs.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">Reset everything:</span>
            <button
              onClick={() => {
                resetToDefaults();
                setDrawerOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-all min-h-[44px] flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All to Defaults
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
