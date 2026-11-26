import { create } from 'zustand';
import { Assumptions, CaseId, EngineResults, MonteCarloResult } from '../engine/types';
import { DEFAULT_ASSUMPTIONS } from '../engine/defaults';
import { calcAll } from '../engine/calcAll';

export type TabId =
  | 'cockpit'
  | 'assumptions'
  | 'members'
  | 'pnl'
  | 'unit-economics'
  | 'cac'
  | 'overhead'
  | 'scenarios'
  | 'peptides'
  | 'raise'
  | 'stress'
  | 'reconciliation'
  | 'diagnostics'
  | 'export';

interface DealState {
  assumptions: Assumptions;
  results: EngineResults;
  activeTab: TabId;
  isMonteCarloRunning: boolean;
  isDrawerOpen: boolean;
  history: Assumptions[];
  historyIndex: number;

  setActiveTab: (tab: TabId) => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  updateAssumption: <K extends keyof Assumptions>(key: K, value: Assumptions[K]) => void;
  updateMultipleAssumptions: (partial: Partial<Assumptions>) => void;
  resetToDefaults: () => void;
  applyCase: (caseId: CaseId) => void;
  applyPreset: (presetId: string) => void;
  undo: () => void;
  redo: () => void;
  setMonteCarloResults: (results: MonteCarloResult) => void;
  setMonteCarloRunning: (running: boolean) => void;
}

const STORAGE_KEY = 'ziro_deal_lab_assumptions_v1';

function loadInitialAssumptions(): Assumptions {
  if (typeof window !== 'undefined') {
    try {
      if (window.location.hash && window.location.hash.startsWith('#model=')) {
        const jsonStr = decodeURIComponent(atob(window.location.hash.replace('#model=', '')));
        const parsed = JSON.parse(jsonStr);
        return { ...DEFAULT_ASSUMPTIONS, ...parsed };
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_ASSUMPTIONS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load saved state, falling back to defaults', e);
    }
  }
  return DEFAULT_ASSUMPTIONS;
}

const initialAssumptions = loadInitialAssumptions();
const initialResults = calcAll(initialAssumptions);

export const useDealStore = create<DealState>((set, get) => ({
  assumptions: initialAssumptions,
  results: initialResults,
  activeTab: 'cockpit',
  isMonteCarloRunning: false,
  isDrawerOpen: false,
  history: [initialAssumptions],
  historyIndex: 0,

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),

  updateAssumption: (key, value) => {
    const { assumptions, history, historyIndex, results } = get();
    if (assumptions[key] === value) return;

    const newAssumptions = { ...assumptions, [key]: value };
    const newResults = calcAll(newAssumptions, results.monteCarlo);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAssumptions);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newAssumptions));
      } catch (e) {}
    }

    set({
      assumptions: newAssumptions,
      results: newResults,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  updateMultipleAssumptions: (partial) => {
    const { assumptions, history, historyIndex, results } = get();
    const newAssumptions = { ...assumptions, ...partial };
    const newResults = calcAll(newAssumptions, results.monteCarlo);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAssumptions);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newAssumptions));
      } catch (e) {}
    }

    set({
      assumptions: newAssumptions,
      results: newResults,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  resetToDefaults: () => {
    const newResults = calcAll(DEFAULT_ASSUMPTIONS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      window.location.hash = '';
    }
    set({
      assumptions: DEFAULT_ASSUMPTIONS,
      results: newResults,
      history: [DEFAULT_ASSUMPTIONS],
      historyIndex: 0,
    });
  },

  applyCase: (caseId) => {
    get().updateAssumption('activeCase', caseId);
  },

  applyPreset: (presetId) => {
    let updates: Partial<Assumptions> = {};

    switch (presetId) {
      case 'mgmt_verified':
        updates = { ...DEFAULT_ASSUMPTIONS, activeCase: 'mgmt', cacMethod: 'bottomUp' };
        break;
      case 's1_conservative':
        updates = { activeCase: 's1', cacMethod: 'bottomUp' };
        break;
      case 's2_moderate':
        updates = { activeCase: 's2', cacMethod: 'bottomUp' };
        break;
      case 's3_target':
        updates = { activeCase: 's3', cacMethod: 'bottomUp' };
        break;
      case 'flat_99_stress':
        updates = { cacMethod: 'flat99', activeCase: 's1' };
        break;
      case 'predatory_august_note':
        updates = { activeNoteDraft: 'form081226', noteConversionDiscount: 0.50 };
        break;
      case 'lender_friendly_final_note':
        updates = { activeNoteDraft: 'final', noteConversionDiscount: 0.20 };
        break;
      case 'high_churn_stress':
        updates = { annualRenewalRate: 0.40, optimizeAttachRate: 0.20 };
        break;
    }

    get().updateMultipleAssumptions(updates);
  },

  undo: () => {
    const { history, historyIndex, results } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      const newResults = calcAll(prev, results.monteCarlo);
      set({
        assumptions: prev,
        results: newResults,
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex, results } = get();
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      const newResults = calcAll(next, results.monteCarlo);
      set({
        assumptions: next,
        results: newResults,
        historyIndex: historyIndex + 1,
      });
    }
  },

  setMonteCarloResults: (mc) => {
    set((state) => ({
      results: {
        ...state.results,
        monteCarlo: mc,
      },
      isMonteCarloRunning: false,
    }));
  },

  setMonteCarloRunning: (running) => set({ isMonteCarloRunning: running }),
}));
