import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import { getAnalytics, clearAnalytics } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";

export const AnalyticsDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const analytics = getAnalytics();

  const handleClearAnalytics = () => {
    clearAnalytics();
    toast({
      title: "Analytics cleared",
      description: "All usage data has been reset.",
    });
    setOpen(false);
  };

  const getMethodDisplayName = (method: string) => {
    const names: { [key: string]: string } = {
      'musharakah': 'Musharakah',
      'ijara': 'Ijara',
      'murabaha': 'Murabaha',
      'cash': 'Cash Purchase'
    };
    return names[method] || method;
  };

  const sortedMethods = Object.entries(analytics.financingMethods)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="text-slate-800 bg-white/80 border-white hover:bg-white dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 h-9 px-3 text-sm sm:text-base sm:h-10 sm:px-4"
        >
          <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-slate-800 dark:text-slate-200" />
          <span className="hidden sm:inline">Analytics</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-700">
            <BarChart3 className="w-5 h-5" />
            Usage Analytics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Calculations</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-emerald-600">
                  {analytics.totalCalculations}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Methods Used</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-teal-600">
                  {Object.keys(analytics.financingMethods).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {sortedMethods.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Popular Financing Methods
              </h4>
              
              {sortedMethods.map(([method, count]) => {
                const percentage = analytics.totalCalculations > 0 
                  ? (count / analytics.totalCalculations * 100).toFixed(1)
                  : '0';
                
                return (
                  <div key={method} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-800">
                        {getMethodDisplayName(method)}
                      </div>
                      <div className="text-sm text-slate-600">
                        {count} calculation{count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-600">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No calculations yet</p>
              <p className="text-sm">Analytics will appear after you perform calculations</p>
            </div>
          )}

          {analytics.totalCalculations > 0 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-xs text-slate-500">
                Last updated: {new Date(analytics.lastUpdated).toLocaleDateString()}
              </p>
              <Button 
                onClick={handleClearAnalytics}
                variant="ghost" 
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Clear Data
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
