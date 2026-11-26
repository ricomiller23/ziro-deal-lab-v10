import React from 'react';
import { useDealStore, TabId } from '../store/useDealStore';
import {
  LayoutDashboard,
  SlidersHorizontal,
  Users,
  LineChart,
  PieChart,
  Target,
  Building2,
  Layers,
  Sparkles,
  FileSignature,
  Dices,
  GitCompare,
  CheckCircle2,
  FileDown
} from 'lucide-react';

interface TabItem {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const TABS: TabItem[] = [
  { id: 'cockpit', label: '1. Cockpit', shortLabel: 'Cockpit', icon: LayoutDashboard },
  { id: 'assumptions', label: '2. Assumptions', shortLabel: 'Inputs', icon: SlidersHorizontal },
  { id: 'members', label: '3. Members & Rev', shortLabel: 'Members', icon: Users },
  { id: 'pnl', label: '4. P&L & Cash', shortLabel: 'P&L', icon: LineChart },
  { id: 'unit-economics', label: '5. Unit Economics', shortLabel: 'Unit Econ', icon: PieChart },
  { id: 'cac', label: '6. CAC Lab', shortLabel: 'CAC', icon: Target },
  { id: 'overhead', label: '7. Overhead', shortLabel: 'Overhead', icon: Building2 },
  { id: 'scenarios', label: '8. Scenarios', shortLabel: 'Scenarios', icon: Layers },
  { id: 'peptides', label: '9. Peptides', shortLabel: 'Peptides', icon: Sparkles, badge: 'Memo', badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  { id: 'raise', label: '10. Raise & Note', shortLabel: 'Note', icon: FileSignature, badge: 'Debt', badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  { id: 'stress', label: '11. Stress Lab', shortLabel: 'Monte Carlo', icon: Dices, badge: '10k', badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
  { id: 'reconciliation', label: '12. Reconciliation', shortLabel: 'Reconcile', icon: GitCompare, badge: '7 Items', badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  { id: 'diagnostics', label: '13. Diagnostics', shortLabel: 'Audit', icon: CheckCircle2, badge: '100%', badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  { id: 'export', label: '14. Export', shortLabel: 'Export', icon: FileDown },
];

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useDealStore();

  return (
    <nav className="bg-[#080d1a] border-b border-slate-800/80 sticky top-[69px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all min-h-[44px] min-w-[44px] ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${
                      tab.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
