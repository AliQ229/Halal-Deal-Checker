
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, CheckCircle, XCircle, TrendingUp, TrendingDown, Sparkles, PoundSterling, ChevronDown, ChevronUp, Calendar, Target, Zap } from "lucide-react";
import { DealInputs, DealResults } from "@/types/calculator";
import { ExportResults } from "./ExportResults";
import { HelpDialog } from "./HelpDialog";

interface ResultsCardProps {
  results: DealResults;
  inputs: DealInputs;
  onReset: () => void;
  propertyName: string;
}

export const ResultsCard = ({ results, inputs, onReset, propertyName }: ResultsCardProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const formatMonths = (months: number) => {
    if (months < 0) return "Never";
    if (months < 12) return `${months.toFixed(1)} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths < 1) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years}y ${remainingMonths.toFixed(0)}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header with verdict */}
      <Card className={`border-2 ${results.dealStacks ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {results.dealStacks ? (
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
            )}
          </div>
          <CardTitle className={`text-3xl font-bold flex items-center justify-center gap-2 ${results.dealStacks ? 'text-green-800 dark:text-green-100' : 'text-red-800 dark:text-red-100'}`}>
            {results.dealStacks ? (
              <>
                This Deal Stacks! <Sparkles className="w-6 h-6" />
              </>
            ) : (
              <>
                This Doesn't Stack <TrendingDown className="w-6 h-6" />
              </>
            )}
          </CardTitle>
          <p className={`text-lg ${results.dealStacks ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'}`}>
            {results.dealStacks 
              ? 'Congratulations! Your halal property investment shows positive returns.'
              : 'This investment may not meet your financial goals. Consider adjusting the parameters.'
            }
          </p>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-800">
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <PoundSterling className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Monthly Profit</h3>
            <p className={`text-2xl font-bold ${results.netMonthlyProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(results.netMonthlyProfit)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-teal-200 dark:border-teal-900/50 bg-white dark:bg-slate-800">
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{results.annualAppreciationValue > 0 ? 'Total Return on Cash' : 'Return on Cash'}</h3>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {formatPercentage(results.returnOnCash)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-800">
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Break Even</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatMonths(results.breakEvenMonths)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900/50 bg-white dark:bg-slate-800">
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Gross Yield</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatPercentage(results.grossYield)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-100">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 border-b pb-2">Income & Expenses</h4>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Monthly Rent:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(results.monthlyRent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Net Monthly Profit:</span>
                <span className={`font-semibold ${results.netMonthlyProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(results.netMonthlyProfit)}
                </span>
              </div>
              {results.annualAppreciationValue > 0 ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Annual Profit (from rent):</span>
                    <span className={`font-semibold ${results.annualProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(results.annualProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Est. Annual Appreciation:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(results.annualAppreciationValue)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                    <span className="text-slate-600 dark:text-slate-300 font-bold">Total Annual Return:</span>
                    <span className={`font-bold ${results.totalAnnualReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(results.totalAnnualReturn)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                  <span className="text-slate-600 dark:text-slate-300 font-bold">Annual Profit:</span>
                  <span className={`font-bold ${results.annualProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(results.annualProfit)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Investment Summary</h4>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Cash Invested:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(results.cashInvested)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Lender Coverage:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{results.lenderCoverageRatio !== null ? `${results.lenderCoverageRatio.toFixed(2)}x` : 'N/A' }</span>
                  <Badge variant={results.passesLenderCheck ? "default" : "destructive"}>
                    {results.passesLenderCheck ? "Pass" : "Fail"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Net Yield:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{formatPercentage(results.netYield)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analysis */}
      <Card className="border-indigo-200 dark:border-indigo-700">
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
              <CardTitle className="text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Advanced Analysis
                </span>
                {showAdvanced ? 
                  <ChevronUp className="w-5 h-5 text-indigo-700 dark:text-indigo-300" /> : 
                  <ChevronDown className="w-5 h-5 text-indigo-700 dark:text-indigo-300" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                  <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Monthly ROI</h5>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {formatPercentage(results.monthlyROI)}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                  <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">vs Savings Account</h5>
                  <p className={`text-lg font-bold ${
                    results.comparisonMetrics.propertyVsSavings >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {results.comparisonMetrics.propertyVsSavings >= 0 ? '+' : ''}{formatPercentage(results.comparisonMetrics.propertyVsSavings)}
                  </p>
                </div>

                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                  <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Break-even Time</h5>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {formatMonths(results.breakEvenMonths)}
                  </p>
                </div>
              </div>

              {/* Detailed Insights */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Investment Insights</h4>
                
                <div className="grid gap-4">
                  <div className={`p-4 rounded-lg border-l-4 ${
                    results.passesLenderCheck 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400'
                  }`}>
                    <h5 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Lender Requirements</h5>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {results.passesLenderCheck 
                        ? (results.lenderCoverageRatio === null
                            ? '✅ Cash purchase — no lender coverage required.'
                            : `✅ Rent (${formatCurrency(results.monthlyRent)}) covers 145% of finance costs.`)
                        : (results.lenderCoverageRatio === null
                            ? '❌ Cash deal is loss-making.'
                            : `❌ Rent should be at least ${formatCurrency((results.lenderCoverageRatio ?? 0) * 1.45)} to meet lender requirements.`)
                      }
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 ${
                    results.comparisonMetrics.propertyVsSavings > 0 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-400'
                  }`}>
                    <h5 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Return Comparison</h5>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {results.comparisonMetrics.propertyVsSavings > 0 
                        ? `🎯 This property returns ${formatPercentage(results.comparisonMetrics.propertyVsSavings)} more than a typical savings account (${formatPercentage(results.comparisonMetrics.savingsAccountReturn)}).`
                        : `⚠️ This property may underperform compared to safer alternatives like savings accounts.`
                      }
                    </p>
                  </div>

                  {results.breakEvenMonths > 0 && results.breakEvenMonths < 120 && (
                    <div className="p-4 rounded-lg border-l-4 bg-purple-50 dark:bg-purple-900/20 border-purple-500 dark:border-purple-400">
                      <h5 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Cash Recovery Timeline</h5>
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        💰 You'll recover your initial investment of {formatCurrency(results.totalStartupCosts)} in {formatMonths(results.breakEvenMonths)}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          onClick={onReset}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Calculate Another Deal
        </Button>
        <ExportResults inputs={inputs} results={results} propertyName={propertyName} />
        <HelpDialog />
      </div>
    </div>
  );
};
