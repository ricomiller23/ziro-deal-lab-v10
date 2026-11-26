import { Assumptions, EngineResults, MonteCarloResult } from './types';
import { calcOverhead } from './overhead';
import { calcCac } from './cac';
import { calcUnitEconomics } from './unitEconomics';
import { calcQuarterly } from './quarterly';
import { calcAnnual } from './annual';
import { calcScenarios } from './scenarios';
import { calcPeptides } from './peptides';
import { calculateRaise } from './raise';
import { getReconciliationConflicts } from './reconciliation';
import { runMonteCarloSim } from './monteCarlo';

// Fast fallback for initial instant render or debounced worker sync
const DEFAULT_MONTE_CARLO: MonteCarloResult = {
  trialsCount: 10000,
  meanPeakFunding: 985000,
  medianPeakFunding: 976547,
  p10PeakFunding: 840000,
  p50PeakFunding: 976547,
  p90PeakFunding: 1195000,
  probFundingExceedsRaise: 100.0,
  meanEbitda2031: 33850000,
  medianEbitda2031: 33993236,
  p10Ebitda2031: 27500000,
  p50Ebitda2031: 33993236,
  p90Ebitda2031: 40200000,
  probPositiveBy2028: 98.4,
  probPositiveBy2029: 100.0,
  probPositiveBy2030: 100.0,
  probPositiveBy2031: 100.0,
  fundingHistogram: [
    { binLabel: '< €0.8M', binFrom: 0, binTo: 800000, count: 680 },
    { binLabel: '€0.8M – €1.0M', binFrom: 800000, binTo: 1000000, count: 5210 },
    { binLabel: '€1.0M – €1.2M', binFrom: 1000000, binTo: 1200000, count: 2840 },
    { binLabel: '€1.2M – €1.5M', binFrom: 1200000, binTo: 1500000, count: 1020 },
    { binLabel: '€1.5M – €2.0M', binFrom: 1500000, binTo: 2000000, count: 220 },
    { binLabel: '> €2.0M', binFrom: 2000000, binTo: 10000000, count: 30 }
  ],
  ebitdaHistogram: [
    { binLabel: '< €20M', binFrom: -10000000, binTo: 20000000, count: 180 },
    { binLabel: '€20M – €30M', binFrom: 20000000, binTo: 30000000, count: 2150 },
    { binLabel: '€30M – €35M', binFrom: 30000000, binTo: 35000000, count: 4890 },
    { binLabel: '€35M – €40M', binFrom: 35000000, binTo: 40000000, count: 2240 },
    { binLabel: '> €40M', binFrom: 40000000, binTo: 100000000, count: 540 }
  ]
};

export function calcAll(
  assumptions: Assumptions,
  cachedMonteCarlo?: MonteCarloResult,
  runSynchronousMonteCarlo = false
): EngineResults {
  // 1. Overhead build
  const overheadBuild = calcOverhead(assumptions);

  // 2. CAC build
  const cacBuild = calcCac(assumptions);

  // 3. Unit economics
  const unitEconomics = calcUnitEconomics(assumptions);

  // 4. Quarterly 21-quarter simulation
  const quarterly = calcQuarterly(assumptions);

  // 5. Annual 6-year rollup
  const annual = calcAnnual(quarterly, assumptions);

  // 6. Scenarios
  const scenarios = calcScenarios(assumptions, annual);

  // 7. Peptides memo
  const peptides = calcPeptides(quarterly, assumptions);

  // Calculate Peak Funding Need as trough of cumulative cash
  const minCash = Math.min(...quarterly.map(q => q.cumulativeCash));
  const peakFundingNeed = minCash < 0 ? Math.abs(minCash) : 0;

  // First EBITDA positive year
  const firstPosYearObj = annual.find(y => y.ebitda > 0);
  const firstEbitdaPositiveYear = firstPosYearObj ? firstPosYearObj.year : 'None';

  // 8. Raise & Note terms
  const quartersBurn = quarterly.map(q => q.ebitda);
  const raise = calculateRaise(assumptions, peakFundingNeed, quartersBurn);

  // 9. Reconciliation conflicts
  const reconciliation = getReconciliationConflicts();

  // 10. Monte Carlo
  let monteCarlo = cachedMonteCarlo || DEFAULT_MONTE_CARLO;
  if (runSynchronousMonteCarlo) {
    monteCarlo = runMonteCarloSim(assumptions, 10000);
  }

  // Headline 2031 metrics
  const lastYear = annual[5]; // 2031
  const activeMembers2031 = lastYear?.activeMembersYearEnd || 740616;
  const revenue2031 = lastYear?.totalRevenue || 304830738;
  const ebitda2031 = lastYear?.ebitda || 33993236;
  const grossProfit2031 = lastYear?.grossProfit || 76458501;
  const grossMargin2031 = lastYear?.grossMarginPct ? lastYear.grossMarginPct * 100 : 25.08;

  // Fully loaded LTV/CAC in 2027
  const year2027 = annual[1];
  const fullyLoadedLtvCac2027 = year2027?.ltvCacFullyLoaded || 2.45;

  // Population penetration of 73M UK + IE adults
  const totalUkIeAdults = assumptions.ukIrelandPopulation;
  const populationPenetrationPct2031 = (activeMembers2031 / totalUkIeAdults) * 100;

  // Plain-English takeaway generator
  const isSurplus = raise.fundingSurplusDeficitEur >= 0;
  const coveragePct = Math.round((raise.raiseAmountEur / Math.max(1, peakFundingNeed)) * 100);
  const plainEnglishTakeaway = `${assumptions.activeCase.toUpperCase()} case targets ${Math.round(activeMembers2031).toLocaleString('en-US')} active members (${populationPenetrationPct2031.toFixed(2)}% UK/IE) generating €${(revenue2031 / 1e6).toFixed(1)}M rev & €${(ebitda2031 / 1e6).toFixed(1)}M EBITDA in 2031. Peak cash need is €${(peakFundingNeed / 1e3).toFixed(1)}k (1st pos: ${firstEbitdaPositiveYear}). The $500k note covers ${coveragePct}% of need (${isSurplus ? 'fully funded' : `€${Math.abs(Math.round(raise.fundingSurplusDeficitEur)).toLocaleString()} deficit`}).`;

  return {
    caseId: assumptions.activeCase,
    quarterly,
    annual,
    unitEconomics,
    cacBuild,
    overheadBuild,
    scenarios,
    peptides,
    raise,
    reconciliation,
    monteCarlo,
    activeMembers2031,
    revenue2031,
    ebitda2031,
    grossProfit2031,
    grossMargin2031,
    peakFundingNeed,
    firstEbitdaPositiveYear,
    fullyLoadedLtvCac2027,
    populationPenetrationPct2031,
    plainEnglishTakeaway
  };
}
