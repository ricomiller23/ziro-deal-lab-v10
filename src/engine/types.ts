export type CaseId = 'mgmt' | 's1' | 's2' | 's3' | 'custom';
export type CacMethod = 'bottomUp' | 'flat99';
export type PeptideCase = 'conservative' | 'management';
export type NoteDraftId = 'final' | 'form081226';

export type StatusBadge = 'CONFIRMED' | 'ASSUMPTION' | 'TARGET' | 'TBC' | 'REFERENCE';

export interface InputMetadata {
  key: string;
  label: string;
  unit: string;
  category: 'general' | 'pricing' | 'cogs' | 'members' | 'nicoya' | 'overhead' | 'cac' | 'peptides' | 'raise';
  min: number;
  max: number;
  step: number;
  sourceNote: string;
  statusBadge: StatusBadge;
  isYellowAlert: boolean; // "Validate with real data" marker
}

export interface Assumptions {
  // Global Case
  activeCase: CaseId;
  cacMethod: CacMethod; // bottomUp vs flat99
  customPenetration: number; // e.g. 0.0075 for 0.75%

  // General
  fxGbpEur: number; // 1.17
  fxUsdEur: number; // 0.86
  paymentProcessingFee: number; // 0.02
  openingCash: number; // 0
  ukIrelandPopulation: number; // 73,000,000

  // Pricing & Product
  annualMembershipPrice: number; // 199
  optimizeRetestPrice: number; // 99
  monthlyOptimizeShare: number; // 0.50

  // Cost of Goods
  baselineTestCost: number; // 115
  optimizeRetestCost: number; // 45
  aiExtractionPagesPerSample: number; // 3
  aiExtractionCostPerPageUsd: number; // 0.07

  // Membership & Retention
  launchQuarterMembers: number; // 2000
  annualRenewalRate: number; // 0.60
  optimizeAttachRate: number; // 0.30

  // QoQ Growth in New Memberships by Year (2026..2031)
  qoqGrowth2026: number; // 0 (launch only)
  qoqGrowth2027: number; // 0.80
  qoqGrowth2028: number; // 0.20
  qoqGrowth2029: number; // 0.12
  qoqGrowth2030: number; // 0.08
  qoqGrowth2031: number; // 0.05

  // Nicoya Premier
  nicoyaBaseFeeGbp: number; // 730
  nicoyaIncludedClients: number; // 100
  nicoyaPerClientFeeGbp: number; // 7
  nicoyaManagedAppFeeUsd: number; // 10000
  nicoyaAppSetupUsd: number; // 5000
  nicoyaSdkSetupUsd: number; // 2500

  // Overhead drivers
  monthlySalaryUsd: number; // 5000
  notionCostEur: number; // 19.50
  contingencyPct: number; // 0.10
  brandingSetupUsd: number; // 980
  trademarksSetupUsd: number; // 5000

  // Overhead Add-ons (OFF by default)
  addOnsEnabled: boolean;
  employerOnCostsPct: number; // 0.15
  clinicalGovernanceUsdMonth: number; // 3000
  insuranceEurMonth: number; // 1200
  legalRetainerEurMonth: number; // 2500

  // CAC Channel Economics
  paidSocialCpm: number; // 12
  paidSocialCtr: number; // 0.009
  paidSocialCvr: number; // 0.011

  paidSearchCpc: number; // 2.80
  paidSearchCvr: number; // 0.035

  creatorFee: number; // 800
  creatorAttributedMembers: number; // 10

  affiliateCommissionPct: number; // 0.20
  affiliateNetworkFeePct: number; // 0.10

  referralReferrerCredit: number; // 20
  referralNewMemberDiscount: number; // 20

  organicVariableCost: number; // 6.0
  b2bSalesCommission: number; // 45.0
  creativeProductionPerMember: number; // 5.0

  // Paid Channel Index (2026..2031)
  paidIndex: number[]; // [1.3, 1.1, 1.0, 1.1, 1.2, 1.3]

  // Channel Mix by Year (% for 7 channels across 6 years)
  mixPaidSocial: number[];
  mixPaidSearch: number[];
  mixCreator: number[];
  mixAffiliate: number[];
  mixReferral: number[];
  mixOrganic: number[];
  mixB2B: number[];

  // Peptide Memo Inputs
  peptideCase: PeptideCase; // 'conservative' | 'management'
  conservativeAttachRate: number; // 0.15
  conservativeAnnualSpendEur: number; // 600
  conservativeGrossMargin: number; // 0.45

  managementAttachRate: number; // 0.50
  managementOrderPriceUsd: number; // 100
  managementOrdersPerYear: number; // 4
  peptideRegulatoryHaircut: number; // 0 to 1 (0 = none, 1 = 100% removed)

  // Peptide Product Costs (USD)
  costBpc157: number; // 28.44
  costGhkCu: number; // 22.60
  costCjc1295: number; // 27.80
  costSemax: number; // 26.90
  costDsip: number; // 18.90
  costThymosinAlpha: number; // 29.44
  costPt141: number; // 28.30
  costMotsC: number; // 27.66
  costNadPlus: number; // 18.90

  // Raise & Note Inputs
  raiseAmountUsd: number; // 1,000,000
  activeNoteDraft: NoteDraftId; // 'final' | 'form081226'
  unverifiedMemoClaimEnabled: boolean; // toggle for next round / IP security floor

  // Dilution inputs
  preSplitSharePriceUsd: number; // 0.0004
  reverseSplitRatio: number; // 20
  preSplitSharesOutstanding: number; // 90,000,000
  noteConversionDiscount: number; // 0.20 or 0.50
}

export interface QuarterData {
  quarterIndex: number; // 0..20
  quarterLabel: string; // "Q4 2026", "Q1 2027", ..., "Q4 2031"
  year: number; // 2026..2031
  quarterOfYear: number; // 1..4

  // Members
  newMembers: number;
  renewals: number;
  totalTransacted: number;
  churn: number;
  activeMembers: number;
  optimizeAttached: number;

  // Revenue
  baselineRevenue: number;
  optimizeRevenue: number;
  totalRevenue: number;

  // Cost of Sales
  baselineTestCost: number;
  optimizeRetestCost: number;
  nicoyaClientFee: number;
  nicoyaAiExtractionCost: number;
  paymentProcessing: number;
  totalCostOfSales: number;

  // Profitability
  grossProfit: number;
  grossMarginPct: number;

  // Operating Expenses
  marketingSpend: number;
  programmeCac: number;
  peopleOpex: number;
  techStackOpex: number;
  nicoyaBaseOpex: number;
  nicoyaAppOpex: number;
  oneOffLaunchCosts: number;
  contingencyOpex: number;
  addOnsOpex: number;
  totalOpex: number;

  // Bottom Line
  ebitda: number;
  ebitdaMarginPct: number;
  cumulativeCash: number;

  // Peptide Memo
  peptideRevenue: number;
  peptideGrossProfit: number;
  ebitdaWithPeptide: number;
}

export interface AnnualData {
  year: number;
  monthsInPeriod: number;

  // Members
  activeMembersYearEnd: number;
  newMembersSold: number;
  renewals: number;
  churn: number;

  // Financials
  totalRevenue: number;
  baselineRevenue: number;
  optimizeRevenue: number;
  grossProfit: number;
  grossMarginPct: number;

  marketingSpend: number;
  overheadExclMarketing: number;
  ebitda: number;
  ebitdaMarginPct: number;
  yearEndCash: number;
  lowestCashInYear: number;

  // CAC & Unit Economics
  programmeCac: number;
  fullyLoadedCac: number;
  ltvCacProgramme: number;
  ltvCacFullyLoaded: number;
  cacPaybackMonths: number;
  maxCac3x: number;

  // Peptide Memo
  peptideRevenue: number;
  peptideGrossProfit: number;
  ebitdaWithPeptide: number;
}

export interface ChannelEconomics {
  name: string;
  baseCac: number;
  cpm?: number;
  ctr?: number;
  cvr?: number;
  cpc?: number;
}

export interface CacBuildResult {
  channels: ChannelEconomics[];
  paidCostIndex: number[];
  mixByYear: {
    year: number;
    mix: { [channel: string]: number };
    totalMix: number;
    mixCheckOk: boolean;
  }[];
  cacByChannelByYear: { [channel: string]: number[] };
  spendByChannelByYear: { [channel: string]: number[] };
  totalSpendByYear: number[];
  programmeCacByYear: number[];
  fullyLoadedCacByYear: number[];
  growthTeamToolsByYear: number[];
}

export interface OverheadBuildResult {
  years: number[];
  headcountByYear: {
    leadership: number[];
    growthMarketing: number[];
    opsCare: number[];
    productEng: number[];
    total: number[];
  };
  monthlySalaryUsd: number;
  monthlyPeopleCostEur: number[];
  annualPeopleCostEur: number[];
  nicoyaPlatformBaseEur: number;
  nicoyaAppFeeEur: number;
  techStackItemsMonthly: { name: string; monthlyEurByYear: number[] }[];
  totalTechStackMonthlyByYear: number[];
  contingencyMonthlyByYear: number[];
  oneOffs2026Eur: number;
  addOnsMonthlyByYear: number[];
  totalOverheadPnlByYear: number[];
  coreOverheadBeforeContingencyMonthly2027: number;
  annual2027RunRateBeforeContingency: number;
}

export interface UnitEconomicsResult {
  annualMembershipPrice: number;
  optimizeAttachRate: number;
  revenuePerActiveMemberYear: number;

  baselineTestCost: number;
  optimizeRetestCostPerActive: number;
  nicoyaClientFeePerActive: number;
  aiExtractionCostPerActive: number;
  paymentProcessingPerActive: number;
  totalCostPerActiveMemberYear: number;

  contributionPerActiveMemberYear: number;
  contributionMarginPct: number;

  expectedLifetimeYears: number; // 2.5
  ltv: number; // 264.93
  maxCac3x: number; // 88.31

  // Waterfall comparison: Baseline only vs Optimize-attached
  year1BaselineOnly: {
    revenue: number;
    testCost: number;
    nicoyaFee: number;
    aiExtraction: number;
    paymentProcessing: number;
    totalCost: number;
    year1Contribution: number;
  };
  year1OptimizeAttached: {
    revenue: number;
    testCost: number;
    nicoyaFee: number;
    aiExtraction: number;
    paymentProcessing: number;
    totalCost: number;
    year1Contribution: number;
  };

  // Heatmaps
  heatmapCacRenewal: {
    cacRow: number;
    values: number[]; // across renewal rates [0.4, 0.5, 0.6, 0.7, 0.8]
  }[];
  heatmapRenewalAttach: {
    attachRow: number; // [0.1, 0.2, 0.3, 0.4]
    values: number[]; // across renewal rates [0.4, 0.5, 0.6, 0.7, 0.8]
  }[];
  renewalAxis: number[]; // [0.4, 0.5, 0.6, 0.7, 0.8]
  cacAxis: number[]; // [70, 85, 100, 115, 130, 150]
  attachAxis: number[]; // [0.10, 0.20, 0.30, 0.40]
}

export interface ScenarioRunResult {
  scenarioId: CaseId;
  name: string;
  penetrationCeilingPct: number;
  ceilingMembers: number;
  activeMembersByYear: number[];
  averageMembersByYear: number[];
  newMembersByYear: number[];
  revenueByYear: number[];
  costOfSalesByYear: number[];
  grossProfitByYear: number[];
  marketingByYear: number[];
  overheadByYear: number[];
  ebitdaByYear: number[];
  cumulativeCashByYear: number[];

  // 2031 KPI Summaries
  active2031: number;
  revenue2031: number;
  grossProfit2031: number;
  grossMarginPct2031: number;
  marketing2031: number;
  overhead2031: number;
  ebitda2031: number;
  ebitdaMarginPct2031: number;
  cumulativeEbitda: number;
  peakFundingNeed: number;
  firstEbitdaPositiveYear: string | number;
  penetrationPct2031: number;
}

export interface ScenariosResult {
  managementCase: ScenarioRunResult;
  scenario1: ScenarioRunResult;
  scenario2: ScenarioRunResult;
  scenario3: ScenarioRunResult;
  customScenario: ScenarioRunResult;
  heatmapPenetrationAttach: {
    penetrationRow: string;
    penetrationPct: number;
    values: number[]; // across attach rates [0.10, 0.20, 0.30, 0.40]
  }[];
  tornadoData: {
    lever: string;
    lowEbitda: number;
    highEbitda: number;
    lowFunding: number;
    highFunding: number;
    swingEbitda: number;
  }[];
}

export interface PeptideResult {
  selectedCase: PeptideCase;
  attachRate: number;
  annualSpendEur: number;
  grossMarginPct: number;
  revenuePerActiveMember: number;
  grossProfitPerActiveMember: number;
  averageProductCostUsd: number;
  productCostBase: { name: string; costUsd: number }[];

  annualRevenue: number[];
  annualGrossProfit: number[];
  annualGrossProfitAfterHaircut: number[];
  baseEbitda: number[];
  ebitdaWithPeptides: number[];
}

export interface NoteDraftTerms {
  id: NoteDraftId;
  name: string;
  principalAmountUsd: number;
  maturityMonths: number;
  interestRatePct: number; // 20% or 100%
  conversionDiscountPct: number; // 20% or 50%
  beneficialOwnershipCapPct: number; // 4.99%
  lockUpDays: number; // 60
  leakOutLowVolumePct: number; // 10%
  leakOutHighVolumePct: number; // 20%
  dailyDeliveryPenaltyUsd: number; // 100
  defaultInterestRatePct: number; // 24%
  mandatoryDefaultMultiple: number; // 150%
  governingLaw: string; // Utah
}

export interface DilutionTranche {
  trancheNumber: number;
  sharesRequested: number;
  capLimitShares: number;
  sharesIssued: number;
  runningSharesOutstanding: number;
  noteholderOwnershipPct: number;
}

export interface RaiseResult {
  raiseAmountUsd: number;
  raiseAmountEur: number;
  peakFundingNeedEur: number;
  fundingSurplusDeficitEur: number;
  isFundingCovered: boolean;
  runwayMonths: number;

  activeDraft: NoteDraftTerms;
  finalDraftTerms: NoteDraftTerms;
  form081226Terms: NoteDraftTerms;

  maturityCashPayoffUsd: number;
  impliedCashMultiple: number;

  // Dilution Mechanics
  preSplitSharePriceUsd: number;
  reverseSplitRatio: number;
  postSplitImpliedPriceUsd: number;
  preSplitSharesOutstanding: number;
  postSplitSharesOutstanding: number;
  conversionPriceUsd: number;
  totalSharesIssuedAtConversion: number;
  postConversionTotalShares: number;
  uncappedOwnershipPct: number;
  beneficialOwnershipCapPct: number;

  // Staged conversion mechanics under 4.99% blocker
  stagedConversionsCount: number;
  stagedTranches: DilutionTranche[];

  unverifiedMemoClaimEnabled: boolean;
}

export interface ReconciliationConflict {
  id: string;
  topic: string;
  sourceA: { name: string; claim: string };
  sourceB: { name: string; claim: string };
  engineResolution: string;
  hasToggle: boolean;
  toggleKey?: keyof Assumptions;
}

export interface MonteCarloTrial {
  trialIndex: number;
  drawRenewal: number;
  drawAttach: number;
  drawCacMult: number;
  drawGrowthMult: number;
  drawPenetration: number;
  peakFundingNeed: number;
  ebitda2031: number;
  firstEbitdaPositiveYear: number;
}

export interface MonteCarloResult {
  trialsCount: number;
  meanPeakFunding: number;
  medianPeakFunding: number;
  p10PeakFunding: number;
  p50PeakFunding: number;
  p90PeakFunding: number;
  probFundingExceedsRaise: number;

  meanEbitda2031: number;
  medianEbitda2031: number;
  p10Ebitda2031: number;
  p50Ebitda2031: number;
  p90Ebitda2031: number;

  probPositiveBy2028: number;
  probPositiveBy2029: number;
  probPositiveBy2030: number;
  probPositiveBy2031: number;

  fundingHistogram: { binLabel: string; binFrom: number; binTo: number; count: number }[];
  ebitdaHistogram: { binLabel: string; binFrom: number; binTo: number; count: number }[];
}

export interface EngineResults {
  caseId: CaseId;
  quarterly: QuarterData[];
  annual: AnnualData[];
  unitEconomics: UnitEconomicsResult;
  cacBuild: CacBuildResult;
  overheadBuild: OverheadBuildResult;
  scenarios: ScenariosResult;
  peptides: PeptideResult;
  raise: RaiseResult;
  reconciliation: ReconciliationConflict[];
  monteCarlo: MonteCarloResult;

  // Headline Cockpit metrics for active case
  activeMembers2031: number;
  revenue2031: number;
  ebitda2031: number;
  grossProfit2031: number;
  grossMargin2031: number;
  peakFundingNeed: number;
  firstEbitdaPositiveYear: string | number;
  fullyLoadedLtvCac2027: number;
  populationPenetrationPct2031: number;
  plainEnglishTakeaway: string;
}
