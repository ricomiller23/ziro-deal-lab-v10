import React from 'react';
import { useDealStore } from '../../store/useDealStore';
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatPct,
  formatMultiple
} from '../../utils/formatters';
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CalendarCheck,
  ShieldCheck,
  ArrowUpRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export const CockpitTab: React.FC = () => {
  const { results, assumptions, setActiveTab } = useDealStore();

  const chartData = results.annual.map((y) => ({
    year: String(y.year),
    revenue: Math.round(y.totalRevenue / 1e6 * 10) / 10,
    grossProfit: Math.round(y.grossProfit / 1e6 * 10) / 10,
    ebitda: Math.round(y.ebitda / 1e6 * 10) / 10,
    cash: Math.round(y.yearEndCash / 1e6 * 10) / 10,
    membersK: Math.round(y.activeMembersYearEnd / 1000),
  }));

  const jCurveData = results.quarterly.map((q) => ({
    quarter: q.quarterLabel,
    cumulativeCash: Math.round(q.cumulativeCash / 1000),
    ebitda: Math.round(q.ebitda / 1000),
  }));

  const penetrationPct = results.populationPenetrationPct2031;

  return (
    <div className="space-y-6">
      {/* Live Takeaway Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/5 border border-amber-500/30 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5 shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-amber-400 mb-1">
              Active Case Executive Takeaway
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
              {results.plainEnglishTakeaway}
            </p>
          </div>
        </div>
      </div>

      {/* 6 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: 2031 Active Members */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">2031 Active Members</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {formatNumber(results.activeMembers2031)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-cyan-400 font-bold">{penetrationPct.toFixed(2)}%</span>
            <span className="text-slate-400">of 73M UK & IE adult population</span>
          </div>
        </div>

        {/* Card 2: 2031 Revenue */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">2031 Total Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {formatCurrency(results.revenue2031)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-slate-300 font-semibold">{results.grossMargin2031.toFixed(1)}%</span>
            <span className="text-slate-400">Gross Margin ({formatCompactCurrency(results.grossProfit2031)})</span>
          </div>
        </div>

        {/* Card 3: 2031 EBITDA */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">2031 EBITDA</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {formatCurrency(results.ebitda2031)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-amber-300 font-semibold">
              {((results.ebitda2031 / results.revenue2031) * 100).toFixed(1)}%
            </span>
            <span className="text-slate-400">EBITDA Margin</span>
          </div>
        </div>

        {/* Card 4: Peak Cash Need */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Peak Cash Funding Need</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">
            {formatCurrency(results.peakFundingNeed)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-rose-300 font-semibold">Trough at Q4 2027</span>
            <span className="text-slate-400">(€0 starting cash basis)</span>
          </div>
        </div>

        {/* Card 5: First Positive Year */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">First Cash-Flow Positive</span>
            <CalendarCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            Year {results.firstEbitdaPositiveYear}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>2028 EBITDA turns to</span>
            <span className="text-emerald-400 font-semibold">+€2.88M</span>
          </div>
        </div>

        {/* Card 6: 2027 Fully Loaded LTV:CAC */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">2027 Fully Loaded LTV:CAC</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400">
            {formatMultiple(results.fullyLoadedLtvCac2027)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>Payback:</span>
            <span className="text-slate-200 font-semibold">
              {results.annual[1]?.cacPaybackMonths.toFixed(1)} months
            </span>
            <span>(LTV €264.93)</span>
          </div>
        </div>
      </div>

      {/* UK & Ireland Reality Check Gauge Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>UK & Ireland Population Reality Check</span>
              <span className="text-xs font-normal text-slate-400">(Total: 73,000,000 adults)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sanity-checking whether membership targets require implausible mass-market consumer adoption.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('scenarios')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1 min-h-[36px]"
          >
            Explore Scenarios <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
              <span>Active Case Penetration: <strong className="text-amber-400">{penetrationPct.toFixed(2)}%</strong> ({formatNumber(results.activeMembers2031)} members)</span>
              <span>Ceiling: 100% (73M)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(1, penetrationPct * 10))}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              *Visual bar scaled 10x for visibility (actual is {penetrationPct.toFixed(2)}% of the entire UK+IE adult population).
            </div>
          </div>

          {/* Reference Benchmarks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-medium">Scenario 1 (0.2%)</div>
              <div className="text-sm font-bold text-white mt-0.5">146,000 members</div>
              <div className="text-[10px] text-slate-400 mt-1">Niche premium wellness</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-medium">Scenario 2 (0.5%)</div>
              <div className="text-sm font-bold text-white mt-0.5">365,000 members</div>
              <div className="text-[10px] text-slate-400 mt-1">Upper-tier biohacker scale</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-medium">Scenario 3 (1.0%)</div>
              <div className="text-sm font-bold text-white mt-0.5">730,000 members</div>
              <div className="text-[10px] text-slate-400 mt-1">Mass affluent preventive health</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="text-[11px] text-amber-300 font-medium">Management Plan</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">740,616 members</div>
              <div className="text-[10px] text-amber-300/80 mt-1">1.01% penetration (QoQ formula)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Core Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue & EBITDA Rollup */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-sm text-white">Revenue & EBITDA Growth (2026–2031)</h4>
              <p className="text-xs text-slate-400">Values in Millions EUR (€M)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`€${val}M`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="revenue" name="Total Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="grossProfit" name="Gross Profit" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 21-Quarter J-Curve Cash Trajectory */}
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-sm text-white">Cumulative Cash J-Curve (21 Quarters)</h4>
              <p className="text-xs text-slate-400">Trough marked at Q4 2027 (-€976.5k)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={jCurveData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="quarter" stroke="#64748b" tick={{ fontSize: 10 }} interval={3} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`€${val}k`, 'Cumulative Cash']}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeCash"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cashGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
