import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DealForm } from "@/components/DealForm";
import { ResultsCard } from "@/components/ResultsCard";
import { Header } from "@/components/Header";
import { DealInputs, DealResults } from "@/types/calculator";
import { trackFinancingMethod } from "@/lib/analytics";
import { QuoteCarousel } from "@/components/QuoteCarousel";
import { ExternalLink } from "lucide-react";

const Index = () => {
  const [results, setResults] = useState<DealResults | null>(null);
  const [inputs, setInputs] = useState<DealInputs | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [propertyName, setPropertyName] = useState("Untitled Property");

  const handleCalculate = (dealInputs: DealInputs, calculatedResults: DealResults, property: string) => {
    setInputs(dealInputs);
    setResults(calculatedResults);
    setPropertyName(property);
    setShowResults(true);
    
    // Track analytics
    trackFinancingMethod(dealInputs.financingMethod);
  };

  const handleReset = () => {
    setShowResults(false);
    setResults(null);
    setInputs(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
       <div 
        className="absolute inset-0 z-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(203 213 225 / 0.2)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          backgroundPosition: 'top left',
        }}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1),_transparent_40%)] z-0"></div>

      <div className="relative z-10">
        <Header 
          showBackButton={showResults} 
          onBackClick={handleReset}
        />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {!showResults ? (
              <>
                <Card className="p-4 sm:p-6 md:p-8 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mt-6">
                  <DealForm onCalculate={handleCalculate} />
                </Card>
                <QuoteCarousel />
              </>
            ) : (
              <ResultsCard 
                results={results!} 
                inputs={inputs!}
                onReset={handleReset}
                propertyName={propertyName}
              />
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-50 bg-transparent text-slate-600 dark:text-slate-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center relative z-50">
          <p className="font-medium relative z-50">
            Made by{' '}
            <a 
              href="https://property-intel.co.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 hover:underline relative z-50 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              Property Intel<ExternalLink className="inline-block w-3 h-3 ml-0.5 -mt-1" />
            </a>{' '}
            for the Muslim property investment community
          </p>
          <div className="text-xs text-slate-500 dark:text-slate-500 mt-3 max-w-md mx-auto relative z-50 space-y-2">
            <p>This is not financial advice, always consult with an industry expert. Always consult a qualified Islamic finance adviser.</p>
            <p>
              <a 
                href="#" 
                className="text-green-600 dark:text-green-400 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  // Open the help dialog with the risks section focused
                  const helpButton = document.querySelector('button[aria-label="Help & Guide"]') as HTMLButtonElement | null;
                  helpButton?.click();
                  // Small delay to ensure the dialog is open before focusing the tab
                  setTimeout(() => {
                    const tipsTab = document.querySelector('button[data-value="tips"]') as HTMLButtonElement | null;
                    if (tipsTab) {
                      tipsTab.click();
                      // Scroll to the risk management section
                      setTimeout(() => {
                        const riskSection = document.querySelector('h3:has(+ div .flex.items-start.gap-3:first-child)') as HTMLElement | null;
                        riskSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }
                  }, 100);
                }}
              >
                Click here to read about the risks of investing and how to protect your interests.
              </a>
            </p>
          </div>
          <p className="text-sm mt-4">
            <a 
              href="mailto:support@property-intel.co.uk?subject=Halal%20Property%20Investment%20Support" 
              className="text-green-600 dark:text-green-400 hover:underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "mailto:support@property-intel.co.uk?subject=Halal%20Property%20Investment%20Support";
              }}
            >
              Suggestions / Support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
