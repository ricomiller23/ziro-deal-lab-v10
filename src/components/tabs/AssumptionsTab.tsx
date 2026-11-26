import React, { useState } from 'react';
import { useDealStore } from '../../store/useDealStore';
import { INPUT_METADATA, DEFAULT_ASSUMPTIONS } from '../../engine/defaults';
import { Assumptions, InputMetadata } from '../../engine/types';
import { RotateCcw, AlertCircle, Info, Search } from 'lucide-react';

export const AssumptionsTab: React.FC = () => {
  const { assumptions, updateAssumption, resetToDefaults } = useDealStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState<string>('ALL');

  const categories: { title: string; keys: (keyof Assumptions)[] }[] = [
    {
      title: 'General & Macro',
      keys: ['fxGbpEur', 'fxUsdEur', 'paymentProcessingFee', 'openingCash', 'ukIrelandPopulation'],
    },
    {
      title: 'Pricing & Product',
      keys: ['annualMembershipPrice', 'optimizeRetestPrice', 'monthlyOptimizeShare'],
    },
    {
      title: 'Cost of Goods Sold (COGS)',
      keys: ['baselineTestCost', 'optimizeRetestCost', 'aiExtractionPagesPerSample', 'aiExtractionCostPerPageUsd'],
    },
    {
      title: 'Membership Retention & Attach',
      keys: ['launchQuarterMembers', 'annualRenewalRate', 'optimizeAttachRate'],
    },
    {
      title: 'Quarter-on-Quarter Growth Cadence',
      keys: ['qoqGrowth2027', 'qoqGrowth2028', 'qoqGrowth2029', 'qoqGrowth2030', 'qoqGrowth2031'],
    },
    {
      title: 'Clinical Platform & Mobile App (Nicoya)',
      keys: [
        'nicoyaBaseFeeGbp',
        'nicoyaIncludedClients',
        'nicoyaPerClientFeeGbp',
        'nicoyaManagedAppFeeUsd',
        'nicoyaAppSetupUsd',
        'nicoyaSdkSetupUsd',
      ],
    },
    {
      title: 'Overhead & Technology Drivers',
      keys: [
        'monthlySalaryUsd',
        'notionCostEur',
        'contingencyPct',
        'brandingSetupUsd',
        'trademarksSetupUsd',
        'addOnsEnabled',
        'employerOnCostsPct',
        'clinicalGovernanceUsdMonth',
        'insuranceEurMonth',
        'legalRetainerEurMonth',
      ],
    },
    {
      title: 'Convertible Note Financing & Capital Structure',
      keys: [
        'raiseAmountUsd',
        'activeNoteDraft',
        'preSplitSharePriceUsd',
        'reverseSplitRatio',
        'preSplitSharesOutstanding',
        'noteConversionDiscount',
      ],
    },
  ];

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'CONFIRMED':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'ASSUMPTION':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'TARGET':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'TBC':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'REFERENCE':
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assumptions, tooltips, or keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Badge Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'CONFIRMED', 'ASSUMPTION', 'TARGET', 'TBC', 'REFERENCE'].map((b) => (
            <button
              key={b}
              onClick={() => setFilterBadge(b)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[32px] ${
                filterBadge === b
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const matchingKeys = cat.keys.filter((key) => {
            const meta = INPUT_METADATA[key];
            if (!meta) return false;
            if (filterBadge !== 'ALL' && meta.statusBadge !== filterBadge) return false;
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (
              meta.label.toLowerCase().includes(term) ||
              meta.sourceNote.toLowerCase().includes(term) ||
              key.toLowerCase().includes(term)
            );
          });

          if (matchingKeys.length === 0) return null;

          return (
            <div key={cat.title} className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>{cat.title}</span>
                <span className="text-xs text-slate-400 font-normal">{matchingKeys.length} levers</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingKeys.map((key) => {
                  const meta = INPUT_METADATA[key]!;
                  const val = assumptions[key];
                  const defaultVal = DEFAULT_ASSUMPTIONS[key];
                  const isModified = val !== defaultVal;
                  const isToggle = typeof defaultVal === 'boolean';

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl transition-all ${
                        isModified
                          ? 'bg-amber-500/5 border border-amber-500/40'
                          : 'bg-slate-900/60 border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Bar: Label + Badge + Reset */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-200">{meta.label}</span>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${getBadgeStyle(
                                meta.statusBadge
                              )}`}
                            >
                              {meta.statusBadge}
                            </span>
                            {meta.isYellowAlert && (
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 flex items-center gap-1"
                                title="Workbook cell highlighted in yellow: Validate with real data"
                              >
                                <AlertCircle className="h-2.5 w-2.5 text-yellow-400" />
                                Validate
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 line-clamp-2" title={meta.sourceNote}>
                            {meta.sourceNote}
                          </div>
                        </div>

                        {isModified && (
                          <button
                            onClick={() => updateAssumption(key, defaultVal as any)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Reset to workbook default"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="mt-3">
                        {isToggle ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">Current state:</span>
                            <button
                              onClick={() => updateAssumption(key, !val as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                                val
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {val ? 'ENABLED' : 'DISABLED'}
                            </button>
                          </div>
                        ) : typeof val === 'string' ? (
                          <select
                            value={String(val)}
                            onChange={(e) => updateAssumption(key, e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="final">ZIRO_Convertible_Note_Final.docx (20% / 20%)</option>
                            <option value="form081226">Convertible Note Form 08 12 26 (100% / 50%)</option>
                          </select>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-mono">
                                Default: {String(defaultVal)} {meta.unit}
                              </span>
                              <span className="font-bold text-amber-400 font-mono">
                                {typeof val === 'number' && meta.step && meta.step < 1
                                  ? (val * (meta.unit === '%' ? 100 : 1)).toFixed(
                                      meta.step === 0.01 ? 2 : 1
                                    )
                                  : String(val)}{' '}
                                {meta.unit}
                              </span>
                            </div>

                            <input
                              type="range"
                              min={meta.min}
                              max={meta.max}
                              step={meta.step}
                              value={Number(val)}
                              onChange={(e) => updateAssumption(key, parseFloat(e.target.value) as any)}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
