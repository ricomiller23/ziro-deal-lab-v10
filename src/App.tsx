import React, { useEffect } from 'react';
import { useDealStore } from './store/useDealStore';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AssumptionsDrawer } from './components/AssumptionsDrawer';
import { Footer } from './components/Footer';

// Tabs
import { CockpitTab } from './components/tabs/CockpitTab';
import { AssumptionsTab } from './components/tabs/AssumptionsTab';
import { MembersRevenueTab } from './components/tabs/MembersRevenueTab';
import { PnlCashTab } from './components/tabs/PnlCashTab';
import { UnitEconomicsTab } from './components/tabs/UnitEconomicsTab';
import { CacLabTab } from './components/tabs/CacLabTab';
import { OverheadTab } from './components/tabs/OverheadTab';
import { ScenariosTab } from './components/tabs/ScenariosTab';
import { PeptideUpsideTab } from './components/tabs/PeptideUpsideTab';
import { RaiseNoteTab } from './components/tabs/RaiseNoteTab';
import { StressLabTab } from './components/tabs/StressLabTab';
import { ReconciliationTab } from './components/tabs/ReconciliationTab';
import { DiagnosticsTab } from './components/tabs/DiagnosticsTab';
import { ExportTab } from './components/tabs/ExportTab';

export function App() {
  const { activeTab, assumptions } = useDealStore();

  // Keep URL hash updated with state without page reloads
  useEffect(() => {
    try {
      const jsonStr = JSON.stringify(assumptions);
      const b64 = btoa(encodeURIComponent(jsonStr));
      window.history.replaceState(null, '', `#model=${b64}`);
    } catch (e) {}
  }, [assumptions]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'cockpit':
        return <CockpitTab />;
      case 'assumptions':
        return <AssumptionsTab />;
      case 'members':
        return <MembersRevenueTab />;
      case 'pnl':
        return <PnlCashTab />;
      case 'unit-economics':
        return <UnitEconomicsTab />;
      case 'cac':
        return <CacLabTab />;
      case 'overhead':
        return <OverheadTab />;
      case 'scenarios':
        return <ScenariosTab />;
      case 'peptides':
        return <PeptideUpsideTab />;
      case 'raise':
        return <RaiseNoteTab />;
      case 'stress':
        return <StressLabTab />;
      case 'reconciliation':
        return <ReconciliationTab />;
      case 'diagnostics':
        return <DiagnosticsTab />;
      case 'export':
        return <ExportTab />;
      default:
        return <CockpitTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans antialiased overflow-x-hidden">
      {/* Top Header */}
      <Header />

      {/* Navigation Rail */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-24 lg:pb-12">
        {renderActiveTab()}
      </main>

      {/* Assumptions Diff Drawer */}
      <AssumptionsDrawer />

      {/* Mobile Bottom Navigation (<1024px) */}
      <MobileBottomNav />

      {/* Mandatory Safety & Regulatory Compliance Footer */}
      <Footer />
    </div>
  );
}

export default App;
