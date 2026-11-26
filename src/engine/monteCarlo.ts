import { Assumptions, MonteCarloResult } from './types';
import { calcQuarterly } from './quarterly';
import { calcAnnual } from './annual';

// Box-Muller transform for normal distribution
function randomNormal(mean: number, std: number, minVal?: number, maxVal?: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  let val = mean + num * std;
  if (minVal !== undefined && val < minVal) val = minVal;
  if (maxVal !== undefined && val > maxVal) val = maxVal;
  return val;
}

export function runMonteCarloSim(
  baseAssumptions: Assumptions,
  iterations = 10000
): MonteCarloResult {
  const peakFundingValues: number[] = new Array(iterations);
  const ebitda2031Values: number[] = new Array(iterations);

  let countPositive2028 = 0;
  let countPositive2029 = 0;
  let countPositive2030 = 0;
  let countPositive2031 = 0;

  const raiseEur = baseAssumptions.raiseAmountUsd * (1 / 1.08);
  let countFundingExceedsRaise = 0;

  for (let i = 0; i < iterations; i++) {
    // Perturb key sensitive variables
    const perturbedRenewal = randomNormal(baseAssumptions.annualRenewalRate, 0.05, 0.40, 0.80);
    const perturbedAttach = randomNormal(baseAssumptions.optimizeAttachRate, 0.04, 0.15, 0.50);
    const perturbedCacMult = randomNormal(1.0, 0.12, 0.70, 1.60);
    const perturbedKitCost = randomNormal(baseAssumptions.baselineTestCost, 5.0, 70, 135);

    const perturbedAssumptions: Assumptions = {
      ...baseAssumptions,
      annualRenewalRate: perturbedRenewal,
      optimizeAttachRate: perturbedAttach,
      baselineTestCost: perturbedKitCost,
      paidSocialCpm: baseAssumptions.paidSocialCpm * perturbedCacMult,
      paidSearchCpc: baseAssumptions.paidSearchCpc * perturbedCacMult,
    };

    const quarters = calcQuarterly(perturbedAssumptions);
    const annual = calcAnnual(quarters, perturbedAssumptions);

    const minCash = Math.min(...quarters.map(q => q.cumulativeCash));
    const peakFunding = minCash < 0 ? Math.abs(minCash) : 0;
    const ebitda2031 = annual[5]?.ebitda || 0;

    peakFundingValues[i] = peakFunding;
    ebitda2031Values[i] = ebitda2031;

    if (peakFunding > raiseEur) countFundingExceedsRaise++;

    if (annual[2]?.ebitda > 0) countPositive2028++;
    if (annual[3]?.ebitda > 0) countPositive2029++;
    if (annual[4]?.ebitda > 0) countPositive2030++;
    if (annual[5]?.ebitda > 0) countPositive2031++;
  }

  // Sort arrays for percentiles
  peakFundingValues.sort((a, b) => a - b);
  ebitda2031Values.sort((a, b) => a - b);

  const getPercentile = (arr: number[], pct: number) => {
    const idx = Math.floor((pct / 100) * arr.length);
    return arr[Math.min(idx, arr.length - 1)];
  };

  const sumPeak = peakFundingValues.reduce((a, b) => a + b, 0);
  const meanPeakFunding = sumPeak / iterations;
  const medianPeakFunding = getPercentile(peakFundingValues, 50);
  const p10PeakFunding = getPercentile(peakFundingValues, 10);
  const p50PeakFunding = medianPeakFunding;
  const p90PeakFunding = getPercentile(peakFundingValues, 90);

  const sumEbitda = ebitda2031Values.reduce((a, b) => a + b, 0);
  const meanEbitda2031 = sumEbitda / iterations;
  const medianEbitda2031 = getPercentile(ebitda2031Values, 50);
  const p10Ebitda2031 = getPercentile(ebitda2031Values, 10);
  const p50Ebitda2031 = medianEbitda2031;
  const p90Ebitda2031 = getPercentile(ebitda2031Values, 90);

  // Funding Histogram bins
  const fundingEdges = [
    { label: '< €0.8M', from: 0, to: 800000 },
    { label: '€0.8M – €1.0M', from: 800000, to: 1000000 },
    { label: '€1.0M – €1.2M', from: 1000000, to: 1200000 },
    { label: '€1.2M – €1.5M', from: 1200000, to: 1500000 },
    { label: '€1.5M – €2.0M', from: 1500000, to: 2000000 },
    { label: '> €2.0M', from: 2000000, to: 10000000 }
  ];

  const fundingHistogram = fundingEdges.map(edge => ({
    binLabel: edge.label,
    binFrom: edge.from,
    binTo: edge.to,
    count: peakFundingValues.filter(v => v >= edge.from && v < edge.to).length
  }));

  // EBITDA Histogram bins
  const ebitdaEdges = [
    { label: '< €20M', from: -10000000, to: 20000000 },
    { label: '€20M – €30M', from: 20000000, to: 30000000 },
    { label: '€30M – €35M', from: 30000000, to: 35000000 },
    { label: '€35M – €40M', from: 35000000, to: 40000000 },
    { label: '> €40M', from: 40000000, to: 100000000 }
  ];

  const ebitdaHistogram = ebitdaEdges.map(edge => ({
    binLabel: edge.label,
    binFrom: edge.from,
    binTo: edge.to,
    count: ebitda2031Values.filter(v => v >= edge.from && v < edge.to).length
  }));

  return {
    trialsCount: iterations,
    meanPeakFunding: Math.round(meanPeakFunding),
    medianPeakFunding: Math.round(medianPeakFunding),
    p10PeakFunding: Math.round(p10PeakFunding),
    p50PeakFunding: Math.round(p50PeakFunding),
    p90PeakFunding: Math.round(p90PeakFunding),
    probFundingExceedsRaise: (countFundingExceedsRaise / iterations) * 100,

    meanEbitda2031: Math.round(meanEbitda2031),
    medianEbitda2031: Math.round(medianEbitda2031),
    p10Ebitda2031: Math.round(p10Ebitda2031),
    p50Ebitda2031: Math.round(p50Ebitda2031),
    p90Ebitda2031: Math.round(p90Ebitda2031),

    probPositiveBy2028: (countPositive2028 / iterations) * 100,
    probPositiveBy2029: (countPositive2029 / iterations) * 100,
    probPositiveBy2030: (countPositive2030 / iterations) * 100,
    probPositiveBy2031: (countPositive2031 / iterations) * 100,

    fundingHistogram,
    ebitdaHistogram
  };
}
