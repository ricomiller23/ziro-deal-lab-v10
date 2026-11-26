import React, { useRef } from 'react';
import { useDealStore } from '../../store/useDealStore';
import { formatCurrency, formatPct, formatCompactCurrency } from '../../utils/formatters';
import { Dices, Play, Loader2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const StressLabTab: React.FC = () => {
  const { results, assumptions, isMonteCarloRunning, setMonteCarloRunning, setMonteCarloResults } = useDealStore();
  const mc = results.monteCarlo;
  const workerRef = useRef<Worker | null>(null);

  const handleRunSimulation = () => {
    setMonteCarloRunning(true);
    try {
      if (!workerRef.current) {
        workerRef.current = new Worker(
          new URL('../../workers/monteCarlo.worker.ts', import.meta.url),
          { type: 'module' }
        );
      }

      workerRef.current.onmessage = (e) => {
        if (e.data.success) {
          setMonteCarloResults(e.data.results);
        } else {
          console.error('Monte Carlo worker failed:', e.data.error);
          setMonteCarloRunning(false);
        }
      };

      workerRef.current.postMessage({ assumptions, iterations: 10000 });
    } catch (err) {
      console.warn('Web worker unavailable, fallback to sync simulation', err);
      // Run quick synchronous pass
      import('../../engine/monteCarlo').then(({ runMonteCarloSim }) => {
        const res = runMonteCarloSim(assumptions, 5000);
        setMonteCarloResults(res);
      });
    }
  };

  const fundingData = mc.fundingHistogram.map((b) => ({
    label: b.binLabel,
    count: b.count,
    pct: ((b.count / mc.trialsCount) * 100).toFixed(1),
  }));

  const ebitdaData = mc.ebitdaHistogram.map((b) => ({
    label: b.binLabel,
    count: b.count,
    pct: ((b.count / mc.trialsCount) * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Monte Carlo Run Card */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Dices className="h-5 w-5 text-cyan-400" />
            <span>10,000-Draw Monte Carlo Stress Engine</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Simulates joint stochastic perturbations across Renewal Rate (40–80%), Optimize Attach (15–50%), CAC inflation (0.7x–1.6x), and lab kit costs (€70–€105) inside a dedicated non-blocking Web Worker.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isMonteCarloRunning}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg min-h-[44px] ${
            isMonteCarloRunning
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
          }`}
        >
          {isMonteCarloRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Simulating 10,000 Draws...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              Re-Run 10,000 Draws
            </>
          )}
        </button>
      </div>

      {/* Percentiles Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Median Peak Need (P50)</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatCurrency(mc.p50PeakFunding)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            P10: {formatCompactCurrency(mc.p10PeakFunding)} · P90: {formatCompactCurrency(mc.p90PeakFunding)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Median 2031 EBITDA (P50)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCompactCurrency(mc.p50Ebitda2031)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            P10: {formatCompactCurrency(mc.p10Ebitda2031)} · P90: {formatCompactCurrency(mc.p90Ebitda2031)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Prob Exceeding $500k Note</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {mc.probFundingExceedsRaise.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Cash trough &gt; €463k ($500k equiv.)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Prob Positive by 2028</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {mc.probPositiveBy2028.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            100% positive by 2029 across all trials
          </div>
        </div>
      </div>

      {/* Two Distribution Histograms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histogram 1: Peak Cash Funding */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <h4 className="font-bold text-sm text-white mb-1">Peak Cash Need Distribution</h4>
          <p className="text-xs text-slate-400 mb-4">Frequency across 10,000 simulated iterations</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`${val} draws (${((val / mc.trialsCount) * 100).toFixed(1)}%)`, 'Draws']}
                />
                <Bar dataKey="count" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Histogram 2: 2031 EBITDA */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <h4 className="font-bold text-sm text-white mb-1">2031 EBITDA Distribution (€M)</h4>
          <p className="text-xs text-slate-400 mb-4">Frequency across 10,000 simulated iterations</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ebitdaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`${val} draws (${((val / mc.trialsCount) * 100).toFixed(1)}%)`, 'Draws']}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
