import { Assumptions, OverheadBuildResult } from './types';

export function calcOverhead(a: Assumptions): OverheadBuildResult {
  const years = [2026, 2027, 2028, 2029, 2030, 2031];
  const monthsInPeriod = [3, 12, 12, 12, 12, 12];

  // Headcount (FTE) by function from Excel rows 8-11
  const leadership = [2, 2, 2, 2, 3, 3];
  const growthMarketing = [1, 1, 3, 3, 4, 5];
  const opsCare = [1, 1, 3, 4, 5, 6];
  const productEng = [1, 1, 2, 3, 4, 6];

  const totalHeadcount = years.map((_, i) =>
    leadership[i] + growthMarketing[i] + opsCare[i] + productEng[i]
  ); // [5, 5, 10, 12, 16, 20]

  const monthlySalaryUsd = a.monthlySalaryUsd;
  const fxUsdEur = a.fxUsdEur;
  const fxGbpEur = a.fxGbpEur;

  // Monthly salaries per function in EUR
  const monthlySalaryEur = monthlySalaryUsd * fxUsdEur;
  const leadershipCostEur = leadership.map(h => h * monthlySalaryEur);
  const growthCostEur = growthMarketing.map(h => h * monthlySalaryEur);
  const opsCostEur = opsCare.map(h => h * monthlySalaryEur);
  const engCostEur = productEng.map(h => h * monthlySalaryEur);

  const monthlyPeopleCostEur = totalHeadcount.map(h => h * monthlySalaryEur);
  const annualPeopleCostEur = monthlyPeopleCostEur.map((m, i) => m * monthsInPeriod[i]);

  // Platform and White-label app (Excel rows 23-24)
  const nicoyaPlatformBaseEur = a.nicoyaBaseFeeGbp * fxGbpEur; // 730 * 1.17 = 854.10
  const nicoyaAppFeeEur = a.nicoyaManagedAppFeeUsd * fxUsdEur; // 10000 * 0.86 = 8600.00

  // Tech stack & tools (monthly EUR) from Excel rows 27-37:
  // Attio: 1860, Brevo: 69, Google: 100, UGC: 286.38, Native.co: 171.14,
  // AI tools: 200, Hosting: 29, Accounting: 19, Social: 35, Postgres: 19
  // Notion: 19.5 per head
  const crmAttio = [1860, 1860, 1860, 1860, 1860, 1860];
  const emailBrevo = [69, 69, 69, 69, 69, 69];
  const googleWorkspace = [100, 100, 100, 100, 100, 100];
  const ugcCreative = [286.38, 286.38, 286.38, 286.38, 286.38, 286.38];
  const nativeCo = [171.14, 171.14, 171.14, 171.14, 171.14, 171.14];
  const aiTools = [200, 200, 200, 200, 200, 200];
  const hosting = [29, 29, 29, 29, 29, 29];
  const accounting = [19, 19, 19, 19, 19, 19];
  const socialTools = [35, 35, 35, 35, 35, 35];
  const postgres = [19, 19, 19, 19, 19, 19];
  const notionCost = totalHeadcount.map(h => h * a.notionCostEur);

  const techStackItemsMonthly = [
    { name: 'CRM (Attio)', monthlyEurByYear: crmAttio },
    { name: 'Email automation (Brevo)', monthlyEurByYear: emailBrevo },
    { name: 'Google Workspace', monthlyEurByYear: googleWorkspace },
    { name: 'UGC / creative subscriptions', monthlyEurByYear: ugcCreative },
    { name: 'Native.co', monthlyEurByYear: nativeCo },
    { name: 'AI tools (Claude / Gemini)', monthlyEurByYear: aiTools },
    { name: 'Hosting', monthlyEurByYear: hosting },
    { name: 'Accounting software', monthlyEurByYear: accounting },
    { name: 'Social media tools', monthlyEurByYear: socialTools },
    { name: 'Postgres database', monthlyEurByYear: postgres },
    { name: 'Notion seats', monthlyEurByYear: notionCost },
  ];

  const totalTechStackMonthlyByYear = years.map((_, i) =>
    techStackItemsMonthly.reduce((sum, item) => sum + item.monthlyEurByYear[i], 0)
  );

  // Core overhead before contingency (Excel row 39)
  const coreOverheadMonthly = years.map((_, i) =>
    monthlyPeopleCostEur[i] + nicoyaPlatformBaseEur + nicoyaAppFeeEur + totalTechStackMonthlyByYear[i]
  );

  // Contingency = contingencyPct * (people + tech stack) (Excel row 40)
  const contingencyMonthlyByYear = years.map((_, i) =>
    (monthlyPeopleCostEur[i] + totalTechStackMonthlyByYear[i]) * a.contingencyPct
  );

  // Add-ons (monthly EUR, Excel rows 47-51)
  const employerOnCosts = a.addOnsEnabled
    ? monthlyPeopleCostEur.map(p => p * a.employerOnCostsPct)
    : [0, 0, 0, 0, 0, 0];
  const clinicalGov = a.addOnsEnabled
    ? years.map(() => a.clinicalGovernanceUsdMonth * fxUsdEur)
    : [0, 0, 0, 0, 0, 0];
  const insurance = a.addOnsEnabled
    ? years.map(() => a.insuranceEurMonth)
    : [0, 0, 0, 0, 0, 0];
  const legal = a.addOnsEnabled
    ? years.map(() => a.legalRetainerEurMonth)
    : [0, 0, 0, 0, 0, 0];

  const addOnsMonthlyByYear = years.map((_, i) =>
    employerOnCosts[i] + clinicalGov[i] + insurance[i] + legal[i]
  );

  // One-off launch costs (2026 only, Excel row 57: branding + trademarks + app setup + sdk setup)
  const oneOffs2026Eur =
    (a.brandingSetupUsd + a.trademarksSetupUsd + a.nicoyaAppSetupUsd + a.nicoyaSdkSetupUsd) * fxUsdEur;

  // Total Overhead in P&L by year (Excel row 58)
  const totalOverheadPnlByYear = years.map((_, i) => {
    const monthlyTotal =
      monthlyPeopleCostEur[i] +
      nicoyaPlatformBaseEur +
      nicoyaAppFeeEur +
      totalTechStackMonthlyByYear[i] +
      contingencyMonthlyByYear[i] +
      addOnsMonthlyByYear[i];
    const annualRun = monthlyTotal * monthsInPeriod[i];
    return i === 0 ? annualRun + oneOffs2026Eur : annualRun;
  });

  const coreOverheadBeforeContingencyMonthly2027 = coreOverheadMonthly[1]; // 2027
  const annual2027RunRateBeforeContingency = coreOverheadBeforeContingencyMonthly2027 * 12;

  return {
    years,
    headcountByYear: {
      leadership,
      growthMarketing,
      opsCare,
      productEng,
      total: totalHeadcount,
    },
    monthlySalaryUsd,
    monthlyPeopleCostEur,
    annualPeopleCostEur,
    nicoyaPlatformBaseEur,
    nicoyaAppFeeEur,
    techStackItemsMonthly,
    totalTechStackMonthlyByYear,
    contingencyMonthlyByYear,
    oneOffs2026Eur,
    addOnsMonthlyByYear,
    totalOverheadPnlByYear,
    coreOverheadBeforeContingencyMonthly2027,
    annual2027RunRateBeforeContingency,
  };
}
