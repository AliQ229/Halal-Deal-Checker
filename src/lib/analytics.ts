
interface AnalyticsData {
  financingMethods: { [key: string]: number };
  totalCalculations: number;
  lastUpdated: string;
}

const ANALYTICS_KEY = 'halal-property-analytics';

export const trackFinancingMethod = (method: string) => {
  try {
    const existing = localStorage.getItem(ANALYTICS_KEY);
    const data: AnalyticsData = existing 
      ? JSON.parse(existing)
      : { financingMethods: {}, totalCalculations: 0, lastUpdated: new Date().toISOString() };

    data.financingMethods[method] = (data.financingMethods[method] || 0) + 1;
    data.totalCalculations += 1;
    data.lastUpdated = new Date().toISOString();

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
    console.log('Analytics tracked:', method, data);
  } catch (error) {
    console.error('Failed to track analytics:', error);
  }
};

export const getAnalytics = (): AnalyticsData => {
  try {
    const existing = localStorage.getItem(ANALYTICS_KEY);
    return existing 
      ? JSON.parse(existing)
      : { financingMethods: {}, totalCalculations: 0, lastUpdated: new Date().toISOString() };
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return { financingMethods: {}, totalCalculations: 0, lastUpdated: new Date().toISOString() };
  }
};

export const clearAnalytics = () => {
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch (error) {
    console.error('Failed to clear analytics:', error);
  }
};
