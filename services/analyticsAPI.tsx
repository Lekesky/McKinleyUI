import createAPIClient from "./api";import { AxiosInstance } from "axios";

import createAPIClient from "./api";

/**

 * Types for API responses/**

 */ * Types for API responses

export type PeriodType = 'daily' | 'weekly' | 'monthly'; */

export type PeriodType = 'daily' | 'weekly' | 'monthly';

// Basic analytics summary

export interface AnalyticsSummary {// Basic analytics summary

  revenue: {export interface AnalyticsSummary {

    totalSales: number;  revenue: {

    netRevenue: number;    totalSales: number;

    comparison: {    netRevenue: number;

      percentage: number;    comparison: {

      period: string;      percentage: number;

    };      period: string;

  };    };

  orders: {  };

    count: number;  orders: {

    newCustomers: number;    count: number;

    comparison: {    newCustomers: number;

      orders: { percentage: number; period: string };    comparison: {

      customers: { percentage: number; period: string };      orders: { percentage: number; period: string };

    };      customers: { percentage: number; period: string };

  };    };

  averages: {  };

    orderValue: number;  averages: {

    fulfillmentTime: number;    orderValue: number;

    comparison: {    fulfillmentTime: number;

      orderValue: { percentage: number; period: string };    comparison: {

      fulfillmentTime: { percentage: number; period: string };      orderValue: { percentage: number; period: string };

    };      fulfillmentTime: { percentage: number; period: string };

  };    };

}  };

}

// Menu performance analytics

export interface MenuPerformance {// Menu performance analytics

  topItems: {export interface MenuPerformance {

    name: string;  topItems: {

    quantity: number;    name: string;

    revenue: number;    quantity: number;

  }[];    revenue: number;

  lowItems: {  }[];

    name: string;  lowItems: {

    quantity: number;    name: string;

    revenue: number;    quantity: number;

  }[];    revenue: number;

  periodLabel: string;  }[];

}  periodLabel: string;

}

// Order fulfillment analytics

export interface OrderFulfillment {// Order fulfillment analytics

  kitchenTime: {export interface OrderFulfillment {

    average: number;  kitchenTime: {

    comparison: { difference: number; period: string };    average: number;

  };    comparison: { difference: number; period: string };

  servingTime: {  };

    average: number;  servingTime: {

    comparison: { difference: number; period: string };    average: number;

  };    comparison: { difference: number; period: string };

  peakOrWaitTime: {  };

    value: number;  peakOrWaitTime: {

    label: string;    value: number;

    comparison: { difference: number; period: string };    label: string;

  };    comparison: { difference: number; period: string };

}  };

}

// Time-based sales analytics

export interface TimeSalesData {// Time-based sales analytics

  periods: {export interface TimeSalesData {

    label: string;  periods: {

    value: number;    label: string;

    percentage: number;    value: number;

  }[];    percentage: number;

  periodType: string;  }[];

}  periodType: string;

}

// Report analytics

export interface ReportsList {// Report analytics

  available: {export interface ReportsList {

    name: string;  available: {

    period: string;    name: string;

    url: string;    period: string;

    status: string;    url: string;

  }[];    status: string;

}  }[];

}

// Create API client

const api = createAPIClient();/**

 * Analytics API functions

/** */

 * Get revenue, orders and averages summaryclass AnalyticsAPI {

 * @param period - daily, weekly, or monthly  private apiClient: AxiosInstance;

 * @param date - specific date in YYYY-MM-DD format (optional)  

 */  constructor() {

export const getSummary = async (period: PeriodType, date?: string): Promise<AnalyticsSummary> => {    this.apiClient = createAPIClient();

  const params: any = { period };  }

  if (date) params.date = date;

    /**

  const response = await api.get('/analytics/summary', { params });   * Get revenue, orders and averages summary

  return response.data;   * @param period - daily, weekly, or monthly

};   * @param date - specific date in YYYY-MM-DD format (optional)

   */

/**  async getSummary(period: PeriodType, date?: string): Promise<AnalyticsSummary> {

 * Get menu performance analytics    const params: any = { period };

 * @param period - daily, weekly, or monthly    if (date) params.date = date;

 * @param date - specific date in YYYY-MM-DD format (optional)    

 * @param limit - maximum number of items to return (default: 5)    const response = await this.apiClient.get('/analytics/summary', { params });

 */    return response.data;

export const getMenuPerformance = async (period: PeriodType, date?: string, limit: number = 5): Promise<MenuPerformance> => {  }

  const params: any = { period, limit };

  if (date) params.date = date;  /**

     * Get menu performance analytics

  const response = await api.get('/analytics/menu-performance', { params });   * @param period - daily, weekly, or monthly

  return response.data;   * @param date - specific date in YYYY-MM-DD format (optional)

};   * @param limit - maximum number of items to return (default: 5)

   */

/**  async getMenuPerformance(period: PeriodType, date?: string, limit: number = 5): Promise<MenuPerformance> {

 * Get order fulfillment analytics    const params: any = { period, limit };

 * @param period - daily, weekly, or monthly    if (date) params.date = date;

 * @param date - specific date in YYYY-MM-DD format (optional)    

 */    const response = await this.apiClient.get('/analytics/menu-performance', { params });

export const getOrderFulfillment = async (period: PeriodType, date?: string): Promise<OrderFulfillment> => {    return response.data;

  const params: any = { period };  }

  if (date) params.date = date;

    /**

  const response = await api.get('/analytics/order-fulfillment', { params });   * Get order fulfillment analytics

  return response.data;   * @param period - daily, weekly, or monthly

};   * @param date - specific date in YYYY-MM-DD format (optional)

   */

/**  async getOrderFulfillment(period: PeriodType, date?: string): Promise<OrderFulfillment> {

 * Get time-based sales data (hourly, daily, or weekly)    const params: any = { period };

 * @param period - daily, weekly, or monthly    if (date) params.date = date;

 * @param date - specific date in YYYY-MM-DD format (optional)    

 * @param limit - maximum number of time periods to return    const response = await this.apiClient.get('/analytics/order-fulfillment', { params });

 */    return response.data;

export const getTimeSalesData = async (period: PeriodType, date?: string, limit: number = 3): Promise<TimeSalesData> => {  }

  const params: any = { period, limit };

  if (date) params.date = date;  /**

     * Get time-based sales data (hourly, daily, or weekly)

  const response = await api.get('/analytics/time-sales', { params });   * @param period - daily, weekly, or monthly

  return response.data;   * @param date - specific date in YYYY-MM-DD format (optional)

};   * @param limit - maximum number of time periods to return

   */

/**  async getTimeSalesData(period: PeriodType, date?: string, limit: number = 3): Promise<TimeSalesData> {

 * Get available analytics reports    const params: any = { period, limit };

 * @param limit - maximum number of reports to return    if (date) params.date = date;

 */    

export const getAvailableReports = async (limit: number = 5): Promise<ReportsList> => {    const response = await this.apiClient.get('/analytics/time-sales', { params });

  const response = await api.get('/analytics/reports', { params: { limit } });    return response.data;

  return response.data;  }

};

  /**

/**   * Get available analytics reports

 * Download a specific report   * @param limit - maximum number of reports to return

 * @param reportId - ID of the report to download   */

 * @returns URL to the report file  async getAvailableReports(limit: number = 5): Promise<ReportsList> {

 */    const response = await this.apiClient.get('/analytics/reports', { params: { limit } });

export const downloadReport = async (reportId: string): Promise<string> => {    return response.data;

  const response = await api.get(`/analytics/reports/${reportId}/download`);  }

  return response.data.url;

};  /**
   * Download a specific report
   * @param reportId - ID of the report to download
   * @returns URL to the report file
   */
  async downloadReport(reportId: string): Promise<string> {
    const response = await this.apiClient.get(`/analytics/reports/${reportId}/download`);
    return response.data.url;
  }
}

// Create and export a singleton instance
const analyticsAPI = new AnalyticsAPI();
export default analyticsAPI;