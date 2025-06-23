
import { DealInputs } from "@/types/calculator";

export interface ValidationError {
  field: keyof DealInputs;
  message: string;
}

export const validateDealInputs = (inputs: DealInputs): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!inputs.purchasePrice || inputs.purchasePrice <= 0) {
    errors.push({ field: 'purchasePrice', message: 'Purchase price must be greater than 0' });
  }

  if (!inputs.expectedRent || inputs.expectedRent <= 0) {
    errors.push({ field: 'expectedRent', message: 'Expected rent must be greater than 0' });
  }

  if (!inputs.deposit || inputs.deposit < 0) {
    errors.push({ field: 'deposit', message: 'Deposit cannot be negative' });
  }

  if (!inputs.financingMethod) {
    errors.push({ field: 'financingMethod', message: 'Please select a financing method' });
  }

  if (inputs.monthlyFinanceCost < 0) {
    errors.push({ field: 'monthlyFinanceCost', message: 'Monthly finance cost cannot be negative' });
  }

  if (inputs.monthlyOperatingCosts < 0) {
    errors.push({ field: 'monthlyOperatingCosts', message: 'Operating costs cannot be negative' });
  }

  // Logical validations
  if (inputs.deposit > inputs.purchasePrice) {
    errors.push({ field: 'deposit', message: 'Deposit cannot be greater than purchase price' });
  }

  if (inputs.purchasePrice > 0 && inputs.deposit > 0) {
    const depositPercentage = (inputs.deposit / inputs.purchasePrice) * 100;
    if (depositPercentage < 15) {
      errors.push({ field: 'deposit', message: 'Deposit should be at least 15% of purchase price for Islamic financing' });
    }
    if (depositPercentage > 50) {
      errors.push({ field: 'deposit', message: 'Deposit over 50% is unusually high - please verify' });
    }
  }

  // Rent reasonableness check
  if (inputs.purchasePrice > 0 && inputs.expectedRent > 0) {
    const monthlyRent = inputs.rentFrequency === 'weekly' 
      ? inputs.expectedRent * 52 / 12 
      : inputs.expectedRent;
    
    const grossYield = (monthlyRent * 12 / inputs.purchasePrice) * 100;
    
    if (grossYield > 20) {
      errors.push({ field: 'expectedRent', message: 'Rent seems unusually high - please verify' });
    }
    if (grossYield < 2) {
      errors.push({ field: 'expectedRent', message: 'Rent seems unusually low - please verify' });
    }
  }

  return errors;
};

export const getFieldError = (errors: ValidationError[], field: keyof DealInputs): string | undefined => {
  return errors.find(error => error.field === field)?.message;
};
