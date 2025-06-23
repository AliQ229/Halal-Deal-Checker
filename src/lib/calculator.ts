
import { DealInputs, DealResults } from "@/types/calculator";

export const calculateDeal = (inputs: DealInputs): DealResults => {
  // Constants for deal evaluation thresholds
const MIN_GROSS_YIELD = 6; // %
const MIN_NET_YIELD = 4;   // %

// Helper for rounding to 2dp
const round2 = (n: number) => Math.round(n * 100) / 100;

// Convert weekly rent to monthly if needed
  const monthlyRent = inputs.rentFrequency === 'weekly' 
    ? inputs.expectedRent * 52 / 12 
    : inputs.expectedRent;

  // Calculate total startup costs – avoid double-counting lump-sum vs. detailed costs
  const detailedUpfront = inputs.stampDuty + inputs.legalFees + inputs.refurbCosts + inputs.otherUpfrontCosts;

  // Calculate total startup costs – this should only be the sum of upfront fees.
  const totalStartupCosts = detailedUpfront;

  // For cash purchases, cash invested is the full purchase price + additional costs
  // For financed purchases, cash invested is the deposit + all upfront costs
  const cashInvested = inputs.financingMethod === 'cash' || inputs.financingMethod === 'crowdfunding'
    ? inputs.purchasePrice + detailedUpfront
    : inputs.deposit + detailedUpfront;

  // Calculate net monthly profit
  const netMonthlyProfit = monthlyRent - inputs.monthlyFinanceCost - inputs.monthlyOperatingCosts;

  // Calculate annual figures
  const annualRent = monthlyRent * 12;
  const annualProfit = netMonthlyProfit * 12;

  // Calculate asset appreciation
  const annualAppreciationValue = inputs.purchasePrice * (inputs.annualAppreciation / 100);
  const totalAnnualReturn = annualProfit + annualAppreciationValue;

  // Calculate yields
  const grossYield = (annualRent / inputs.purchasePrice) * 100;
  const netYield = (annualProfit / inputs.purchasePrice) * 100;

  // Calculate return on cash invested
  const returnOnCash = cashInvested > 0 ? (totalAnnualReturn / cashInvested) * 100 : 0;

  // Monthly ROI calculation
  const monthlyROI = cashInvested > 0 ? (netMonthlyProfit / cashInvested) * 100 : 0;

  // Lender coverage ratio (rent should be at least 145% of finance costs)
  // For cash purchases, this doesn't apply since there are no finance costs
  const lenderCoverageRatio = inputs.financingMethod === 'cash' || inputs.financingMethod === 'crowdfunding' || inputs.monthlyFinanceCost === 0
    ? null // not applicable for cash deals
    : monthlyRent / inputs.monthlyFinanceCost;
  
  const passesLenderCheck = inputs.financingMethod === 'cash' || inputs.financingMethod === 'crowdfunding' || inputs.monthlyFinanceCost === 0
    ? true // Cash purchases automatically pass
    : (lenderCoverageRatio ?? 0) >= 1.45;

  // Break-even calculation (months to recoup startup costs)
  const breakEvenMonths = netMonthlyProfit > 0 ? cashInvested / netMonthlyProfit : -1;

  // Comparison with savings account (assuming 2% annual return)
  const savingsAccountReturn = 2.0;
  const propertyVsSavings = returnOnCash - savingsAccountReturn;

  // Determine if deal stacks
  // For cash purchases: positive monthly profit + reasonable yield
  // For financed purchases: positive monthly profit + reasonable yield + passes lender check
  // Determine if deal stacks
  // For cash purchases: positive monthly profit + reasonable yield
  // For financed purchases: positive monthly profit + reasonable yield + passes lender check
  const dealStacks = inputs.purchasePrice > 0 && netMonthlyProfit > 0 && grossYield >= MIN_GROSS_YIELD && netYield >= MIN_NET_YIELD && passesLenderCheck;

  return {
    monthlyRent: round2(monthlyRent),
    netMonthlyProfit: round2(netMonthlyProfit),
    returnOnCash: round2(returnOnCash),
    grossYield: round2(grossYield),
    netYield: round2(netYield),
    dealStacks,
    cashInvested,
    lenderCoverageRatio,
    passesLenderCheck,
    annualProfit,
    annualAppreciationValue,
    totalAnnualReturn,
    breakEvenMonths,
    totalStartupCosts: round2(totalStartupCosts),
    monthlyROI: round2(monthlyROI),
    comparisonMetrics: {
      savingsAccountReturn,
      propertyVsSavings: round2(propertyVsSavings),
    },
  };
};

// Utility function for Islamic financing explanations
export const getFinancingExplanation = (method: string): string => {
  const explanations: { [key: string]: string } = {
    'musharakah': 'Traditional bank partnership where you and the bank jointly own the property. You share profits and losses according to ownership percentage. The bank typically provides 70-80% of the property value.',
    'ijara': 'Islamic lease-to-own arrangement where the bank owns and leases the property to you',
    'murabaha': 'Cost-plus financing where the bank purchases and sells the property to you at an agreed markup',
    'crowdfunding': 'A form of Musharakah where multiple investors pool funds to collectively buy a property. Each investor owns a share proportional to their investment. No bank involvement.',
    'cash': 'Full cash purchase with no financing required'
  };
  
  return explanations[method] || 'Select a financing method for more information';
};
