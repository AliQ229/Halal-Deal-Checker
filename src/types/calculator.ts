
export interface DealInputs {
  purchasePrice: number;
  expectedRent: number;
  rentFrequency: 'weekly' | 'monthly';
  deposit: number;
  financingMethod: string;
  monthlyFinanceCost: number;
  monthlyOperatingCosts: number;
  annualAppreciation: number;
  // Advanced breakdown fields
  stampDuty: number;
  legalFees: number;
  refurbCosts: number;
  otherUpfrontCosts: number;
}

export interface DealResults {
  monthlyRent: number;
  netMonthlyProfit: number;
  returnOnCash: number;
  grossYield: number;
  netYield: number;
  dealStacks: boolean;
  cashInvested: number;
  lenderCoverageRatio: number | null;
  passesLenderCheck: boolean;
  annualProfit: number;
  annualAppreciationValue: number;
  totalAnnualReturn: number;
  // Advanced analysis results
  breakEvenMonths: number;
  totalStartupCosts: number;
  monthlyROI: number;
  comparisonMetrics: {
    savingsAccountReturn: number;
    propertyVsSavings: number;
  };
}
