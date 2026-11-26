import { Assumptions, AnnualData, QuarterData } from './types';
import { calcCac } from './cac';
import { calcOverhead } from './overhead';

export function calcAnnual(quarters: QuarterData[], a: Assumptions): AnnualData[] {
  const years = [2026, 2027, 2028, 2029, 2030, 2031];
  const cac = calcCac(a);
  const ovh = calcOverhead(a);

  return years.map((yr, yrIdx) => {
    const qInYear = quarters.filter(q => q.year === yr);
    const monthsInPeriod = yr === 2026 ? 3 : 12;

    const activeMembersYearEnd = qInYear[qInYear.length - 1].activeMembers;
    const newMembersSold = qInYear.reduce((sum, q) => sum + q.newMembers, 0);
    const renewals = qInYear.reduce((sum, q) => sum + q.renewals, 0);
    const churn = qInYear.reduce((sum, q) => sum + q.churn, 0);

    const totalRevenue = qInYear.reduce((sum, q) => sum + q.totalRevenue, 0);
    const baselineRevenue = qInYear.reduce((sum, q) => sum + q.baselineRevenue, 0);
    const optimizeRevenue = qInYear.reduce((sum, q) => sum + q.optimizeRevenue, 0);

    const grossProfit = qInYear.reduce((sum, q) => sum + q.grossProfit, 0);
    const grossMarginPct = totalRevenue > 0 ? grossProfit / totalRevenue : 0;

    const marketingSpend = qInYear.reduce((sum, q) => sum + q.marketingSpend, 0);
    const overheadExclMarketing = qInYear.reduce((sum, q) =>
      sum + q.peopleOpex + q.techStackOpex + q.nicoyaBaseOpex + q.nicoyaAppOpex + q.oneOffLaunchCosts + q.contingencyOpex + q.addOnsOpex, 0
    );

    const ebitda = qInYear.reduce((sum, q) => sum + q.ebitda, 0);
    const ebitdaMarginPct = totalRevenue > 0 ? ebitda / totalRevenue : 0;

    const yearEndCash = qInYear[qInYear.length - 1].cumulativeCash;
    const lowestCashInYear = Math.min(...qInYear.map(q => q.cumulativeCash));

    // CAC metrics
    const programmeCac = newMembersSold > 0 ? marketingSpend / newMembersSold : 0;

    // Fully-loaded CAC adds growth team + tools from Overhead
    const growthTools = cac.growthTeamToolsByYear[yrIdx];
    const fullyLoadedCac = newMembersSold > 0 ? (marketingSpend + growthTools) / newMembersSold : programmeCac;

    // Unit contribution per active member = revenue/member - cost/member
    const blendedTestsPerQuarter = a.monthlyOptimizeShare * 3 + (1 - a.monthlyOptimizeShare) * 1;
    const revPerActive = a.annualMembershipPrice + a.optimizeAttachRate * (blendedTestsPerQuarter * a.optimizeRetestPrice * 4);
    const nicoyaClientFeePerActive = a.nicoyaPerClientFeeGbp * a.fxGbpEur * 12;
    const annualTestsWeighted = 1 + a.optimizeAttachRate * blendedTestsPerQuarter * 4;
    const aiExtractionCostPerActive = annualTestsWeighted * a.aiExtractionPagesPerSample * a.aiExtractionCostPerPageUsd * a.fxUsdEur;
    const totalCostPerActive = a.baselineTestCost + a.optimizeAttachRate * (blendedTestsPerQuarter * a.optimizeRetestCost * 4) + nicoyaClientFeePerActive + aiExtractionCostPerActive + revPerActive * a.paymentProcessingFee;
    const contributionPerActive = revPerActive - totalCostPerActive;

    const expectedLifetimeYears = a.annualRenewalRate < 1 ? 1 / (1 - a.annualRenewalRate) : 10;
    const ltv = contributionPerActive * expectedLifetimeYears;

    const ltvCacProgramme = programmeCac > 0 ? ltv / programmeCac : 0;
    const ltvCacFullyLoaded = fullyLoadedCac > 0 ? ltv / fullyLoadedCac : 0;

    const cacPaybackMonths = contributionPerActive > 0 ? fullyLoadedCac / (contributionPerActive / 12) : 0;
    const maxCac3x = ltv / 3;

    // Peptide Memo
    const peptideRevenue = qInYear.reduce((sum, q) => sum + q.peptideRevenue, 0);
    const peptideGrossProfit = qInYear.reduce((sum, q) => sum + q.peptideGrossProfit, 0);
    const ebitdaWithPeptide = qInYear.reduce((sum, q) => sum + q.ebitdaWithPeptide, 0);

    return {
      year: yr,
      monthsInPeriod,
      activeMembersYearEnd,
      newMembersSold,
      renewals,
      churn,
      totalRevenue,
      baselineRevenue,
      optimizeRevenue,
      grossProfit,
      grossMarginPct,
      marketingSpend,
      overheadExclMarketing,
      ebitda,
      ebitdaMarginPct,
      yearEndCash,
      lowestCashInYear,
      programmeCac,
      fullyLoadedCac,
      ltvCacProgramme,
      ltvCacFullyLoaded,
      cacPaybackMonths,
      maxCac3x,
      peptideRevenue,
      peptideGrossProfit,
      ebitdaWithPeptide,
    };
  });
}
