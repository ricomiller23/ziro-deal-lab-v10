import { Assumptions, RaiseResult, NoteDraftTerms, DilutionTranche } from './types';

export const FINAL_DRAFT_TERMS: NoteDraftTerms = {
  id: 'final',
  name: 'ZIRO_Convertible_Note_Final.docx (Execution Version)',
  principalAmountUsd: 500000,
  maturityMonths: 12,
  interestRatePct: 20, // 20% simple interest
  conversionDiscountPct: 20, // 20% discount
  beneficialOwnershipCapPct: 4.99,
  lockUpDays: 60,
  leakOutLowVolumePct: 10,
  leakOutHighVolumePct: 20,
  dailyDeliveryPenaltyUsd: 100,
  defaultInterestRatePct: 24,
  mandatoryDefaultMultiple: 150,
  governingLaw: 'Utah'
};

export const FORM_081226_TERMS: NoteDraftTerms = {
  id: 'form081226',
  name: 'Convertible Note Form 08 12 26.docx (August Term Sheet)',
  principalAmountUsd: 500000,
  maturityMonths: 12,
  interestRatePct: 100, // 100% total return
  conversionDiscountPct: 50, // 50% discount
  beneficialOwnershipCapPct: 4.99,
  lockUpDays: 60,
  leakOutLowVolumePct: 10,
  leakOutHighVolumePct: 20,
  dailyDeliveryPenaltyUsd: 100,
  defaultInterestRatePct: 24,
  mandatoryDefaultMultiple: 150,
  governingLaw: 'Utah'
};

export function calculateRaise(
  assumptions: Assumptions,
  peakFundingNeedEur: number,
  quartersBurn: number[]
): RaiseResult {
  const raiseAmountUsd = assumptions.raiseAmountUsd;
  const raiseAmountEur = raiseAmountUsd * (1 / 1.08); // EUR equivalent at 1.08 EUR/USD
  const activeDraft = assumptions.activeNoteDraft === 'form081226' ? FORM_081226_TERMS : FINAL_DRAFT_TERMS;

  const fundingSurplusDeficitEur = raiseAmountEur - peakFundingNeedEur;
  const isFundingCovered = raiseAmountEur >= peakFundingNeedEur;

  // Runway estimation
  let cumulativeCash = raiseAmountEur;
  let runwayMonths = 21 * 3;
  for (let i = 0; i < quartersBurn.length; i++) {
    cumulativeCash += quartersBurn[i];
    if (cumulativeCash < 0) {
      const prior = cumulativeCash - quartersBurn[i];
      const frac = prior > 0 && quartersBurn[i] < 0 ? prior / Math.abs(quartersBurn[i]) : 0;
      runwayMonths = Math.round((i * 3) + frac * 3);
      break;
    }
  }

  // Cash payoff at maturity
  const interestDueUsd = raiseAmountUsd * (activeDraft.interestRatePct / 100);
  const maturityCashPayoffUsd = raiseAmountUsd + interestDueUsd;
  const impliedCashMultiple = maturityCashPayoffUsd / raiseAmountUsd;

  // Stock and Dilution Mechanics
  const preSplitSharePriceUsd = assumptions.preSplitSharePriceUsd;
  const reverseSplitRatio = assumptions.reverseSplitRatio;
  const postSplitImpliedPriceUsd = preSplitSharePriceUsd * reverseSplitRatio;
  const preSplitSharesOutstanding = assumptions.preSplitSharesOutstanding;
  const postSplitSharesOutstanding = Math.max(1, Math.round(preSplitSharesOutstanding / reverseSplitRatio));

  const conversionDiscount = activeDraft.conversionDiscountPct / 100;
  // Conversion price post-split
  const conversionPriceUsd = Math.max(0.000001, postSplitImpliedPriceUsd * (1 - conversionDiscount));
  const totalSharesIssuedAtConversion = Math.round(raiseAmountUsd / conversionPriceUsd);
  const postConversionTotalShares = postSplitSharesOutstanding + totalSharesIssuedAtConversion;
  const uncappedOwnershipPct = (totalSharesIssuedAtConversion / postConversionTotalShares) * 100;

  // Staged conversion tranches under 4.99% blocker
  const stagedTranches: DilutionTranche[] = [];
  const capPct = activeDraft.beneficialOwnershipCapPct / 100;
  let remainingSharesToConvert = totalSharesIssuedAtConversion;
  let currentSharesOutstanding = postSplitSharesOutstanding;
  let trancheIndex = 1;

  while (remainingSharesToConvert > 0 && trancheIndex <= 20) {
    const maxAllowedShares = (capPct * currentSharesOutstanding) / (1 - capPct);
    const sharesInThisTranche = Math.min(remainingSharesToConvert, maxAllowedShares);

    remainingSharesToConvert -= sharesInThisTranche;
    currentSharesOutstanding += sharesInThisTranche;

    stagedTranches.push({
      trancheNumber: trancheIndex,
      sharesRequested: Math.round(sharesInThisTranche),
      capLimitShares: Math.round(maxAllowedShares),
      sharesIssued: Math.round(sharesInThisTranche),
      runningSharesOutstanding: Math.round(currentSharesOutstanding),
      noteholderOwnershipPct: (sharesInThisTranche / currentSharesOutstanding) * 100
    });

    trancheIndex++;
  }

  return {
    raiseAmountUsd,
    raiseAmountEur,
    peakFundingNeedEur,
    fundingSurplusDeficitEur,
    isFundingCovered,
    runwayMonths,
    activeDraft,
    finalDraftTerms: FINAL_DRAFT_TERMS,
    form081226Terms: FORM_081226_TERMS,
    maturityCashPayoffUsd,
    impliedCashMultiple,
    preSplitSharePriceUsd,
    reverseSplitRatio,
    postSplitImpliedPriceUsd,
    preSplitSharesOutstanding,
    postSplitSharesOutstanding,
    conversionPriceUsd,
    totalSharesIssuedAtConversion,
    postConversionTotalShares,
    uncappedOwnershipPct,
    beneficialOwnershipCapPct: activeDraft.beneficialOwnershipCapPct,
    stagedConversionsCount: stagedTranches.length,
    stagedTranches,
    unverifiedMemoClaimEnabled: false
  };
}
