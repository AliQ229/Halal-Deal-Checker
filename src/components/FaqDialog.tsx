import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FaqDialogProps {
  children?: ReactNode;
}

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  faqs: FaqItem[];
};

export const FaqDialog = ({ children }: FaqDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  const faqCategories: FaqCategory[] = [
    {
      id: "calculator",
      name: "The Calculator",
      icon: <CalculatorIcon className="w-4 h-4" />,
      faqs: [
        {
          question: "How do I use this calculator?",
          answer: "Simply enter the relevant financial details, then click \"Calculate\" to view a tailored investment analysis. The tool is designed to help you evaluate deals through the lens of Islamic finance, factoring in profit-sharing, rent-to-own, and ethical considerations."
        },
        {
          question: "What information do I need to input?",
          answer: "You'll need property details such as price, income assumptions (rental income), and cost estimates (purchase costs, legal fees, taxes). If using financing, you should also include the terms of the Sharia-compliant structure."
        },
        {
          question: "Can I save my calculations?",
          answer: "Currently, your results aren't automatically saved. We recommend using the \"Export as PDF\" feature to keep a record."
        }
      ]
    },
    {
      id: "islamic-finance",
      name: "Islamic Finance",
      icon: <MosqueIcon className="w-4 h-4" />,
      faqs: [
        {
          question: "What makes a property investment halal?",
          answer: "A halal investment avoids riba (interest), excessive uncertainty (gharar), and unethical practices. It must follow Sharia principles, emphasising fairness, transparency, and real economic activity. Common structures include Musharakah (joint ownership), Ijara (leasing), and Murabaha (cost-plus resale). Each method avoids conventional interest-bearing debt and shares both risk and reward."
        },
        {
          question: "How does Musharakah work?",
          answer: "Musharakah is a partnership model where two or more parties co-invest in a property. This could involve individuals, Islamic banks, or crowdfunding platforms. One party may gradually buy out the other's share, often through rent payments or scheduled contributions. Profits are distributed based on ownership shares, and any losses are shared according to each party's capital contribution."
        },
        {
          question: "Is this tool Sharia-compliant?",
          answer: "Yes, the calculator is designed with Islamic finance principles in mind. It avoids conventional interest models and incorporates Islamic investment logic. However, for individual cases, we recommend consulting a qualified Islamic finance scholar or adviser."
        }
      ]
    },
    {
      id: "investing",
      name: "Investing",
      icon: <TrendingUpIcon className="w-4 h-4" />,
      faqs: [
        {
          question: "How is rental yield calculated?",
          answer: "Gross yield = (Annual Rent / Purchase Price) × 100\n\nNet yield = (Annual Rent – Annual Costs) / Purchase Price × 100\n\nNet yield gives a more realistic picture by accounting for maintenance, service charges, and management fees."
        },
        {
          question: "What costs should I consider when buying a property?",
          answer: "In addition to the purchase price, factor in:\n\n- Stamp Duty Land Tax (SDLT)\n- Legal and survey fees\n- Financing arrangement costs (if applicable)\n- Renovation or repair expenses\n- Property management or service charges\n\nThese affect your return and should be included in your initial analysis."
        },
        {
          question: "How often should I review my investment?",
          answer: "At a minimum, review your investment annually. You should also reassess when there are major changes like rent adjustments, large expenses, regulatory shifts, or changes in market conditions. Use the calculator to model different scenarios and maintain alignment with your financial and ethical goals."
        }
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className="text-slate-800 bg-white/80 border-white hover:bg-white dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 h-9 px-3 text-sm sm:text-base sm:h-10 sm:px-4"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-slate-800 dark:text-slate-200" />
            <span className="hidden sm:inline">FAQ</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="text-2xl font-bold text-center">Frequently Asked Questions</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue="calculator" 
          className="w-full px-4 sm:px-6 pb-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {faqCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline">{category.icon}</span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {faqCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <Accordion type="multiple" className="w-full">
                {category.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${category.id}-${index}`}>
                    <AccordionTrigger className="text-left text-emerald-700 dark:text-emerald-400 font-semibold text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-700 dark:text-slate-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Simple icon components
const CalculatorIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
  </svg>
);

const MosqueIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6.1 14.81c1.07-1.84 1.9-3.55 1.9-5.31 0-4.39 3.59-8 8-8s8 3.61 8 8c0 1.76.83 3.47 1.9 5.31" />
    <path d="M22 21c-4.5 0-6-4-10-4s-5.5 4-10 4" />
    <path d="M2 21h20" />
    <path d="M12 15a6.5 6.5 0 0 0 6.5-6.5v-1a2.5 2.5 0 0 0-5 0v1a1.5 1.5 0 0 1-3 0v-1a2.5 2.5 0 0 0-5 0v1A6.5 6.5 0 0 0 12 15Z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);
