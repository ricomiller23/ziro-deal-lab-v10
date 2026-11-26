import { describe, it, expect } from 'vitest';
import { DEFAULT_ASSUMPTIONS } from '../defaults';
import { calcAll } from '../calcAll';
import { calcOverhead } from '../overhead';
import { calcUnitEconomics } from '../unitEconomics';

describe('ZIRO Deal Lab Financial Calculation Engine', () => {
  const results = calcAll(DEFAULT_ASSUMPTIONS);

  it('matches 2027 overhead run-rate before contingency exactly (EUR 406,081.44)', () => {
    const overhead = calcOverhead(DEFAULT_ASSUMPTIONS);
    expect(overhead.annual2027RunRateBeforeContingency).toBeCloseTo(406081.44, 2);
  });

  it('matches total annual overhead P&L by year to the penny', () => {
    const overhead = calcOverhead(DEFAULT_ASSUMPTIONS);
    const expected = [120428.97, 435344.66, 720431.66, 834466.46, 1062536.06, 1290605.66];
    for (let i = 0; i < expected.length; i++) {
      expect(overhead.totalOverheadPnlByYear[i]).toBeCloseTo(expected[i], 1);
    }
  });

  it('matches unit economics benchmarks exactly', () => {
    const ue = calcUnitEconomics(DEFAULT_ASSUMPTIONS);
    expect(ue.revenuePerActiveMemberYear).toBeCloseTo(436.60, 2);
    expect(ue.totalCostPerActiveMemberYear).toBeCloseTo(330.63, 2);
    expect(ue.contributionPerActiveMemberYear).toBeCloseTo(105.97, 2);
    expect(ue.contributionMarginPct).toBeCloseTo(0.2427, 2);
    expect(ue.expectedLifetimeYears).toBeCloseTo(2.5, 2);
    expect(ue.ltv).toBeCloseTo(264.93, 2);
    expect(ue.maxCac3x).toBeCloseTo(88.31, 2);
    expect(ue.year1BaselineOnly.year1Contribution).toBeCloseTo(-18.44, 2);
    expect(ue.year1OptimizeAttached.year1Contribution).toBeCloseTo(396.27, 2);
  });

  it('matches 21-quarter and annual active members', () => {
    const expectedActive = [2000, 43939.2, 161606.2, 330003.4, 531384.6, 740615.9];
    for (let i = 0; i < expectedActive.length; i++) {
      expect(results.annual[i].activeMembersYearEnd).toBeCloseTo(expectedActive[i], 0);
    }
  });

  it('matches annual revenue milestones', () => {
    const expectedRev = [516800, 13814475, 58983652, 128281557, 213635166, 304830738];
    for (let i = 0; i < expectedRev.length; i++) {
      expect(results.annual[i].totalRevenue).toBeCloseTo(expectedRev[i], 0);
    }
  });

  it('matches annual gross profit milestones', () => {
    const expectedGp = [175203, 4075640, 15862850, 33243918, 54302459, 76458501];
    for (let i = 0; i < expectedGp.length; i++) {
      expect(results.annual[i].grossProfit).toBeCloseTo(expectedGp[i], 0);
    }
  });

  it('matches annual EBITDA milestones', () => {
    const expectedEbitda = [-194194, -782353, 2883154, 10595921, 21207014, 33993236];
    for (let i = 0; i < expectedEbitda.length; i++) {
      expect(results.annual[i].ebitda).toBeCloseTo(expectedEbitda[i], 0);
    }
  });

  it('matches cumulative cash at year-end milestones', () => {
    const expectedCash = [-194194, -976547, 1906607, 12502528, 33709542, 67702778];
    for (let i = 0; i < expectedCash.length; i++) {
      expect(results.annual[i].yearEndCash).toBeCloseTo(expectedCash[i], 0);
    }
  });

  it('matches peak funding need of EUR 976,547 and first positive year 2028', () => {
    expect(results.peakFundingNeed).toBeCloseTo(976547, 0);
    expect(results.firstEbitdaPositiveYear).toBe(2028);
  });

  it('matches S1, S2, S3 scenario EBITDA outputs', () => {
    expect(results.scenarios.scenario1.ebitda2031).toBeCloseTo(1151161, 0);
    expect(results.scenarios.scenario2.ebitda2031).toBeCloseTo(4813811, 0);
    expect(results.scenarios.scenario3.ebitda2031).toBeCloseTo(10918228, 0);
  });
});
