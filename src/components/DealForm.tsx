import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaqDialog } from "./FaqDialog";
import { HelpDialog } from "./HelpDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Home, Landmark, BarChart3, ChevronDown, ChevronUp, AlertCircle, Loader2, HelpCircle, TrendingUp, Info, Plus, Trash2, X } from 'lucide-react';
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DealInputs, DealResults } from "@/types/calculator";
import { calculateDeal, getFinancingExplanation } from "@/lib/calculator";

interface DealFormProps {
  onCalculate: (inputs: DealInputs, results: DealResults, propertyName: string) => void;
}

export const DealForm = ({ onCalculate }: DealFormProps) => {
  const [inputs, setInputs] = useState<DealInputs>({
    purchasePrice: 0,
    expectedRent: 0,
    rentFrequency: 'monthly',
    deposit: 0,
    financingMethod: '',
    monthlyFinanceCost: 0,
    monthlyOperatingCosts: 0,
    annualAppreciation: 3, // Default to 3%
    stampDuty: 0,
    legalFees: 0,
    refurbCosts: 0,
    otherUpfrontCosts: 0,
  });

  const [propertyName, setPropertyName] = useState('123 Halal Street, London');
  const [displayValues, setDisplayValues] = useState({
    purchasePrice: '',
    expectedRent: '',
    deposit: '',
    monthlyFinanceCost: '',
    monthlyOperatingCosts: '',
    annualAppreciation: '3',
    stampDuty: '',
    legalFees: '',
    refurbCosts: '',
    otherUpfrontCosts: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [includeAppreciation, setIncludeAppreciation] = useState(false);

  const formatNumberWithCommas = (num: number) => {
    if (num === null || num === undefined || isNaN(num)) return '';
    return new Intl.NumberFormat('en-GB').format(num);
  };
  
  const parseNumber = (str: string) => {
    if (typeof str !== 'string' || !str) return 0;
    return Number(str.replace(/,/g, ''));
  };

  const handleAppreciationToggle = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    setIncludeAppreciation(isChecked);
    if (!isChecked) {
      setInputs(prev => ({ ...prev, annualAppreciation: 0 }));
      setDisplayValues(prev => ({ ...prev, annualAppreciation: '0' }));
    } else {
      setInputs(prev => ({ ...prev, annualAppreciation: 3 }));
      setDisplayValues(prev => ({ ...prev, annualAppreciation: '3' }));
    }
  };

  const handleSelectChange = (field: 'financingMethod' | 'rentFrequency', value: string) => {
    if (field === 'financingMethod') {
      // Handle financing method change
      setInputs(prev => ({
        ...prev,
        financingMethod: value as 'musharakah' | 'ijara' | 'murabaha' | 'crowdfunding' | 'cash',
        deposit: (value === 'cash' || value === 'crowdfunding') ? 0 : prev.deposit,
        monthlyFinanceCost: (value === 'cash' || value === 'crowdfunding') ? 0 : prev.monthlyFinanceCost
      }));
      
      // Clear display values for disabled fields
      if (value === 'cash' || value === 'crowdfunding') {
        setDisplayValues(prev => ({
          ...prev,
          deposit: '',
          monthlyFinanceCost: ''
        }));
      }
    } else {
      // Handle rent frequency change
      setInputs(prev => ({
        ...prev,
        rentFrequency: value as 'weekly' | 'monthly'
      }));
    }
    
    if (errors.length > 0) setErrors([]);
  };

  const handleNumericInputChange = (field: keyof Omit<DealInputs, 'rentFrequency' | 'financingMethod'>, value: string) => {
    setDisplayValues(prev => ({ ...prev, [field]: value }));
    const numericValue = parseNumber(value);
    setInputs(prev => ({ ...prev, [field]: numericValue }));
    if (errors.length > 0) setErrors([]);
  };

  const handleBlur = (field: keyof Omit<DealInputs, 'rentFrequency' | 'financingMethod'>) => {
    const numericValue = inputs[field] as number;
    setDisplayValues(prev => ({ ...prev, [field]: formatNumberWithCommas(numericValue) }));
  };

  const handleFocus = (field: keyof Omit<DealInputs, 'rentFrequency' | 'financingMethod'>) => {
    const numericValue = inputs[field] as number;
    setDisplayValues(prev => ({ ...prev, [field]: numericValue > 0 ? String(numericValue) : '' }));
  };

  const validateInputs = (): string[] => {
    const validationErrors: string[] = [];
    
    if (!inputs.purchasePrice || inputs.purchasePrice <= 0) {
      validationErrors.push("Purchase price must be greater than £0");
    }
    
    if (!inputs.expectedRent || inputs.expectedRent <= 0) {
      validationErrors.push("Expected rent must be greater than £0");
    }
    
    if (!inputs.financingMethod) {
      validationErrors.push("Please select a financing method");
    }
    
    if (inputs.financingMethod !== 'cash' && inputs.financingMethod !== 'crowdfunding' && (!inputs.deposit || inputs.deposit < 0)) {
      validationErrors.push("Deposit amount is required for financed purchases");
    }
    
    if (inputs.deposit >= inputs.purchasePrice && inputs.purchasePrice > 0) {
      validationErrors.push("Deposit cannot be equal to or greater than purchase price");
    }
    
    if (inputs.financingMethod !== 'cash' && inputs.financingMethod !== 'crowdfunding' && (!inputs.monthlyFinanceCost || inputs.monthlyFinanceCost <= 0)) {
      validationErrors.push("Monthly finance cost is required for financed purchases");
    }
    
    return validationErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    
    // Simulate a short delay for better UX
    // Ensure appreciation is zero if the box is unchecked
    const finalInputs = {
      ...inputs,
      annualAppreciation: includeAppreciation ? inputs.annualAppreciation : 0,
    };

    // Simulate a short delay for better UX
    setTimeout(() => {
      const results = calculateDeal(finalInputs);
      onCalculate(finalInputs, results, propertyName);
      setIsLoading(false);
    }, 500);
  };

  const totalAdvancedCosts = [
    inputs.stampDuty,
    inputs.legalFees,
    inputs.refurbCosts,
    inputs.otherUpfrontCosts,
  ].reduce((sum, cost) => sum + (cost || 0), 0);

  const TooltipWrapper = ({ children, content }: { children: React.ReactNode; content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="w-4 h-4 text-primary" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent mb-2">
          Enter Your Property Details
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Welcome to the Halal Deal Checker. This tool helps you analyse UK property investments according to Islamic principles. Enter your property and financing details to calculate key metrics like rental yield, return on cash, and whether the deal 'stacks up'. You can also model asset appreciation and explore modern financing options like equity crowdfunding. All fields marked with <span className="text-rose-500">*</span> are required.
        </p>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Property Details */}
        <Card>
          <CardHeader className="bg-emerald-50 dark:bg-emerald-950/50 border-b dark:border-emerald-800 rounded-t-lg p-4 mb-4">
            <CardTitle className="text-emerald-800 dark:text-emerald-200 text-lg flex items-center gap-2">
              <Home className="h-5 w-5" /> Property Details
            </CardTitle>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 opacity-80 mt-1">Core information about your property</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="propertyName" className="font-medium">Property Name/Address</Label>
              <Input
                id="propertyName"
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="mt-1 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                placeholder="e.g., 123 Halal Street, London"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TooltipWrapper content="The total purchase price of the property">
                  <Label htmlFor="purchasePrice" className="font-medium">Purchase Price</Label>
                </TooltipWrapper>
                <span className="text-rose-500">*</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="purchasePrice"
                  type="text"
                  value={displayValues.purchasePrice}
                  onChange={(e) => handleNumericInputChange('purchasePrice', e.target.value)}
                  onBlur={() => handleBlur('purchasePrice')}
                  onFocus={() => handleFocus('purchasePrice')}
                  className="pl-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="200,000"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TooltipWrapper content="Expected rental income - choose weekly or monthly">
                  <Label htmlFor="expectedRent" className="font-medium">Expected Rent</Label>
                </TooltipWrapper>
                <span className="text-rose-500">*</span>
              </div>
              <div className="flex items-stretch">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">£</span>
                  <Input
                    id="expectedRent"
                    type="text"
                    value={displayValues.expectedRent}
                    onChange={(e) => handleNumericInputChange('expectedRent', e.target.value)}
                    onBlur={() => handleBlur('expectedRent')}
                    onFocus={() => handleFocus('expectedRent')}
                    className="pl-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 rounded-r-none border-r-0"
                    placeholder="1,200"
                    required
                  />
                </div>
                <Select 
                  value={inputs.rentFrequency} 
                  onValueChange={(value: 'weekly' | 'monthly') => handleSelectChange('rentFrequency', value)}
                >
                  <SelectTrigger className="w-32 h-11 px-3 py-2.5 border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-l-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly" className="text-base">Monthly</SelectItem>
                    <SelectItem value="weekly" className="text-base">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Rent from tenants before costs.</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox id="includeAppreciation" checked={includeAppreciation} onCheckedChange={handleAppreciationToggle} />
                <Label htmlFor="includeAppreciation" className="font-medium cursor-pointer">
                  Include Est. Annual Appreciation
                </Label>
              </div>
            </div>

            {includeAppreciation && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TooltipWrapper content="Estimated annual increase in property value. A common estimate is 2-4%.">
                    <Label htmlFor="annualAppreciation" className="font-medium">Est. Annual Appreciation</Label>
                  </TooltipWrapper>
                </div>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  <Input
                    id="annualAppreciation"
                    type="text"
                    value={displayValues.annualAppreciation}
                    onChange={(e) => handleNumericInputChange('annualAppreciation', e.target.value)}
                    onBlur={() => handleBlur('annualAppreciation')}
                    onFocus={() => handleFocus('annualAppreciation')}
                    className="pr-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="3"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Typical UK average is 2-4%.</p>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Financing Details */}
        <Card>
          <CardHeader className="bg-teal-50 dark:bg-teal-950/50 border-b dark:border-teal-800 rounded-t-lg p-4 mb-4">
            <CardTitle className="text-teal-800 dark:text-teal-200 text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5" /> Halal Financing
            </CardTitle>
            <p className="text-xs text-teal-700 dark:text-teal-400 opacity-80 mt-1">Financing method and costs</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TooltipWrapper content="Choose your Islamic financing method">
                  <Label htmlFor="financingMethod" className="font-medium">Financing Method</Label>
                </TooltipWrapper>
                <span className="text-rose-500">*</span>
              </div>
              <Select 
                value={inputs.financingMethod} 
                onValueChange={(value) => handleSelectChange('financingMethod', value)}
              >
                <SelectTrigger className="h-11 px-3 py-2.5 border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base">
                  <SelectValue placeholder="Select financing method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="musharakah" className="text-base">Musharakah (Bank Partnership)</SelectItem>
                  <SelectItem value="crowdfunding" className="text-base">Musharakah (Equity Crowdfunding)</SelectItem>
                  <SelectItem value="ijara" className="text-base">Ijara (Islamic Lease)</SelectItem>
                  <SelectItem value="murabaha" className="text-base">Murabaha (Cost Plus)</SelectItem>
                  <SelectItem value="cash" className="text-base">Cash Purchase</SelectItem>
                </SelectContent>
              </Select>
              {inputs.financingMethod && (
                <p className="text-sm text-muted-foreground mt-2">
                  {getFinancingExplanation(inputs.financingMethod)}
                </p>
              )}
            </div>

            {inputs.financingMethod && inputs.financingMethod !== 'cash' && inputs.financingMethod !== 'crowdfunding' && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TooltipWrapper content="Your monthly payment to the Islamic lender">
                    <Label htmlFor="monthlyFinanceCost" className="font-medium">Monthly Finance Cost</Label>
                  </TooltipWrapper>
                  <span className="text-rose-500">*</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input
                    id="monthlyFinanceCost"
                    type="text"
                    value={displayValues.monthlyFinanceCost}
                    onChange={(e) => handleNumericInputChange('monthlyFinanceCost', e.target.value)}
                    onBlur={() => handleBlur('monthlyFinanceCost')}
                    onFocus={() => handleFocus('monthlyFinanceCost')}
                    className="pl-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="800"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-1.5 mb-1">
                <TooltipWrapper content="Your deposit amount. This is not applicable for cash purchases.">
                  <Label htmlFor="deposit" className="font-medium">Deposit</Label>
                </TooltipWrapper>
                {inputs.financingMethod !== 'cash' && inputs.financingMethod !== 'crowdfunding' && <span className="text-rose-500">*</span>}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="deposit"
                  type="text"
                  value={displayValues.deposit}
                  onChange={(e) => handleNumericInputChange('deposit', e.target.value)}
                  onBlur={() => handleBlur('deposit')}
                  onFocus={() => handleFocus('deposit')}
                  className="pl-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  placeholder={inputs.financingMethod === 'cash' || inputs.financingMethod === 'crowdfunding' ? '' : '50,000'}
                  disabled={inputs.financingMethod === 'cash' || inputs.financingMethod === 'crowdfunding'}
                  required={inputs.financingMethod !== 'cash' && inputs.financingMethod !== 'crowdfunding'}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">This is your upfront equity contribution.</p>
              {inputs.financingMethod !== 'cash' && inputs.financingMethod !== 'crowdfunding' && inputs.purchasePrice > 0 && inputs.deposit > 0 && (
                <div className="text-xs text-teal-700 bg-teal-50 p-2 rounded-md mt-2">
                  <p>Tip: A typical deposit is 20-25% of the purchase price.</p>
                  <p className="mt-1">
                    Your deposit is <strong>{(inputs.deposit / inputs.purchasePrice * 100).toFixed(1)}%</strong> of the purchase price.
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TooltipWrapper content="Monthly costs like insurance, repairs, agent fees, etc.">
                  <Label htmlFor="monthlyOperatingCosts" className="font-medium">Monthly Operating Costs</Label>
                </TooltipWrapper>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="monthlyOperatingCosts"
                  type="text"
                  value={displayValues.monthlyOperatingCosts}
                  onChange={(e) => handleNumericInputChange('monthlyOperatingCosts', e.target.value)}
                  onBlur={() => handleBlur('monthlyOperatingCosts')}
                  onFocus={() => handleFocus('monthlyOperatingCosts')}
                  className="pl-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="200"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Leave as 0 if not applicable</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Breakdown */}
      <Card className="bg-white dark:bg-slate-800 dark:border-slate-700 border-slate-200">
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <CardHeader className="p-4 cursor-pointer transition-colors rounded-t-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
              <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold">
                  <BarChart3 className="h-5 w-5" /> Advanced Cost Breakdown
                </span>
                <span className="text-sm font-normal text-muted-foreground flex items-center">
                  {showAdvanced ? 'Hide details' : 'Show details'}
                  {showAdvanced ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </span>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground mb-2">
                Break down your upfront costs for more accurate analysis. All fields are optional.
              </p>
              
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <TooltipWrapper content="Government tax on property purchases (usually 3-15% of purchase price)">
                        <Label htmlFor="stampDuty" className="font-medium">Stamp Duty</Label>
                      </TooltipWrapper>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input
                        id="stampDuty"
                        type="text"
                        value={displayValues.stampDuty}
                        onChange={(e) => handleNumericInputChange('stampDuty', e.target.value)}
                        onBlur={() => handleBlur('stampDuty')}
                        onFocus={() => handleFocus('stampDuty')}
                        className="pl-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="6,000"
                      />
                    </div>
                    {inputs.purchasePrice > 0 && inputs.stampDuty > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {((inputs.stampDuty / inputs.purchasePrice) * 100).toFixed(1)}% of purchase price
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <TooltipWrapper content="Solicitor fees, surveys, and legal costs">
                        <Label htmlFor="legalFees" className="font-medium">Legal Fees</Label>
                      </TooltipWrapper>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input
                        id="legalFees"
                        type="text"
                        value={displayValues.legalFees}
                        onChange={(e) => handleNumericInputChange('legalFees', e.target.value)}
                        onBlur={() => handleBlur('legalFees')}
                        onFocus={() => handleFocus('legalFees')}
                        className="pl-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="2,000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <TooltipWrapper content="Property renovation and improvement costs">
                        <Label htmlFor="refurbCosts" className="font-medium">Refurbishment Costs</Label>
                      </TooltipWrapper>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input
                        id="refurbCosts"
                        type="text"
                        value={displayValues.refurbCosts}
                        onChange={(e) => handleNumericInputChange('refurbCosts', e.target.value)}
                        onBlur={() => handleBlur('refurbCosts')}
                        onFocus={() => handleFocus('refurbCosts')}
                        className="pl-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="5,000"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <TooltipWrapper content="Any other upfront costs not covered above">
                        <Label htmlFor="otherUpfrontCosts" className="font-medium">Other Upfront Costs</Label>
                      </TooltipWrapper>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input
                        id="otherUpfrontCosts"
                        type="text"
                        value={displayValues.otherUpfrontCosts}
                        onChange={(e) => handleNumericInputChange('otherUpfrontCosts', e.target.value)}
                        onBlur={() => handleBlur('otherUpfrontCosts')}
                        onFocus={() => handleFocus('otherUpfrontCosts')}
                        className="pl-8 py-2.5 h-11 text-base border-input focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="1,000"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  Quick Tip
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  These costs are added to your initial investment and affect your overall return. 
                  Don't worry if you don't know exact amounts - you can always come back and update them later.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Total Upfront Costs</h4>
                    <p className="text-lg font-bold">
                        £{formatNumberWithCommas(totalAdvancedCosts)}
                    </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    This is the sum of all costs entered in this section.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <div className="text-center pt-6">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Check if Deal Stacks
              </>
            )}
          </span>
          {!isLoading && <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>}
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Need help? Check out our{' '}
          <HelpDialog>
            <button type="button" className="text-emerald-600 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer">
              Guide
            </button>
          </HelpDialog>{' '}
          or{' '}
          <FaqDialog>
            <button type="button" className="text-emerald-600 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer">
              FAQ
            </button>
          </FaqDialog>
        </p>
      </div>
    </form>
  );
};
