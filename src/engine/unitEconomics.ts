import { Assumptions, UnitEconomicsResult } from './types';

export function calcUnitEconomics(a: Assumptions): UnitEconomicsResult {
  const annualMembershipPrice = a.annualMembershipPrice;
  const optimizeAttachRate = a.optimizeAttachRate;

  // Blended tests per attached member per quarter = monthlyShare * 3 + (1 - monthlyShare) * 1
  const blendedTestsPerQuarter = a.monthlyOptimizeShare * 3 + (1 - a.monthlyOptimizeShare) * 1;
  const optimizeRevenuePerAttachedYear = blendedTestsPerQuarter * a.optimizeRetestPrice * 4;
  const revenuePerActiveMemberYear =
    annualMembershipPrice + optimizeAttachRate * optimizeRevenuePerAttachedYear;

  const baselineTestCost = a.baselineTestCost;
  const optimizeRetestCostPerActive =
    optimizeAttachRate * (blendedTestsPerQuarter * a.optimizeRetestCost * 4);
  const nicoyaClientFeePerActive = a.nicoyaPerClientFeeGbp * a.fxGbpEur * 12;

  // AI extraction: (1 baseline + attach * tests/yr) * pages * cost/page * fx
  const annualTestsWeighted = 1 + optimizeAttachRate * blendedTestsPerQuarter * 4;
  const aiExtractionCostPerActive =
    annualTestsWeighted * a.aiExtractionPagesPerSample * a.aiExtractionCostPerPageUsd * a.fxUsdEur;

  const paymentProcessingPerActive = revenuePerActiveMemberYear * a.paymentProcessingFee;

  const totalCostPerActiveMemberYear =
    baselineTestCost +
    optimizeRetestCostPerActive +
    nicoyaClientFeePerActive +
    aiExtractionCostPerActive +
    paymentProcessingPerActive;

  const contributionPerActiveMemberYear =
    revenuePerActiveMemberYear - totalCostPerActiveMemberYear;
  const contributionMarginPct =
    revenuePerActiveMemberYear > 0 ? contributionPerActiveMemberYear / revenuePerActiveMemberYear : 0;

  const expectedLifetimeYears =
    a.annualRenewalRate < 1 ? 1 / (1 - a.annualRenewalRate) : 10;
  const ltv = contributionPerActiveMemberYear * expectedLifetimeYears;
  const maxCac3x = ltv / 3;

  // Waterfall 1: Baseline-only member
  const bRev = annualMembershipPrice;
  const bTest = baselineTestCost;
  const bNicoya = nicoyaClientFeePerActive;
  const bAi = 1 * a.aiExtractionPagesPerSample * a.aiExtractionCostPerPageUsd * a.fxUsdEur;
  const bProc = bRev * a.paymentProcessingFee;
  const bCost = bTest + bNicoya + bAi + bProc;
  const bCont = bRev - bCost;

  // Waterfall 2: Optimize-attached member
  const optRev = annualMembershipPrice + optimizeRevenuePerAttachedYear;
  const optTest = baselineTestCost + blendedTestsPerQuarter * a.optimizeRetestCost * 4;
  const optNicoya = nicoyaClientFeePerActive;
  const optAi = (1 + blendedTestsPerQuarter * 4) * a.aiExtractionPagesPerSample * a.aiExtractionCostPerPageUsd * a.fxUsdEur;
  const optProc = optRev * a.paymentProcessingFee;
  const optCost = optTest + optNicoya + optAi + optProc;
  const optCont = optRev - optCost;

  // Heatmap 1: LTV : CAC by CAC (rows) and Renewal (cols)
  const cacAxis = [70, 85, 100, 115, 130, 150];
  const renewalAxis = [0.4, 0.5, 0.6, 0.7, 0.8];

  const heatmapCacRenewal = cacAxis.map((cac) => {
    const values = renewalAxis.map((ren) => {
      const lt = ren < 1 ? contributionPerActiveMemberYear / (1 - ren) : 0;
      return cac > 0 ? lt / cac : 0;
    });
    return { cacRow: cac, values };
  });

  // Heatmap 2: LTV : CAC by Renewal (cols) and Attach (rows) at base CAC = 99
  const attachAxis = [0.10, 0.20, 0.30, 0.40];
  const heatmapRenewalAttach = attachAxis.map((att) => {
    const values = renewalAxis.map((ren) => {
      // Recompute contribution at attach = att
      const testsPerYr = blendedTestsPerQuarter * 4;
      const rev = annualMembershipPrice + att * (testsPerYr * a.optimizeRetestPrice);
      const costOpt = att * (testsPerYr * a.optimizeRetestCost);
      const ai = (1 + att * testsPerYr) * a.aiExtractionPagesPerSample * a.aiExtractionCostPerPageUsd * a.fxUsdEur;
      const proc = rev * a.paymentProcessingFee;
      const cost = baselineTestCost + costOpt + nicoyaClientFeePerActive + ai + proc;
      const cont = rev - cost;
      const lt = ren < 1 ? cont / (1 - ren) : 0;
      return lt / 99; // benchmarked at EUR 99
    });
    return { attachRow: att, values };
  });

  return {
    annualMembershipPrice,
    optimizeAttachRate,
    revenuePerActiveMemberYear,
    baselineTestCost,
    optimizeRetestCostPerActive,
    nicoyaClientFeePerActive,
    aiExtractionCostPerActive,
    paymentProcessingPerActive,
    totalCostPerActiveMemberYear,
    contributionPerActiveMemberYear,
    contributionMarginPct,
    expectedLifetimeYears,
    ltv,
    maxCac3x,
    year1BaselineOnly: {
      revenue: bRev,
      testCost: bTest,
      nicoyaFee: bNicoya,
      aiExtraction: bAi,
      paymentProcessing: bProc,
      totalCost: bCost,
      year1Contribution: bCont,
    },
    year1OptimizeAttached: {
      revenue: optRev,
      testCost: optTest,
      nicoyaFee: optNicoya,
      aiExtraction: optAi,
      paymentProcessing: optProc,
      totalCost: optCost,
      year1Contribution: optCont,
    },
    heatmapCacRenewal,
    heatmapRenewalAttach,
    renewalAxis,
    cacAxis,
    attachAxis,
  };
}
