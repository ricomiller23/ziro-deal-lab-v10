import { ReconciliationConflict } from './types';

export function getReconciliationConflicts(): ReconciliationConflict[] {
  return [
    {
      id: 'rec_1_nicoya_base',
      topic: 'Nicoya Base Monthly SaaS Fee',
      sourceA: {
        name: 'ZIRO_DEALROOM_II_EXECUTIVE_INVESTMENT_MEMORANDUM.md',
        claim: 'EUR 1,200 / month (EUR 14,400 / year) claimed in opex narrative'
      },
      sourceB: {
        name: 'Ziro_Health_Financials Peptides and testing.xlsx',
        claim: 'Overhead!C25 explicitly formulas EUR 1,400 / month (EUR 16,800 / year)'
      },
      engineResolution: 'Workbook wins: Ported EUR 1,400 / month directly from Overhead sheet C25. Memorandum understates technology base cost by EUR 2,400/yr.',
      hasToggle: true,
      toggleKey: 'nicoyaBaseFeeGbp'
    },
    {
      id: 'rec_2_nicoya_per_client',
      topic: 'Nicoya Per-Client Fee & FX Rate',
      sourceA: {
        name: 'ZIRO_DEALROOM_II_ORAL_PEPTIDES_AND_DIAGNOSTICS_QOE_AUDIT.md',
        claim: 'GBP 6.50 converted at 1.15 EUR/GBP (= EUR 7.48 / client)'
      },
      sourceB: {
        name: 'Ziro_Health_Financials Peptides and testing.xlsx',
        claim: 'Assumptions!C43:C44 formulas GBP 7.00 converted at 1.17 EUR/GBP (= EUR 8.19 / client above 100)'
      },
      engineResolution: 'Workbook wins: Assumptions C43:C44 preserved (GBP 7.00 @ 1.17 EUR/GBP). Over 740,000 members, narrative audit discrepancy amounts to EUR 525k cumulative variance.',
      hasToggle: true,
      toggleKey: 'nicoyaPerClientFeeGbp'
    },
    {
      id: 'rec_3_optimize_retests',
      topic: 'Optimize Retest Frequency & Blend',
      sourceA: {
        name: 'ZIRO_DEALROOM_II_EXECUTIVE_INVESTMENT_MEMORANDUM.md',
        claim: '2 retests per year (= 0.5 tests per quarter)'
      },
      sourceB: {
        name: 'Ziro_Health_Financials Peptides and testing.xlsx',
        claim: 'Assumptions!C48:C50 & Quarterly formulas blend 0.70 tests/qtr (= 2.80 tests/year: 40% 1x, 50% 2x, 10% 4x)'
      },
      engineResolution: 'Workbook wins: Quarterly sheet uses 0.70 tests/qtr formula directly to compute both attached revenue and kit delivery costs.',
      hasToggle: true,
      toggleKey: 'monthlyOptimizeShare'
    },
    {
      id: 'rec_4_baseline_test_cogs',
      topic: 'Baseline Diagnostic Test Cost of Goods Sold',
      sourceA: {
        name: 'ZIRO_DEALROOM_II_ORAL_PEPTIDES_AND_DIAGNOSTICS_QOE_AUDIT.md',
        claim: 'EUR 95.00 per kit (including phlebotomy partner premium & express courier)'
      },
      sourceB: {
        name: 'Ziro_Health_Financials Peptides and testing.xlsx',
        claim: 'Assumptions!C17 & Unit Economics!C14 formulas EUR 115.00 per kit (lab processing + collection pack)'
      },
      engineResolution: 'Workbook wins: EUR 115.00 per baseline kit strictly preserved. EUR 95 would add EUR 439k in 2027 COGS and push peak funding need to EUR 1.41M.',
      hasToggle: true,
      toggleKey: 'baselineTestCost'
    },
    {
      id: 'rec_5_peptide_typo_i22',
      topic: 'Peptide Pro-Forma Cell I22 Formula / Hardcode Typo',
      sourceA: {
        name: 'Peptide Pro-Forma.xlsx (Cell I22)',
        claim: '362,580 new memberships hardcoded in 2029 (isolated copy-paste typo from row 34)'
      },
      sourceB: {
        name: 'Ziro_Health_Financials Peptides and testing.xlsx',
        claim: '197,397 new memberships in 2029 derived from the verified 12% QoQ growth formula'
      },
      engineResolution: 'Workbook wins: Main financial model has clean member cadence. Peptide pro-forma cell I22 is a known Excel bug that creates an artificial EUR 8.4M phantom EBITDA spike. Engine uses clean cadence with audit toggle.',
      hasToggle: false
    },
    {
      id: 'rec_6_convertible_note_interest',
      topic: 'Convertible Note Coupon / Guaranteed Return',
      sourceA: {
        name: 'ZIRO_Convertible_Note_Final.docx (Execution Version)',
        claim: '20% simple interest per annum (cash payment, not convertible)'
      },
      sourceB: {
        name: 'Convertible Note Form 08 12 26.docx (August Term Sheet)',
        claim: '100% total guaranteed return (2.0x cash payoff / 50% annualized yield)'
      },
      engineResolution: 'Both legal drafts provided: Final executed doc has 20% interest; August term sheet has 100% interest. Deal Lab provides instant toggle to compare both contracts against cash runway.',
      hasToggle: true,
      toggleKey: 'activeNoteDraft'
    },
    {
      id: 'rec_7_convertible_note_discount',
      topic: 'Convertible Note Conversion Discount to OTC Market',
      sourceA: {
        name: 'ZIRO_Convertible_Note_Final.docx',
        claim: '20% discount to lowest 3 trading closes on OTC: TWSI'
      },
      sourceB: {
        name: 'Ziro_Stress_Test_Model.xlsx & Form 08 12 26',
        claim: '50% discount to lowest OTC closing price ($0.00002 -> $0.00001)'
      },
      engineResolution: 'Both modeled: 50% discount issues 50 billion post-split shares (99.991% dilution), while 20% discount issues 31.25 billion shares (99.986% dilution). Both trigger death-spiral without reverse split or valuation floor.',
      hasToggle: true,
      toggleKey: 'noteConversionDiscount'
    }
  ];
}
