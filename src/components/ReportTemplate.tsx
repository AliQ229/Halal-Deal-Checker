import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DealInputs, DealResults } from '@/types/calculator';

interface ReportTemplateProps {
  results: DealResults;
  inputs: DealInputs;
  propertyName: string;
  chartRefs: {
    yieldChartRef: React.RefObject<HTMLDivElement>;
    breakdownChartRef: React.RefObject<HTMLDivElement>;
  };
}

const COLORS = ['#0f766e', '#14b8a6', '#94a3b8'];

const ReportTemplate: React.FC<ReportTemplateProps> = ({ results, inputs, propertyName, chartRefs }) => {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const yieldData = [
    { name: 'Gross Yield', value: parseFloat(results.grossYield.toFixed(2)) },
    { name: 'Net Yield', value: parseFloat(results.netYield.toFixed(2)) },
    { name: 'Return on Cash', value: parseFloat(results.returnOnCash.toFixed(2)) },
  ].filter(item => item.value > 0);

  const breakdownData = [
    { name: 'Annual Rent Profit', value: results.annualProfit },
    ...(results.annualAppreciationValue > 0 ? [{ name: 'Annual Appreciation', value: results.annualAppreciationValue }] : []),
    { name: 'Startup Costs', value: results.totalStartupCosts },
  ].filter(item => item.value > 0);


  return (
    <div className="bg-white text-gray-800 font-sans p-8 w-[800px]">
      {/* Header */}
      <header className="mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold">Halal Property Investment Report</h1>
          <div className="flex justify-between mt-2 text-lg">
            <span>{propertyName}</span>
            <span>{today}</span>
          </div>
        </div>
      </header>

      <main>
        {/* Section 1: Property & Financing Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-teal-700 border-b-2 border-teal-700 pb-2 mb-4">Property & Financing Summary</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-base">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Purchase Price:</span>
              <span>£{inputs.purchasePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Expected Rent:</span>
              <span>£{inputs.expectedRent.toLocaleString()} / {inputs.rentFrequency}</span>
            </div>
            <div className="flex justify-between border-b pb-2 col-span-2">
              <span className="font-semibold">Financing Method:</span>
              <span>{inputs.financingMethod}</span>
            </div>
            {inputs.financingMethod !== 'cash' && inputs.financingMethod !== 'crowdfunding' && (
              <>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Deposit:</span>
                  <span>£{inputs.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Monthly Finance Cost:</span>
                  <span>£{inputs.monthlyFinanceCost.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Advanced Costs Breakdown</h3>
              <div className="grid grid-cols-2 gap-x-8">
                <div className="flex justify-between text-sm">
                  <span>Stamp Duty:</span>
                  <span>£{inputs.stampDuty.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Legal Fees:</span>
                  <span>£{inputs.legalFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Refurb Costs:</span>
                  <span>£{inputs.refurbCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Other Upfront Costs:</span>
                  <span>£{inputs.otherUpfrontCosts.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Investment Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-teal-700 border-b-2 border-teal-700 pb-2 mb-4">Investment Summary</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-base">
            <div className="flex justify-between border-b pb-2 font-bold text-teal-600">
              <span>Gross Yield:</span>
              <span>{results.grossYield.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between border-b pb-2 font-bold text-teal-600">
              <span>Net Yield:</span>
              <span>{results.netYield.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between border-b pb-2 font-bold text-teal-600">
              <span>{results.annualAppreciationValue > 0 ? 'Total Return on Cash' : 'Return on Cash'}:</span>
              <span>{results.returnOnCash.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>{results.annualAppreciationValue > 0 ? 'Annual Profit (from rent)' : 'Annual Profit'}:</span>
              <span>£{results.annualProfit.toLocaleString()}</span>
            </div>
            {results.annualAppreciationValue > 0 && (
              <div className="flex justify-between border-b pb-2">
                <span>Est. Annual Appreciation:</span>
                <span>£{results.annualAppreciationValue.toLocaleString()}</span>
              </div>
            )}
            {results.annualAppreciationValue > 0 && (
              <div className="flex justify-between border-b pb-2 font-bold text-teal-600">
                <span>Total Annual Return:</span>
                <span>£{results.totalAnnualReturn.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-b pb-2">
              <span>Startup Costs:</span>
              <span>£{results.totalStartupCosts.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between p-3 rounded-lg ${results.dealStacks ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'} col-span-2 mt-2`}>
              <span className="font-bold">Deal Stacks?</span>
              <span className="font-bold">{results.dealStacks ? '✅ Yes' : '❌ No'}</span>
            </div>
          </div>
        </section>

        {/* Section 3: Visual Summary */}
        <section>
          <h2 className="text-2xl font-semibold text-teal-700 border-b-2 border-teal-700 pb-2 mb-4">Visual Summary</h2>
          <div className="flex flex-wrap justify-around items-center gap-4">
            <div style={{ flex: '1 1 300px', height: 250, background: 'white', padding: '1rem' }} ref={chartRefs.yieldChartRef}>
              <h3 className="text-center font-semibold mb-2">Key Return Metrics (%)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: '1 1 300px', height: 250, background: 'white', padding: '1rem' }} ref={chartRefs.breakdownChartRef}>
              <h3 className="text-center font-semibold mb-2">Annual Financial Breakdown</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `£${Number(value).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
        <p>Report generated by Halal Deal Checker. All figures are estimates and for informational purposes only.</p>
        <p>For expert property management, visit <a href="https://www.property-intel.co.uk" className="text-teal-600 hover:underline">Property Intel</a>.</p>
      </footer>
    </div>
  );
};

export default ReportTemplate;
