import { Assumptions, CacBuildResult, ChannelEconomics } from './types';
import { calcOverhead } from './overhead';

export function calcCac(a: Assumptions): CacBuildResult {
  const years = [2026, 2027, 2028, 2029, 2030, 2031];
  const monthsInPeriod = [3, 12, 12, 12, 12, 12];

  // A. Channel Economics (Base CAC)
  const paidSocialCpc = a.paidSocialCpm / 1000 / a.paidSocialCtr;
  const paidSocialBaseCac = paidSocialCpc / a.paidSocialCvr;

  const paidSearchBaseCac = a.paidSearchCpc / a.paidSearchCvr;

  const creatorBaseCac = (a.creatorFee + a.baselineTestCost) / a.creatorAttributedMembers;

  const affiliateBaseCac = a.annualMembershipPrice * a.affiliateCommissionPct * (1 + a.affiliateNetworkFeePct);

  const referralBaseCac = a.referralReferrerCredit + a.referralNewMemberDiscount;

  const organicBaseCac = a.organicVariableCost;

  const b2bBaseCac = a.b2bSalesCommission;

  const channels: ChannelEconomics[] = [
    { name: 'Paid social', baseCac: paidSocialBaseCac, cpm: a.paidSocialCpm, ctr: a.paidSocialCtr, cvr: a.paidSocialCvr, cpc: paidSocialCpc },
    { name: 'Paid search', baseCac: paidSearchBaseCac, cpc: a.paidSearchCpc, cvr: a.paidSearchCvr },
    { name: 'Creator / UGC', baseCac: creatorBaseCac },
    { name: 'Affiliates & partnerships', baseCac: affiliateBaseCac },
    { name: 'Member referral', baseCac: referralBaseCac },
    { name: 'Organic', baseCac: organicBaseCac },
    { name: 'B2B / corporate', baseCac: b2bBaseCac },
  ];

  const paidCostIndex = a.paidIndex;

  // Channel CAC by year
  const cacByChannelByYear: { [channel: string]: number[] } = {
    'Paid social': years.map((_, i) => paidSocialBaseCac * paidCostIndex[i]),
    'Paid search': years.map((_, i) => paidSearchBaseCac * paidCostIndex[i]),
    'Creator / UGC': years.map((_, i) => creatorBaseCac * paidCostIndex[i]),
    'Affiliates & partnerships': years.map(() => affiliateBaseCac),
    'Member referral': years.map(() => referralBaseCac),
    'Organic': years.map(() => organicBaseCac),
    'B2B / corporate': years.map(() => b2bBaseCac),
  };

  const channelNames = [
    'Paid social',
    'Paid search',
    'Creator / UGC',
    'Affiliates & partnerships',
    'Member referral',
    'Organic',
    'B2B / corporate',
  ];

  const mixByYear = years.map((yr, i) => {
    const mix: { [channel: string]: number } = {
      'Paid social': a.mixPaidSocial[i],
      'Paid search': a.mixPaidSearch[i],
      'Creator / UGC': a.mixCreator[i],
      'Affiliates & partnerships': a.mixAffiliate[i],
      'Member referral': a.mixReferral[i],
      'Organic': a.mixOrganic[i],
      'B2B / corporate': a.mixB2B[i],
    };
    const totalMix = Object.values(mix).reduce((sum, val) => sum + val, 0);
    const mixCheckOk = Math.abs(totalMix - 1.0) < 0.0001;
    return { year: yr, mix, totalMix, mixCheckOk };
  });

  // Blended channel CAC & Programme CAC
  const blendedChannelCac = years.map((_, i) => {
    return channelNames.reduce((sum, ch) => {
      const chMix = mixByYear[i].mix[ch];
      const chCac = cacByChannelByYear[ch][i];
      return sum + chMix * chCac;
    }, 0);
  });

  const programmeCacByYear = blendedChannelCac.map(
    b => b + a.creativeProductionPerMember
  );

  // Growth team + acquisition tools from Overhead
  // R72 = (GrowthSalary + HubSpot + Figma + GitHub + Mixpanel) * monthsInPeriod
  const ovh = calcOverhead(a);
  const monthlySalaryEur = a.monthlySalaryUsd * a.fxUsdEur;

  const growthTeamToolsByYear = years.map((_, i) => {
    const growthSalary = ovh.headcountByYear.growthMarketing[i] * monthlySalaryEur;
    const hubspot = 450 <= 0 ? 0 : [450, 450, 800, 1200, 1500, 1500][i];
    const figma = 70;
    const github = [40, 40, 80, 80, 120, 120][i];
    const mixpanel = [100, 100, 250, 400, 500, 600][i];
    const monthlySum = growthSalary + hubspot + figma + github + mixpanel;
    return monthlySum * monthsInPeriod[i];
  });

  return {
    channels,
    paidCostIndex,
    mixByYear,
    cacByChannelByYear,
    spendByChannelByYear: {}, // populated after new members are known
    totalSpendByYear: [],
    programmeCacByYear,
    fullyLoadedCacByYear: [], // populated with new members
    growthTeamToolsByYear,
  };
}
