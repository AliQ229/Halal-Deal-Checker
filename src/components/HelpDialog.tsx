import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Book, Calculator, Info, TrendingUp, Landmark, Percent, BarChart, DollarSign, Home, Scale, Clock } from "lucide-react";

type HelpSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

interface HelpDialogProps {
  children?: React.ReactNode;
}

export const HelpDialog = ({ children }: HelpDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  const financingMethods = [
    {
      name: "Musharakah (Bank Partnership)",
      description: "Traditional partnership where you and the bank jointly own the property. You share profits and losses according to ownership percentage. The bank typically provides 70-80% of the property value.",
      example: "You contribute 25% (£50k), bank contributes 75% (£150k). Rental income and capital gains are shared 75:25 with the bank."
    },
    {
      name: "Musharakah (Equity Crowdfunding)",
      description: "A form of partnership where multiple investors pool funds to collectively buy a property. Each investor owns a share proportional to their investment. No bank involvement.",
      example: "10 investors pool £20k each to buy a £200k property. Each owns 10% of the property and receives 10% of rental income and capital gains."
    },
    {
      name: "Ijara (Islamic Lease)",
      description: "Islamic lease-to-own arrangement. The bank owns the property and leases it to you with an option to purchase.",
      example: "Bank buys property for £200k, leases to you for £1,200/month. After 25 years, ownership transfers to you."
    },
    {
      name: "Murabaha (Cost Plus)",
      description: "Cost-plus financing where the bank purchases the property and sells it to you at an agreed markup.",
      example: "Bank buys property for £200k, sells to you for £300k payable over 25 years (£1,000/month)."
    }
  ];

  const keyTerms = [
    {
      term: "Gross Yield",
      definition: "Annual rental income divided by property value, expressed as a percentage. This helps compare properties regardless of price.",
      formula: "Gross Yield = (Annual Rent ÷ Property Value) × 100"
    },
    {
      term: "Net Yield",
      definition: "Annual profit (after all expenses) divided by property value. More accurate than gross yield as it includes all costs.",
      formula: "Net Yield = (Annual Profit ÷ Property Value) × 100"
    },
    {
      term: "Return on Cash",
      definition: "Annual profit divided by total cash invested. Shows the actual return on your investment.",
      formula: "Return on Cash = (Annual Profit ÷ Cash Invested) × 100"
    },
    {
      term: "Lender Coverage Ratio",
      definition: "Rental income divided by financing costs. Most lenders require 145% minimum to ensure loan repayment.",
      formula: "Coverage Ratio = (Monthly Rent × 12) ÷ Annual Finance Cost"
    },
    {
      term: "Cash Flow",
      definition: "Net income after all expenses and financing costs. Positive cash flow means the property generates income.",
      formula: "Cash Flow = Gross Rent - (Expenses + Finance Costs)"
    },
    {
      term: "Capital Growth",
      definition: "The increase in property value over time. A key component of total investment return.",
      formula: "Growth = (Current Value - Purchase Price) ÷ Purchase Price × 100"
    },
    {
      term: "Loan-to-Value (LTV)",
      definition: "The ratio of your loan to the property's value. Lower LTV means less risk for the lender.",
      formula: "LTV = (Loan Amount ÷ Property Value) × 100"
    },
    {
      term: "Debt Service Coverage Ratio (DSCR)",
      definition: "Measures cash flow available to pay debt. Lenders typically require 1.25x or higher.",
      formula: "DSCR = Net Operating Income ÷ Annual Debt Service"
    }
  ];

  const calculatorSections = [
    {
      title: "Getting Started",
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            The calculator helps you evaluate potential property investments according to Islamic finance principles. 
            Follow these steps to get accurate results.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Enter the property details (name, price)</li>
            <li>Input your financial information (deposit, income, expenses)</li>
            <li>Select your preferred financing method</li>
            <li>Review the results and adjust as needed</li>
          </ol>
        </div>
      )
    },
    {
      title: "Required Information",
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            For accurate results, you'll need the following information:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Property purchase price</li>
            <li>Estimated monthly rental income</li>
            <li>Purchase costs (legal fees, taxes, etc.)</li>
            <li>Your available deposit amount</li>
            <li>Monthly expenses (service charges, insurance, etc.)</li>
          </ul>
        </div>
      )
    },
    {
      title: "Understanding the Results",
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            The calculator provides several key metrics to help evaluate the investment:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Gross Yield:</strong> Annual rental income as a percentage of property value</li>
            <li><strong>Net Yield:</strong> Annual profit after all expenses as a percentage of property value</li>
            <li><strong>Monthly Cash Flow:</strong> Net income after all expenses and financing costs</li>
            <li><strong>Return on Investment (ROI):</strong> Annual return on your cash investment</li>
          </ul>
        </div>
      )
    },
    {
      title: "Saving Your Results",
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            While the calculator doesn't save your results automatically, you can:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Use the <strong>Export as PDF</strong> button to save as PDF</li>
            <li>Take a screenshot of your results</li>
            <li>Note down the key figures for your records</li>
          </ul>
        </div>
      )
    }
  ];

  // Tab content with accordion sections
  const tabContent = {
    calculator: {
      title: "Using the Calculator",
      icon: <Calculator className="w-4 h-4" />,
      sections: calculatorSections
    },
    financing: {
      title: "Financing Methods",
      icon: <Landmark className="w-4 h-4" />,
      sections: financingMethods.map((method, index) => ({
        title: method.name,
        content: (
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">{method.description}</p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-md">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Example:</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm">{method.example}</p>
            </div>
          </div>
        )
      }))
    },
    metrics: {
      title: "Investment Metrics",
      icon: <BarChart className="w-4 h-4" />,
      sections: keyTerms.map((term, index) => ({
        title: term.term,
        content: (
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">{term.definition}</p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-md">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Formula:</p>
              <code className="text-sm font-mono text-emerald-700 dark:text-emerald-300">
                {term.formula}
              </code>
            </div>
          </div>
        )
      }))
    },
    tips: {
      title: "Investment Tips",
      icon: <TrendingUp className="w-4 h-4" />,
      sections: [
        {
          title: "Location is Key",
          content: (
            <p className="text-slate-700 dark:text-slate-300">
              Choose areas with strong rental demand and growth potential. Look for good transport links, schools, and local amenities.
            </p>
          )
        },
        {
          title: "Calculate All Costs",
          content: (
            <p className="text-slate-700 dark:text-slate-300">
              Remember to factor in all costs: purchase costs, ongoing maintenance, service charges, and potential void periods.
            </p>
          )
        },
        {
          title: "Long-term Perspective",
          content: (
            <p className="text-slate-700 dark:text-slate-300">
              Property is a long-term investment. Focus on sustainable growth rather than short-term gains.
            </p>
          )
        }
      ]
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className="text-slate-800 bg-white/80 border-white hover:bg-white dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 h-9 px-3 text-sm sm:text-base sm:h-10 sm:px-4"
            onClick={() => setOpen(true)}
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-slate-800 dark:text-slate-200" />
            <span className="hidden sm:inline">Guide</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2 text-emerald-700 text-xl sm:text-2xl">
            <Book className="w-5 h-5 flex-shrink-0" />
            <span>Halal Property Investment Guide</span>
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-6 sm:px-6">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Learn about halal property investment methods and key metrics to evaluate potential deals.
          </p>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              {Object.entries({
                calculator: 'Calculator',
                financing: 'Financing',
                metrics: 'Metrics',
                tips: 'Tips'
              }).map(([key, label]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-center gap-2"
                >
                  {tabContent[key as keyof typeof tabContent].icon}
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(tabContent).map(([key, tab]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <Accordion type="multiple" className="w-full space-y-4">
                  {tab.sections.map((section, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${key}-${index}`} 
                      className="border rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {tab.icon}
                          </span>
                          <span className="font-semibold">{section.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2 bg-white/50 dark:bg-slate-800/30">
                        {section.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
