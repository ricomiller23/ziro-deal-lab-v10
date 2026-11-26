import { Assumptions, QuarterData } from './types';
import { calcCac } from './cac';
import { calcOverhead } from './overhead';

export function calcQuarterly(a: Assumptions): QuarterData[] {
  const cac = calcCac(a);
  const ovh = calcOverhead(a);

  const years = [2026, 2027, 2028, 2029, 2030, 2031];
  const yearIndices: number[] = [];
  const quarterLabels: string[] = [];
  const quarterYears: number[] = [];
  const quarterOfYears: number[] = [];

  // Q4 2026
  quarterLabels.push('Q4 2026');
  quarterYears.push(2026);
  quarterOfYears.push(4);
  yearIndices.push(0);

  // 2027..2031 (4 quarters each = 20 quarters, total 21)
  for (let y = 1; y < years.length; y++) {
    const yr = years[y];
    for (let q = 1; q <= 4; q++) {
      quarterLabels.push(`Q${q} ${yr}`);
      quarterYears.push(yr);
      quarterOfYears.push(q);
      yearIndices.push(y);
    }
  }

  const growthByYear = [
    a.qoqGrowth2026,
    a.qoqGrowth2027,
    a.qoqGrowth2028,
    a.qoqGrowth2029,
    a.qoqGrowth2030,
    a.qoqGrowth2031,
  ];

  const quartersCount = quarterLabels.length; // 21

  const newMembers: number[] = [];
  const renewals: number[] = [];
  const totalTransacted: number[] = [];
  const churn: number[] = [];
  const activeMembers: number[] = [];
  const optimizeAttached: number[] = [];

  const baselineRevenue: number[] = [];
  const optimizeRevenue: number[] = [];
  const totalRevenue: number[] = [];

  const baselineTestCost: number[] = [];
  const optimizeRetestCost: number[] = [];
  const nicoyaClientFee: number[] = [];
  const nicoyaAiExtractionCost: number[] = [];
  const paymentProcessing: number[] = [];
  const totalCostOfSales: number[] = [];

  const grossProfit: number[] = [];
  const grossMarginPct: number[] = [];

  const marketingSpend: number[] = [];
  const programmeCac: number[] = [];
  const peopleOpex: number[] = [];
  const techStackOpex: number[] = [];
  const nicoyaBaseOpex: number[] = [];
  const nicoyaAppOpex: number[] = [];
  const oneOffLaunchCosts: number[] = [];
  const contingencyOpex: number[] = [];
  const addOnsOpex: number[] = [];
  const totalOpex: number[] = [];

  const ebitda: number[] = [];
  const ebitdaMarginPct: number[] = [];
  const cumulativeCash: number[] = [];

  const peptideRevenue: number[] = [];
  const peptideGrossProfit: number[] = [];
  const ebitdaWithPeptide: number[] = [];

  // Peptide parameters
  const isConservative = a.peptideCase === 'conservative';
  const peptideAttach = isConservative ? a.conservativeAttachRate : a.managementAttachRate;

  // Average product cost (USD)
  const productCostsUsd = [
    a.costBpc157, a.costGhkCu, a.costCjc1295, a.costSemax, a.costDsip,
    a.costThymosinAlpha, a.costPt141, a.costMotsC, a.costNadPlus
  ];
  const avgProductCostUsd = productCostsUsd.reduce((s, c) => s + c, 0) / productCostsUsd.length;

  const peptideSpendEur = isConservative
    ? a.conservativeAnnualSpendEur
    : a.managementOrderPriceUsd * a.managementOrdersPerYear * a.fxUsdEur;

  const peptideMargin = isConservative
    ? a.conservativeGrossMargin
    : 1 - avgProductCostUsd / a.managementOrderPriceUsd;

  const haircutFactor = Math.max(0, 1 - a.peptideRegulatoryHaircut);

  // Blended Optimize retest metrics per attached member per quarter
  const blendedTestsPerQuarter = a.monthlyOptimizeShare * 3 + (1 - a.monthlyOptimizeShare) * 1;
  const blendedOptimizeRevPerQuarter = blendedTestsPerQuarter * a.optimizeRetestPrice;
  const blendedOptimizeCostPerQuarter = blendedTestsPerQuarter * a.optimizeRetestCost;

  let rollingCash = a.openingCash;

  for (let t = 0; t < quartersCount; t++) {
    const yrIdx = yearIndices[t];
    const qGrowth = growthByYear[yrIdx];

    // 1. Members
    let nMem = 0;
    if (t === 0) {
      nMem = a.launchQuarterMembers;
    } else {
      nMem = newMembers[t - 1] * (1 + qGrowth);
    }
    newMembers.push(nMem);

    let ren = 0;
    let chn = 0;
    if (t >= 4) {
      const cohortTransacted = totalTransacted[t - 4];
      ren = cohortTransacted * a.annualRenewalRate;
      chn = cohortTransacted * (1 - a.annualRenewalRate);
    }
    renewals.push(ren);
    churn.push(chn);

    const transacted = nMem + ren;
    totalTransacted.push(transacted);

    let act = 0;
    if (t === 0) {
      act = nMem;
    } else {
      act = activeMembers[t - 1] + nMem - chn;
    }
    activeMembers.push(act);

    const optAtt = act * a.optimizeAttachRate;
    optimizeAttached.push(optAtt);

    // 2. Revenue
    const bRev = transacted * a.annualMembershipPrice;
    const optRev = optAtt * blendedOptimizeRevPerQuarter;
    const totRev = bRev + optRev;
    baselineRevenue.push(bRev);
    optimizeRevenue.push(optRev);
    totalRevenue.push(totRev);

    // 3. Cost of Sales
    const bCost = transacted * a.baselineTestCost;
    const optCost = optAtt * blendedOptimizeCostPerQuarter;
    const nicClientFee = Math.max(0, act - a.nicoyaIncludedClients) * a.nicoyaPerClientFeeGbp * 3 * a.fxGbpEur;
    const totalSamples = transacted + optAtt * blendedTestsPerQuarter;
    const aiCost = totalSamples * a.aiExtractionPagesPerSample * a.aiExtractionCostPerPageUsd * a.fxUsdEur;
    const procFee = totRev * a.paymentProcessingFee;
    const totCos = bCost + optCost + nicClientFee + aiCost + procFee;

    baselineTestCost.push(bCost);
    optimizeRetestCost.push(optCost);
    nicoyaClientFee.push(nicClientFee);
    nicoyaAiExtractionCost.push(aiCost);
    paymentProcessing.push(procFee);
    totalCostOfSales.push(totCos);

    const gp = totRev - totCos;
    const gm = totRev > 0 ? gp / totRev : 0;
    grossProfit.push(gp);
    grossMarginPct.push(gm);

    // 4. Operating Expenses
    const currentCac = a.cacMethod === 'flat99' ? 99.0 : cac.programmeCacByYear[yrIdx];
    programmeCac.push(currentCac);
    const mkt = nMem * currentCac;
    marketingSpend.push(mkt);

    const ppl = ovh.monthlyPeopleCostEur[yrIdx] * 3;
    const tech = ovh.totalTechStackMonthlyByYear[yrIdx] * 3;
    const nicBase = ovh.nicoyaPlatformBaseEur * 3;
    const nicApp = ovh.nicoyaAppFeeEur * 3;
    const oneOff = t === 0 ? ovh.oneOffs2026Eur : 0;
    const cont = ovh.contingencyMonthlyByYear[yrIdx] * 3;
    const addOn = ovh.addOnsMonthlyByYear[yrIdx] * 3;
    const totOpex = mkt + ppl + tech + nicBase + nicApp + oneOff + cont + addOn;

    peopleOpex.push(ppl);
    techStackOpex.push(tech);
    nicoyaBaseOpex.push(nicBase);
    nicoyaAppOpex.push(nicApp);
    oneOffLaunchCosts.push(oneOff);
    contingencyOpex.push(cont);
    addOnsOpex.push(addOn);
    totalOpex.push(totOpex);

    // 5. EBITDA & Cash
    const eb = gp - totOpex;
    const em = totRev > 0 ? eb / totRev : 0;
    rollingCash += eb;
    ebitda.push(eb);
    ebitdaMarginPct.push(em);
    cumulativeCash.push(rollingCash);

    // 6. Peptide Memo
    const pepRev = act * peptideAttach * (peptideSpendEur / 4);
    const pepGp = pepRev * peptideMargin * haircutFactor;
    const ebPep = eb + pepGp;

    peptideRevenue.push(pepRev);
    peptideGrossProfit.push(pepGp);
    ebitdaWithPeptide.push(ebPep);
  }

  // Construct structured result
  return quarterLabels.map((lbl, idx) => ({
    quarterIndex: idx,
    quarterLabel: lbl,
    year: quarterYears[idx],
    quarterOfYear: quarterOfYears[idx],

    newMembers: newMembers[idx],
    renewals: renewals[idx],
    totalTransacted: totalTransacted[idx],
    churn: churn[idx],
    activeMembers: activeMembers[idx],
    optimizeAttached: optimizeAttached[idx],

    baselineRevenue: baselineRevenue[idx],
    optimizeRevenue: optimizeRevenue[idx],
    totalRevenue: totalRevenue[idx],

    baselineTestCost: baselineTestCost[idx],
    optimizeRetestCost: optimizeRetestCost[idx],
    nicoyaClientFee: nicoyaClientFee[idx],
    nicoyaAiExtractionCost: nicoyaAiExtractionCost[idx],
    paymentProcessing: paymentProcessing[idx],
    totalCostOfSales: totalCostOfSales[idx],

    grossProfit: grossProfit[idx],
    grossMarginPct: grossMarginPct[idx],

    marketingSpend: marketingSpend[idx],
    programmeCac: programmeCac[idx],
    peopleOpex: peopleOpex[idx],
    techStackOpex: techStackOpex[idx],
    nicoyaBaseOpex: nicoyaBaseOpex[idx],
    nicoyaAppOpex: nicoyaAppOpex[idx],
    oneOffLaunchCosts: oneOffLaunchCosts[idx],
    contingencyOpex: contingencyOpex[idx],
    addOnsOpex: addOnsOpex[idx],
    totalOpex: totalOpex[idx],

    ebitda: ebitda[idx],
    ebitdaMarginPct: ebitdaMarginPct[idx],
    cumulativeCash: cumulativeCash[idx],

    peptideRevenue: peptideRevenue[idx],
    peptideGrossProfit: peptideGrossProfit[idx],
    ebitdaWithPeptide: ebitdaWithPeptide[idx],
  }));
}
