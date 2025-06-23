import { describe, expect, it } from 'vitest';
import { calculateDeal } from './calculator';
import type { DealInputs } from '../types/calculator';

describe('calculateDeal', () => {
  const baseInputs: DealInputs = {
    purchasePrice: 200000,
    expectedRent: 1200,
    rentFrequency: 'monthly',
    deposit: 50000,
    financingMethod: 'musharakah',
    monthlyFinanceCost: 800,
    monthlyOperatingCosts: 150,
    stampDuty: 6000,
    legalFees: 2000,
    refurbCosts: 5000,
    otherUpfrontCosts: 1000,
  };

  it('should calculate a standard profitable deal correctly', () => {
    const results = calculateDeal(baseInputs);
    expect(results.netMonthlyProfit).toBe(250.00);
    expect(results.totalStartupCosts).toBe(14000.00);
    expect(results.cashInvested).toBe(64000.00);
    expect(results.dealStacks).toBe(false); // Fails on net yield
  });

  it('should handle cash purchases correctly', () => {
    const cashInputs: DealInputs = { ...baseInputs, financingMethod: 'cash', deposit: 200000, monthlyFinanceCost: 0 };
    const results = calculateDeal(cashInputs);
    expect(results.netMonthlyProfit).toBe(1050.00);
    expect(results.totalStartupCosts).toBe(14000.00);
    expect(results.cashInvested).toBe(214000.00);
    expect(results.dealStacks).toBe(true);
  });

  it('should handle weekly rent correctly', () => {
    const weeklyRentInputs: DealInputs = { ...baseInputs, expectedRent: 300, rentFrequency: 'weekly' };
    const results = calculateDeal(weeklyRentInputs);
    expect(results.monthlyRent).toBe(1300);
    expect(results.netMonthlyProfit).toBe(350.00);
    expect(results.dealStacks).toBe(false); // Fails on net yield
  });

  it('should identify a deal that does not stack up due to negative profit', () => {
    const badDealInputs: DealInputs = { ...baseInputs, expectedRent: 900 };
    const results = calculateDeal(badDealInputs);
    expect(results.netMonthlyProfit).toBe(-50.00);
    expect(results.dealStacks).toBe(false);
  });

  it('should handle zero upfront costs', () => {
    const zeroUpfrontInputs: DealInputs = {
      ...baseInputs,
      stampDuty: 0,
      legalFees: 0,
      refurbCosts: 0,
      otherUpfrontCosts: 0,
    };
    const results = calculateDeal(zeroUpfrontInputs);
    expect(results.totalStartupCosts).toBe(0);
    expect(results.cashInvested).toBe(50000.00);
    expect(results.dealStacks).toBe(false); // Fails on net yield
  });

  it('should identify a deal that does not stack up due to low ROI', () => {
    const lowRoiInputs: DealInputs = { ...baseInputs, deposit: 100000 };
    const results = calculateDeal(lowRoiInputs);
    expect(results.dealStacks).toBe(false);
  });

  it('should handle zero purchase price without errors and not stack', () => {
    const zeroPriceInputs: DealInputs = { ...baseInputs, purchasePrice: 0, deposit: 0 };
    const results = calculateDeal(zeroPriceInputs);
    expect(results.grossYield).toBe(Infinity);
    expect(results.netYield).toBe(Infinity);
    expect(results.dealStacks).toBe(false);
  });
});
const baseInputs: DealInputs = {
  purchasePrice: 200000,
  expectedRent: 1200,
  rentFrequency: 'monthly',
  deposit: 40000,
  financingMethod: 'musharakah',
  monthlyFinanceCost: 300,
  monthlyOperatingCosts: 200,
  stampDuty: 2000,
  legalFees: 1500,
  refurbCosts: 5000,
  otherUpfrontCosts: 500,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

describe('calculateDeal', () => {
  it('handles cash purchase without double-counting costs', () => {
    const cashInputs: DealInputs = {
      ...baseInputs,
      financingMethod: 'cash',
      deposit: 0, // not used
      monthlyFinanceCost: 0,
    };

    const results = calculateDeal(cashInputs);

    // Ensure rent conversion not applied (monthly default)
    expect(results.monthlyRent).toBe(cashInputs.expectedRent);

    const detailedUpfront = cashInputs.stampDuty + cashInputs.legalFees + cashInputs.refurbCosts + cashInputs.otherUpfrontCosts;

    // Startup costs should exclude deposit
    expect(results.totalStartupCosts).toBe(detailedUpfront);
    // Cash invested should be purchase price + costs
    expect(results.cashInvested).toBe(cashInputs.purchasePrice + detailedUpfront);

    // Lender ratio irrelevant for cash: should be null under new logic
    expect(results.lenderCoverageRatio).toBeNull();
    expect(results.passesLenderCheck).toBe(true);
  });

  it('converts weekly rent to monthly correctly', () => {
    const weeklyInputs: DealInputs = {
      ...baseInputs,
      expectedRent: 300,
      rentFrequency: 'weekly',
    };

    const results = calculateDeal(weeklyInputs);
    const expectedMonthlyRent = 300 * 52 / 12;
    expect(results.monthlyRent).toBeCloseTo(expectedMonthlyRent, 5);
  });
});
