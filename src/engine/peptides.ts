import { Assumptions, PeptideResult, QuarterData } from './types';

export function calcPeptides(quarters: QuarterData[], a: Assumptions): PeptideResult {
  const years = [2026, 2027, 2028, 2029, 2030, 2031];

  const productCostBase = [
    { name: 'BPC-157', costUsd: a.costBpc157 },
    { name: 'GHK-Cu', costUsd: a.costGhkCu },
    { name: 'CJC-1295', costUsd: a.costCjc1295 },
    { name: 'SEMAX', costUsd: a.costSemax },
    { name: 'DSIP', costUsd: a.costDsip },
    { name: 'Thymosin Alpha', costUsd: a.costThymosinAlpha },
    { name: 'PT-141', costUsd: a.costPt141 },
    { name: 'MOTS-C', costUsd: a.costMotsC },
    { name: 'NAD+', costUsd: a.costNadPlus },
  ];

  const averageProductCostUsd =
    productCostBase.reduce((sum, item) => sum + item.costUsd, 0) / productCostBase.length;

  const isConservative = a.peptideCase === 'conservative';
  const attachRate = isConservative ? a.conservativeAttachRate : a.managementAttachRate;

  const annualSpendEur = isConservative
    ? a.conservativeAnnualSpendEur
    : a.managementOrderPriceUsd * a.managementOrdersPerYear * a.fxUsdEur;

  const grossMarginPct = isConservative
    ? a.conservativeGrossMargin
    : 1 - averageProductCostUsd / a.managementOrderPriceUsd;

  const revenuePerActiveMember = attachRate * annualSpendEur;
  const grossProfitPerActiveMember = revenuePerActiveMember * grossMarginPct;

  const haircutFactor = Math.max(0, 1 - a.peptideRegulatoryHaircut);

  // Aggregate annual figures from quarters
  const annualRevenue = years.map(yr => {
    const qInYear = quarters.filter(q => q.year === yr);
    return qInYear.reduce((sum, q) => sum + q.peptideRevenue, 0);
  });

  const annualGrossProfit = years.map(yr => {
    const qInYear = quarters.filter(q => q.year === yr);
    return qInYear.reduce((sum, q) => sum + q.peptideGrossProfit, 0);
  });

  const annualGrossProfitAfterHaircut = annualGrossProfit.map(gp => gp * haircutFactor);

  const baseEbitda = years.map(yr => {
    const qInYear = quarters.filter(q => q.year === yr);
    return qInYear.reduce((sum, q) => sum + q.ebitda, 0);
  });

  const ebitdaWithPeptides = baseEbitda.map((eb, idx) => eb + annualGrossProfitAfterHaircut[idx]);

  return {
    selectedCase: a.peptideCase,
    attachRate,
    annualSpendEur,
    grossMarginPct,
    revenuePerActiveMember,
    grossProfitPerActiveMember,
    averageProductCostUsd,
    productCostBase,
    annualRevenue,
    annualGrossProfit,
    annualGrossProfitAfterHaircut,
    baseEbitda,
    ebitdaWithPeptides,
  };
}
