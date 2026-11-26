import { Assumptions, EngineResults } from '../engine/types';

export function exportToJson(assumptions: Assumptions, results: EngineResults): void {
  const data = {
    exportedAt: new Date().toISOString(),
    title: 'ZIRO Deal Lab — Financial Model State',
    assumptions,
    resultsSummary: {
      case: results.caseId,
      activeMembers2031: results.activeMembers2031,
      revenue2031: results.revenue2031,
      ebitda2031: results.ebitda2031,
      peakFundingNeed: results.peakFundingNeed,
      firstEbitdaPositiveYear: results.firstEbitdaPositiveYear,
    },
    annualRollup: results.annual,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ziro_deal_lab_${results.caseId}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAnnualCsv(results: EngineResults): void {
  const headers = [
    'Year',
    'Months',
    'Active Members Year End',
    'New Members Sold',
    'Renewals',
    'Churn',
    'Total Revenue (EUR)',
    'Gross Profit (EUR)',
    'Gross Margin %',
    'Marketing Spend (EUR)',
    'Overhead Excl Marketing (EUR)',
    'EBITDA (EUR)',
    'EBITDA Margin %',
    'Year End Cash (EUR)',
    'Lowest Cash In Year (EUR)',
    'Programme CAC (EUR)',
    'Fully Loaded CAC (EUR)',
    'LTV : CAC Fully Loaded',
  ];

  const rows = results.annual.map((y) => [
    y.year,
    y.monthsInPeriod,
    Math.round(y.activeMembersYearEnd),
    Math.round(y.newMembersSold),
    Math.round(y.renewals),
    Math.round(y.churn),
    Math.round(y.totalRevenue),
    Math.round(y.grossProfit),
    (y.grossMarginPct * 100).toFixed(2) + '%',
    Math.round(y.marketingSpend),
    Math.round(y.overheadExclMarketing),
    Math.round(y.ebitda),
    (y.ebitdaMarginPct * 100).toFixed(2) + '%',
    Math.round(y.yearEndCash),
    Math.round(y.lowestCashInYear),
    y.programmeCac.toFixed(2),
    y.fullyLoadedCac.toFixed(2),
    y.ltvCacFullyLoaded.toFixed(2) + 'x',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ziro_annual_pnl_${results.caseId}_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateShareableUrl(assumptions: Assumptions): string {
  const jsonStr = JSON.stringify(assumptions);
  const b64 = btoa(encodeURIComponent(jsonStr));
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#model=${b64}`;
}
