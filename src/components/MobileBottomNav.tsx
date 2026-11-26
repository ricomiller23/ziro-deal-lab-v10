import React, { useState } from 'react';
import { useDealStore, TabId } from '../store/useDealStore';
import {
  LayoutDashboard,
  Layers,
  Dices,
  FileSignature,
  Menu,
  X,
  SlidersHorizontal,
  Users,
  LineChart,
  PieChart,
  Target,
  Building2,
  Sparkles,
  GitCompare,
  CheckCircle2,
  FileDown
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, toggleDrawer } = useDealStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  const mainTabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'cockpit', label: 'Cockpit', icon: LayoutDashboard },
    { id: 'scenarios', label: 'Scenarios', icon: Layers },
    { id: 'stress', label: 'Stress', icon: Dices },
    { id: 'raise', label: 'Note', icon: FileSignature },
  ];

  const allTabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'cockpit', label: '1. Cockpit', icon: LayoutDashboard },
    { id: 'assumptions', label: '2. Assumptions', icon: SlidersHorizontal },
    { id: 'members', label: '3. Members & Rev', icon: Users },
    { id: 'pnl', label: '4. P&L & Cash', icon: LineChart },
    { id: 'unit-economics', label: '5. Unit Economics', icon: PieChart },
    { id: 'cac', label: '6. CAC Lab', icon: Target },
    { id: 'overhead', label: '7. Overhead', icon: Building2 },
    { id: 'scenarios', label: '8. Scenarios', icon: Layers },
    { id: 'peptides', label: '9. Peptides (Memo)', icon: Sparkles },
    { id: 'raise', label: '10. Raise & Note', icon: FileSignature },
    { id: 'stress', label: '11. Stress Lab', icon: Dices },
    { id: 'reconciliation', label: '12. Reconciliation', icon: GitCompare },
    { id: 'diagnostics', label: '13. Diagnostics', icon: CheckCircle2 },
    { id: 'export', label: '14. Export', icon: FileDown },
  ];

  return (
    <>
      {/* Mobile Drawer Sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex flex-col justify-end">
          <div className="bg-[#0b1120] border-t border-slate-800 rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="font-bold text-sm text-white">All 14 Deal Lab Tabs</span>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-2 text-slate-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-6">
              {allTabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id);
                      setSheetOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-medium transition-all min-h-[48px] ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#050811]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 lg:hidden shadow-2xl flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-xl text-[10px] font-medium transition-colors min-h-[44px] min-w-[48px] ${
                isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setSheetOpen(true)}
          className="flex flex-col items-center justify-center p-1 rounded-xl text-[10px] font-medium text-slate-400 hover:text-amber-400 transition-colors min-h-[44px] min-w-[48px]"
        >
          <Menu className="h-4 w-4 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </>
  );
};
