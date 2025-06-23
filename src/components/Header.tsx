import { Button } from "@/components/ui/button";
import { HelpDialog } from "./HelpDialog";
import { AnalyticsDialog } from "./AnalyticsDialog";
import { FaqDialog } from "./FaqDialog";
import { ThemeToggle } from "./ThemeToggle";
import { Calculator, Home } from "lucide-react";

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export const Header = ({ showBackButton, onBackClick }: HeaderProps) => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white rotate-45 transform -translate-x-16 -translate-y-16"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-2 border-white rotate-45 transform translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-1/3 w-20 h-20 border-2 border-white rotate-45 transform translate-y-10"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
          {showBackButton ? (
            <Button 
              variant="ghost" 
              onClick={onBackClick}
              className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-4"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="truncate">New Calculation</span>
            </Button>
          ) : (
            <div className="w-0 sm:w-auto"></div>
          )}
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="scale-90 sm:scale-100">
              <HelpDialog />
            </div>
            <div className="scale-90 sm:scale-100">
              <AnalyticsDialog />
            </div>
            <div className="scale-90 sm:scale-100">
              <FaqDialog />
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="text-center px-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Calculator className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Halal Property Calculator
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-emerald-100 dark:text-emerald-200">
            Built by Muslim investors, for Muslim investors
          </p>
        </div>
      </div>
    </header>
  );
};
