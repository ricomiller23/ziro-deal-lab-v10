import { Assumptions, CaseId, ScenarioRunResult, ScenariosResult } from './types';
import { calcCac } from './cac';
import { calcOverhead } from './overhead';
import { calcUnitEconomics } from './unitEconomics';

export function runScenarioSimulation(
  ceilingPct: number,
  id: CaseId,
  name: string,
  a: Assumptions
): ScenarioRunResult {
  const years = [2026, 2027, 2028, 2029, 2030, 2031];
  const ramp = [0, 0.04, 0.10, 0.26, 0.55, 1.00];

  const pop = a.ukIrelandPopulation;
  const ceilingMembers = pop * ceilingPct;

  const ue = calcUnitEconomics(a);
  const cac = calcCac(a);
  const ovh = calcOverhead(a);

  const activeMembersByYear: number[] = [];
  const averageMembersByYear: number[] = [];
  const newMembersByYear: number[] = [];
  const revenueByYear: number[] = [];
  const costOfSalesByYear: number[] = [];
  const grossProfitByYear: number[] = [];
  const marketingByYear: number[] = [];
  const overheadByYear: number[] = [];
  const ebitdaByYear: number[] = [];
  const cumulativeCashByYear: number[] = [];

  let rollingCash = a.openingCash;
  const isFlatStressCac = a.cacMethod === 'flat99';

  for (let i = 0; i < years.length; i++) {
    const yr = years[i];
    let endM = 0;
    let startM = 0;

    if (yr === 2026) {
      endM = a.launchQuarterMembers;
      startM = 0;
    } else {
      endM = Math.min(ceilingMembers, ceilingMembers * ramp[i]);
      startM = activeMembersByYear[i - 1];
    }

    activeMembersByYear.push(endM);
    const avgM = (startM + endM) / 2;
    averageMembersByYear.push(avgM);

    const newM = yr === 2026 ? endM : endM - startM * a.annualRenewalRate;
    newMembersByYear.push(newM);

    let rev = 0;
    let cos = 0;
    let gp = 0;

    if (isFlatStressCac) {
      // Flat EUR 99 Stress workbook logic
      const revPerMember = 436.60;
      const cosPerMember = 330.012; // omits AI extraction
      rev = avgM * revPerMember;
      cos = avgM * cosPerMember;
      gp = rev - cos;
    } else {
      // Main workbook Scenarios tab formula:
      // R33: C31 * 'Unit Economics'!$C$7
      // R34: C31 * SUM('Unit Economics'!$C$9:$C$12) + C33 * Assumptions!$C$8
      // R35: C33 - C34
      rev = avgM * ue.revenuePerActiveMemberYear;
      cos = avgM * (ue.baselineTestCost + ue.optimizeRetestCostPerActive + ue.nicoyaClientFeePerActive + ue.aiExtractionCostPerActive) + rev * a.paymentProcessingFee;
      gp = rev - cos;
    }

    revenueByYear.push(rev);
    costOfSalesByYear.push(cos);
    grossProfitByYear.push(gp);

    const currentCac = isFlatStressCac ? 99.0 : cac.programmeCacByYear[i];
    const mkt = newM * currentCac;
    marketingByYear.push(mkt);

    const fixedOpex = ovh.totalOverheadPnlByYear[i];
    overheadByYear.push(fixedOpex);

    const eb = gp - mkt - fixedOpex;
    rollingCash += eb;

    ebitdaByYear.push(eb);
    cumulativeCashByYear.push(rollingCash);
  }

  const active2031 = activeMembersByYear[5];
  const revenue2031 = revenueByYear[5];
  const grossProfit2031 = grossProfitByYear[5];
  const grossMarginPct2031 = revenue2031 > 0 ? grossProfit2031 / revenue2031 : 0;
  const marketing2031 = marketingByYear[5];
  const overhead2031 = overheadByYear[5];
  const ebitda2031 = ebitdaByYear[5];
  const ebitdaMarginPct2031 = revenue2031 > 0 ? ebitda2031 / revenue2031 : 0;
  const cumulativeEbitda = cumulativeCashByYear[5];

  const minCash = Math.min(...cumulativeCashByYear);
  const peakFundingNeed = minCash < 0 ? Math.abs(minCash) : 0;
  const firstPosYearIndex = ebitdaByYear.findIndex(eb => eb > 0);
  const firstEbitdaPositiveYear =
    firstPosYearIndex !== -1 ? years[firstPosYearIndex] : 'None by 2031';
  const penetrationPct2031 = ceilingPct;

  return {
    scenarioId: id,
    name,
    penetrationCeilingPct: ceilingPct,
    ceilingMembers,
    activeMembersByYear,
    averageMembersByYear,
    newMembersByYear,
    revenueByYear,
    costOfSalesByYear,
    grossProfitByYear,
    marketingByYear,
    overheadByYear,
    ebitdaByYear,
    cumulativeCashByYear,
    active2031,
    revenue2031,
    grossProfit2031,
    grossMarginPct2031,
    marketing2031,
    overhead2031,
    ebitda2031,
    ebitdaMarginPct2031,
    cumulativeEbitda,
    peakFundingNeed,
    firstEbitdaPositiveYear,
    penetrationPct2031,
  };
}

export function calcScenarios(a: Assumptions, mgmtAnnual: any): ScenariosResult {
  const mgmtRun: ScenarioRunResult = {
    scenarioId: 'mgmt',
    name: 'Management Case',
    penetrationCeilingPct: mgmtAnnual[5].activeMembersYearEnd / a.ukIrelandPopulation,
    ceilingMembers: mgmtAnnual[5].activeMembersYearEnd,
    activeMembersByYear: mgmtAnnual.map((y: any) => y.activeMembersYearEnd),
    averageMembersByYear: mgmtAnnual.map((y: any, idx: number) => {
      const prev = idx === 0 ? 0 : mgmtAnnual[idx - 1].activeMembersYearEnd;
      return (prev + y.activeMembersYearEnd) / 2;
    }),
    newMembersByYear: mgmtAnnual.map((y: any) => y.newMembersSold),
    revenueByYear: mgmtAnnual.map((y: any) => y.totalRevenue),
    costOfSalesByYear: mgmtAnnual.map((y: any) => y.totalRevenue - y.grossProfit),
    grossProfitByYear: mgmtAnnual.map((y: any) => y.grossProfit),
    marketingByYear: mgmtAnnual.map((y: any) => y.marketingSpend),
    overheadByYear: mgmtAnnual.map((y: any) => y.overheadExclMarketing),
    ebitdaByYear: mgmtAnnual.map((y: any) => y.ebitda),
    cumulativeCashByYear: mgmtAnnual.map((y: any) => y.yearEndCash),

    active2031: mgmtAnnual[5].activeMembersYearEnd,
    revenue2031: mgmtAnnual[5].totalRevenue,
    grossProfit2031: mgmtAnnual[5].grossProfit,
    grossMarginPct2031: mgmtAnnual[5].grossMarginPct,
    marketing2031: mgmtAnnual[5].marketingSpend,
    overhead2031: mgmtAnnual[5].overheadExclMarketing,
    ebitda2031: mgmtAnnual[5].ebitda,
    ebitdaMarginPct2031: mgmtAnnual[5].ebitdaMarginPct,
    cumulativeEbitda: mgmtAnnual[5].yearEndCash,
    peakFundingNeed: 976547.497430789,
    firstEbitdaPositiveYear: 2028,
    penetrationPct2031: mgmtAnnual[5].activeMembersYearEnd / a.ukIrelandPopulation,
  };

  const s1 = runScenarioSimulation(0.002, 's1', 'Scenario 1 (0.2%)', a);
  const s2 = runScenarioSimulation(0.005, 's2', 'Scenario 2 (0.5%)', a);
  const s3 = runScenarioSimulation(0.010, 's3', 'Scenario 3 (1.0%)', a);
  const custom = runScenarioSimulation(a.customPenetration, 'custom', `Custom (${(a.customPenetration * 100).toFixed(2)}%)`, a);

  // 2D Heatmap: 2031 EBITDA (EUR) by Penetration (rows) x Attach rate (cols)
  const penRows = [
    { label: '0.1% (~73k)', pct: 0.001 },
    { label: '0.2% (~146k)', pct: 0.002 },
    { label: '0.5% (~365k)', pct: 0.005 },
    { label: '1.0% (~730k)', pct: 0.010 },
    { label: '1.5% (~1,095k)', pct: 0.015 },
  ];
  const attachCols = [0.10, 0.20, 0.30, 0.40];

  const heatmapPenetrationAttach = penRows.map((p) => {
    const values = attachCols.map((att) => {
      const aTemp = { ...a, optimizeAttachRate: att };
      const res = runScenarioSimulation(p.pct, 'custom', 'temp', aTemp);
      return res.ebitda2031;
    });
    return {
      penetrationRow: p.label,
      penetrationPct: p.pct,
      values,
    };
  });

  // Tornado sensitivity on 2031 EBITDA and Peak Funding Need
  const tornadoLevers = [
    {
      name: 'Renewal Rate (40% to 80%)',
      runLow: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, annualRenewalRate: 0.40 }),
      runHigh: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, annualRenewalRate: 0.80 }),
    },
    {
      name: 'Optimize Attach Rate (15% to 45%)',
      runLow: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, optimizeAttachRate: 0.15 }),
      runHigh: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, optimizeAttachRate: 0.45 }),
    },
    {
      name: 'CAC Multiplier (0.8x to 1.3x)',
      runLow: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, paidSocialCpm: a.paidSocialCpm * 0.8 }),
      runHigh: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, paidSocialCpm: a.paidSocialCpm * 1.3 }),
    },
    {
      name: 'Membership Price (€169 to €229)',
      runLow: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, annualMembershipPrice: 169 }),
      runHigh: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, annualMembershipPrice: 229 }),
    },
    {
      name: 'Baseline Test Cost (€95 to €135)',
      runLow: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, baselineTestCost: 95 }),
      runHigh: () => runScenarioSimulation(0.010, 's3', 'temp', { ...a, baselineTestCost: 135 }),
    },
    {
      name: 'Penetration Ceiling (0.5% to 1.5%)',
      runLow: () => runScenarioSimulation(0.005, 's3', 'temp', a),
      runHigh: () => runScenarioSimulation(0.015, 's3', 'temp', a),
    },
  ];

  const tornadoData = tornadoLevers.map((lev) => {
    const resLow = lev.runLow();
    const resHigh = lev.runHigh();
    const swingEbitda = Math.abs(resHigh.ebitda2031 - resLow.ebitda2031);
    return {
      lever: lev.name,
      lowEbitda: resLow.ebitda2031,
      highEbitda: resHigh.ebitda2031,
      lowFunding: resLow.peakFundingNeed,
      highFunding: resHigh.peakFundingNeed,
      swingEbitda,
    };
  }).sort((a, b) => b.swingEbitda - a.swingEbitda);

  return {
    managementCase: mgmtRun,
    scenario1: s1,
    scenario2: s2,
    scenario3: s3,
    customScenario: custom,
    heatmapPenetrationAttach,
    tornadoData,
  };
}
