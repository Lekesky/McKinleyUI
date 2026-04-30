import { useAuth } from "@/context/AuthContext";
import createAPIClient from "@/services/api";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
import styles from "../../styles/AdminAnalytics.styles";

// Debounce utility function
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  const debouncedFn = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };

  debouncedFn.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debouncedFn;
};


export default function AdminAnalytics() {

    type OrderHistory = {
        id: string;
        customerId: string;
        customerFirstName: string;
        customerLastName: string;
        waitressFirstName: string;
        waitressLastName: string;
        tableNumber: number;
        menuItemIds: string[];
        status: string;
        paymentStatus: string;
        totalPrice: number;
        orderStartTime: string;
        orderEndTime: string;
    };

    type AnalyticsSummary = {
        revenue: {
            totalSales: number | null;            // gross sales for period
            totalSalesComparison?: {              // comparison for totalSales
            percentage: number;
            period: string;                     // e.g. "yesterday", "last week"
            } | null;
            netRevenue: number | null;            // net after costs/fees
            netRevenueComparison?: {              // comparison for netRevenue
            percentage: number;
            period: string;
            } | null;
        };
        orders: {
            count: number | null;                 // total orders for period
            comparison?: {                        // orders growth comparison
            percentage: number;
            period: string;
            } | null;
        };
        customers: {
            newUsers: number | null;              // newly created users in period
            comparison?: {
            percentage: number;
            period: string;
            } | null;
        };
        averages: {
            orderValue: number | null;            // totalSales / orders.count (uses totalSales)
            fulfillmentTimeMinutes: number | null;// avg order fulfillment in minutes
            comparison?: {
            orderValue?: { percentage:number; period:string } | null;
            fulfillmentTime?: { percentage:number; period:string } | null;
            } | null;
        };
    };

    type MenuPerformance = {
        periodLabel?: string | null;           // e.g. "Oct 2025" or "Oct 14-20, 2025"
        topItems: {
            itemId?: string | null;
            name: string | null;
            quantity: number | null;             // units sold in period
            revenue: number | null;              // revenue from item
        }[];
        lowItems: {
            itemId?: string | null;
            name: string | null;
            quantity: number | null;
            revenue: number | null;
        }[];
    };

    type TimeSalesData = {
        periodType: 'hourly' | 'daily' | 'weekly' | string;
        periodLabel: string;      // e.g. "Oct 24, 2025"
        periods: {
            label: string;        // e.g. "8:00 - 9:00", "Mon", "Week 2"
            value: number | null; // sales amount
            percentage: number | null; // growth vs previous equivalent bucket
            start: string;        // ISO timestamp for period start
            end: string;          // ISO timestamp for period end
        }[];
    };

    type ReportsList = {
        available: {
            id: string;
            name: string;        // e.g. "October 2025"
            period: string;      // e.g. "month", "week"
            status: 'current' | 'archived' | string;
            createdAt?: string;  // ISO date
        }[];
    };

    const api = useMemo(() => createAPIClient(), []);
    const { uid } = useAuth();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [activePeriod, setActivePeriod] = useState<number>(0); // 0: Today, 1: This Week, 2: This Month

    const { today, weekStart, weekEnd, weekAgo } = useMemo(() => {
        const today = new Date();
        // Calculate Sunday (start) and Saturday (end) of current week
        const currentDay = today.getDay();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - currentDay); // Get to Sunday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Get to Saturday
        // Calculate one week ago
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return { today, weekStart, weekEnd, weekAgo };
    }, []);

    // Analytics state
    const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
    const [menuPerformance, setMenuPerformance] = useState<MenuPerformance | null>(null);
    // orderFulfillment UI removed; keep state placeholder removed to avoid unused variable
    const [timeSalesData, setTimeSalesData] = useState<TimeSalesData | null>(null);
    const [reports] = useState<ReportsList | null>(null);
    
    // Analytics API functions
    const getSummary = useCallback((period: 'daily' | 'weekly' | 'monthly', date?: string) => {
        const params: any = { 
            uid,
            period
         };
        console.log("Fetching summary with params uid:", params.uid);
        if (date) params.date = date;
        
        return api.get('/analytics/summary', { params })
            .then((response) => {
                // Backend now returns { summary: { ... } }
                // Keep backwards compatibility if older shape (top-level fields) is returned.
                let data = response.data && response.data.summary ? response.data.summary : (response.data || {});

                // Backwards-compatibility: if backend still returns `revenue.comparison`,
                // map it to the new `totalSalesComparison` and `netRevenueComparison` fields.
                if (data.revenue && data.revenue.comparison && (!data.revenue.totalSalesComparison || !data.revenue.netRevenueComparison)) {
                    data.revenue.totalSalesComparison = data.revenue.totalSalesComparison || data.revenue.comparison;
                    data.revenue.netRevenueComparison = data.revenue.netRevenueComparison || data.revenue.comparison;
                }

                // Backwards-compatibility: if backend still provides orders.newCustomers
                // map it to customers.newUsers and orders.comparison.customers to customers.comparison
                if (!data.customers) data.customers = {};
                if ((data.orders && (data.orders as any).newCustomers) && (data.customers && (data.customers as any).newUsers == null)) {
                    (data.customers as any).newUsers = (data.orders as any).newCustomers;
                }
                if (data.orders && data.orders.comparison && (data.orders.comparison as any).customers && !(data.customers && (data.customers as any).comparison)) {
                    (data.customers as any).comparison = (data.orders.comparison as any).customers;
                }

                // Backwards-compatibility for averages.fulfillmentTime -> averages.fulfillmentTimeMinutes
                if (data.averages) {
                    if ((data.averages as any).fulfillmentTime != null && (data.averages as any).fulfillmentTimeMinutes == null) {
                        (data.averages as any).fulfillmentTimeMinutes = (data.averages as any).fulfillmentTime;
                    }
                }

                setAnalyticsSummary(data);
                return data;
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to fetch analytics summary';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch analytics summary',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
                return null;
            });
    }, [api, uid]);
    
    const getMenuPerformance = useCallback((period: 'daily' | 'weekly' | 'monthly', date?: string, limit: number = 5) => {
        const params: any = { uid, period, limit };
        if (date) params.date = date;
        return api.get('/analytics/menu-performance', { params })
            .then((response) => {
                // backend may return the payload directly or wrapped in { summary: { ... } }
                const data = response.data && response.data.summary ? response.data.summary : response.data;
                setMenuPerformance(data || null);
                return data;
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to fetch menu performance';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch menu performance',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
                return null;
            });
    }, [api, uid]);
    
    const getOrderFulfillment = useCallback((period: 'daily' | 'weekly' | 'monthly', date?: string) => {
        // Temporarily disabled: order fulfillment fetch
        // const params: any = { period };
        // if (date) params.date = date;
        // return api.get('/analytics/order-fulfillment', { params })
        //     .then((response) => {
        //         setOrderFulfillment(response.data);
        //         return response.data;
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching order fulfillment:', error);
        //         return null;
        //     });
        return Promise.resolve(null);
    }, []);
    
    const getTimeSalesData = useCallback((period: 'daily' | 'weekly' | 'monthly', startDate?: string, endDate?: string, limit: number = 3) => {
        let params: any = { uid, period, limit };

        if (period === 'weekly' && startDate) {
            // If a date is provided for weekly view, get that week's Sunday-Saturday
            const date = new Date(startDate);
            const day = date.getDay();
            
            // Get Sunday of that week
            const sunday = new Date(date);
            sunday.setDate(date.getDate() - day);
            
            // Get Saturday of that week
            const saturday = new Date(sunday);
            saturday.setDate(sunday.getDate() + 6);

            params.startTime = `${sunday.toISOString().split('T')[0]}T08:00:00`;
            params.endTime = `${saturday.toISOString().split('T')[0]}T17:00:00`;
        } else {
            // For daily view, just use the current date
            const currentDate = new Date().toISOString().split('T')[0];
            params.startTime = `${currentDate}T08:00:00`;
            params.endTime = `${currentDate}T17:00:00`;
        }
        
        return api.get('/analytics/time-sales', { params })
            .then((response) => {
                const data = response.data;
                setTimeSalesData(data);
                return data;
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to fetch time sales data';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch time sales data',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
                return null;
            });
    }, [api, uid]);
    
    const getAvailableReports = useCallback((limit: number = 5) => {
        // Temporarily disabled: reports fetch
        // return api.get('/analytics/reports', { params: { limit } })
        //     .then((response) => {
        //         setReports(response.data);
        //         return response.data;
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching reports:', error);
        //         return null;
        //     });
        return Promise.resolve(null);
    }, []);
    
    const downloadReport = useCallback((reportId: string) => {
        return api.get(`/analytics/reports/${reportId}/download`)
            .then((response) => {
                return response.data.url;
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to download report';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to download report',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
                return null;
            });
    }, [api]);

    // Consolidated fetch function for all analytics data
    const fetchAllAnalytics = useCallback(async (periodType: 'daily' | 'weekly' | 'monthly') => {
        try {
            await Promise.all([
                getSummary(periodType),
                getMenuPerformance(periodType),
                getOrderFulfillment(periodType),
                getTimeSalesData(periodType),
                getAvailableReports()
            ]);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        }
    }, [getSummary, getMenuPerformance, getOrderFulfillment, getTimeSalesData, getAvailableReports]);

    // Memoized debounced version of fetchAllAnalytics
    const debouncedFetchAnalytics = useMemo(
        () => debounce(fetchAllAnalytics, 300),
        [fetchAllAnalytics]
    );

    // Convert activePeriod index to API period type
    const getPeriodType = useCallback(() => {
        switch (activePeriod) {
            case 0: return 'daily';
            case 1: return 'weekly';
            case 2: return 'monthly';
            default: return 'daily';
        }
    }, [activePeriod]);

    // Fetch analytics data when period changes
    useEffect(() => {
        if (selectedIndex === 0) {
            const periodType = getPeriodType();
            debouncedFetchAnalytics(periodType);
        }
        
        // Cleanup function to cancel any pending debounced calls
        return () => {
            debouncedFetchAnalytics.cancel?.();
        };
    }, [selectedIndex, getPeriodType, debouncedFetchAnalytics]);


    return (
        <View style={styles.container}>
            <View style={styles.periodSelector}>
                <TouchableOpacity 
                    style={[styles.periodTab, activePeriod === 0 ? styles.periodTabActive : null]} 
                    onPress={() => setActivePeriod(0)}
                >
                    <Text style={activePeriod === 0 ? styles.periodTabTextActive : styles.periodTabText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.periodTab, activePeriod === 1 ? styles.periodTabActive : null]} 
                    onPress={() => setActivePeriod(1)}
                >
                    <Text style={activePeriod === 1 ? styles.periodTabTextActive : styles.periodTabText}>This Week</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.periodTab, activePeriod === 2 ? styles.periodTabActive : null]} 
                    onPress={() => setActivePeriod(2)}
                >
                    <Text style={activePeriod === 2 ? styles.periodTabTextActive : styles.periodTabText}>This Month</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}>
                <Text style={[styles.subtitle, {marginBottom: 10, fontSize: 18, fontWeight: '500'}]}>
                    {activePeriod === 0 && 'Daily Revenue '}
                    {activePeriod === 1 && 'Weekly Revenue '}
                    {activePeriod === 2 && 'Monthly Revenue '}
                    <Text style={styles.periodLabel}>
                        {activePeriod === 0 && '(Today)'}
                        {activePeriod === 1 && '(' + weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' - ' + weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ')'}
                        {activePeriod === 2 && '(' + today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ')'}
                    </Text>
                </Text>
                <View style={styles.dashboardContainer}>
                    <View style={styles.metricCard}>
                        <Icon source="currency-usd" size={28} color="#871919ff" />
                        <Text style={styles.metricValue}>
                            {analyticsSummary?.revenue?.totalSales != null ? 
                                `$${analyticsSummary.revenue.totalSales.toLocaleString()}` :
                                '–'
                            }
                        </Text>
                        <Text style={styles.metricLabel}>
                            {activePeriod === 0 && 'Daily Sales Revenue'}
                            {activePeriod === 1 && 'Weekly Sales Revenue'}
                            {activePeriod === 2 && 'Monthly Sales Revenue'}
                        </Text>
                        <Text style={styles.metricTrend}>
                            {analyticsSummary?.revenue?.totalSalesComparison != null ? 
                                `${analyticsSummary.revenue.totalSalesComparison.percentage > 0 ? '↑' : analyticsSummary.revenue.totalSalesComparison.percentage < 0 ? '↓' : '↔'} ${Math.abs(analyticsSummary.revenue.totalSalesComparison.percentage).toFixed(1)}% vs ${analyticsSummary.revenue.totalSalesComparison.period}` :
                                '–'
                            }
                        </Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Icon source="cash-multiple" size={28} color="#871919ff" />
                        <Text style={styles.metricValue}>
                            {analyticsSummary?.revenue?.netRevenue != null ? 
                                `$${analyticsSummary.revenue.netRevenue.toLocaleString()}` :
                                '–'
                            }
                        </Text>
                        <Text style={styles.metricLabel}>
                            {activePeriod === 0 && 'Daily Net Revenue'}
                            {activePeriod === 1 && 'Weekly Net Revenue'}
                            {activePeriod === 2 && 'Monthly Net Revenue'}
                        </Text>
                        <Text style={styles.metricTrend}>
                            {analyticsSummary?.revenue?.netRevenueComparison != null ? 
                                `${analyticsSummary.revenue.netRevenueComparison.percentage > 0 ? '↑' : analyticsSummary.revenue.netRevenueComparison.percentage < 0 ? '↓' : '↔'} ${Math.abs(analyticsSummary.revenue.netRevenueComparison.percentage).toFixed(1)}% vs ${analyticsSummary.revenue.netRevenueComparison.period}` :
                                '–'
                            }
                        </Text>
                    </View>
                </View>

                <View style={styles.dashboardContainer}>
                    <View style={styles.metricCard}>
                        <Icon source="receipt" size={28} color="#871919ff" />
                        <Text style={styles.metricValue}>
                            {analyticsSummary?.orders?.count != null ? 
                                analyticsSummary.orders.count.toLocaleString() :
                                '–'
                            }
                        </Text>
                        <Text style={styles.metricLabel}>
                            {activePeriod === 0 && 'Orders Today'}
                            {activePeriod === 1 && 'Orders This Week'}
                            {activePeriod === 2 && 'Orders This Month'}
                        </Text>
                        <Text style={styles.metricTrend}>
                            {analyticsSummary?.orders?.comparison ? 
                                `${analyticsSummary.orders.comparison.percentage > 0 ? '↑' : analyticsSummary.orders.comparison.percentage < 0 ? '↓' : '↔'} ${Math.abs(analyticsSummary.orders.comparison.percentage).toFixed(1)}% vs ${analyticsSummary.orders.comparison.period}` :
                                '–'
                            }
                        </Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Icon source="account-group" size={28} color="#871919ff" />
                        <Text style={styles.metricValue}>
                            {analyticsSummary?.customers?.newUsers != null ? 
                                analyticsSummary.customers.newUsers.toLocaleString() :
                                // backward compatibility: fall back to orders.newCustomers if backend hasn't migrated yet
                                ((analyticsSummary as any)?.orders?.newCustomers != null) ?
                                (analyticsSummary as any).orders.newCustomers.toLocaleString() :
                                '–'
                            }
                        </Text>
                        <Text style={styles.metricLabel}>
                            {activePeriod === 0 && 'New Customers Today'}
                            {activePeriod === 1 && 'New Customers This Week'}
                            {activePeriod === 2 && 'New Customers This Month'}
                        </Text>
                        <Text style={styles.metricTrend}>
                            {analyticsSummary?.customers?.comparison ? 
                                `${analyticsSummary.customers.comparison.percentage > 0 ? '↑' : analyticsSummary.customers.comparison.percentage < 0 ? '↓' : '↔'} ${Math.abs(analyticsSummary.customers.comparison.percentage).toFixed(1)}% vs ${analyticsSummary.customers.comparison.period}` :
                                ((analyticsSummary as any)?.orders?.comparison?.customers ?
                                `${(analyticsSummary as any).orders.comparison.customers.percentage > 0 ? '↑' : (analyticsSummary as any).orders.comparison.customers.percentage < 0 ? '↓' : '↔'} ${Math.abs((analyticsSummary as any).orders.comparison.customers.percentage).toFixed(1)}% vs ${(analyticsSummary as any).orders.comparison.customers.period}` :
                                '–')
                            }
                        </Text>
                    </View>
                </View>
                
                <Text style={[styles.subtitle, {marginBottom: 10, fontSize: 16, fontWeight: '500', marginTop: 15}]}>
                    {activePeriod === 0 && 'Hourly Metrics '}
                    {activePeriod === 1 && 'Daily Averages '}
                    {activePeriod === 2 && 'Monthly Averages '}
                    <Text style={styles.periodLabel}>
                        {activePeriod === 0 && '(Today)'}
                        {activePeriod === 1 && '(This Week)'}
                        {activePeriod === 2 && '(This Month)'}
                    </Text>
                </Text>
                <View style={styles.dashboardContainer}>
                    <View style={styles.metricCard}>
                        <Icon source="basket" size={28} color="#871919ff" />
                        <Text style={styles.metricValue}>
                            {(analyticsSummary?.averages?.orderValue != null)  ? 
                                `$${analyticsSummary!.averages!.orderValue!.toFixed(2)}` :
                                '–'
                            }
                        </Text>
                        <Text style={styles.metricLabel}>Avg. Order Value</Text>
                        <Text style={styles.metricTrend}>
                            {analyticsSummary?.averages?.comparison?.orderValue ? 
                                `${analyticsSummary.averages.comparison.orderValue.percentage > 0 ? '↑' : '↓'} ${Math.abs(analyticsSummary.averages.comparison.orderValue.percentage).toFixed(1)}% vs ${analyticsSummary.averages.comparison.orderValue.period}` :
                                '–'
                            }
                        </Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Icon source="timer" size={28} color="#871919ff" />
                        <Text style={styles.metricValue}>
                            {analyticsSummary?.averages?.fulfillmentTimeMinutes != null ? 
                                `${analyticsSummary.averages.fulfillmentTimeMinutes} min` :
                                '–'
                            }
                        </Text>
                        <Text style={styles.metricLabel}>Avg. Fulfill Time</Text>
                        <Text style={[
                            styles.metricTrend, 
                            {color: analyticsSummary?.averages?.comparison?.fulfillmentTime?.percentage != null ? 
                                    (analyticsSummary.averages.comparison.fulfillmentTime.percentage < 0 ? '#4CAF50' : 
                                        analyticsSummary.averages.comparison.fulfillmentTime.percentage > 0 ? '#F44336' : 
                                        '#9E9E9E') : '#9E9E9E'}
                        ]}>
                            {analyticsSummary?.averages?.comparison?.fulfillmentTime ? 
                                `${analyticsSummary.averages.comparison.fulfillmentTime.percentage < 0 ? '↓' : analyticsSummary.averages.comparison.fulfillmentTime.percentage > 0 ? '↑' : '↔'} ${Math.abs(analyticsSummary.averages.comparison.fulfillmentTime.percentage).toFixed(1)}% vs ${analyticsSummary.averages.comparison.fulfillmentTime.period}` :
                                '–'
                            }
                        </Text>
                    </View>
                </View>
                
                <Text style={[styles.subtitle, {marginBottom: 10, marginTop: 15, fontSize: 18, fontWeight: '500'}]}>
                    Menu Performance <Text style={styles.periodLabel}>
                        {activePeriod === 0 && '(Today)'}
                        {activePeriod === 1 && '(This Week)'}
                        {activePeriod === 2 && '(This Month)'}
                    </Text>
                </Text>
                
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon source="star" size={24} color="#871919ff" />
                        <Text style={styles.cardTitle}>Top Selling Items</Text>
                        <Text style={styles.cardPeriod}>
                            {menuPerformance?.periodLabel || 
                                (activePeriod === 0 ? today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) :
                                activePeriod === 1 ? weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + " - " + weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) :
                                today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))}
                        </Text>
                    </View>
                    <View style={styles.menuItemAnalytics}>
                        <View style={styles.menuItemAnalyticsHeader}>
                            <Text style={[styles.menuItemAnalyticsName, {color: '#666'}]}>Item</Text>
                            <Text style={[styles.menuItemCount, {color: '#666'}]}>Quantity</Text>
                            <Text style={[styles.menuItemRevenue, {color: '#666'}]}>Revenue</Text>
                        </View>
                        {menuPerformance?.topItems && menuPerformance.topItems.length > 0 ? (
                            <>
                                {menuPerformance.topItems.map((item, index) => (
                                    <View key={index} style={styles.menuItemAnalyticsRow}>
                                        <Text style={styles.menuItemAnalyticsName}>{item.name || '–'}</Text>
                                        <Text style={styles.menuItemCount}>
                                            {item.quantity != null ? 
                                                `${item.quantity} ${item.quantity === 1 ? 'order' : 'orders'}` : '–'}
                                        </Text>
                                        <Text style={styles.menuItemRevenue}>
                                            {item.revenue != null ? `$${item.revenue.toLocaleString()}` : '–'}
                                        </Text>
                                    </View>
                                ))}
                            </>
                        ) : (
                            <View style={styles.menuItemAnalyticsRow}>
                                <Text style={[styles.menuItemAnalyticsName, {color: '#999'}]}>–</Text>
                                <Text style={[styles.menuItemCount, {color: '#999'}]}>–</Text>
                                <Text style={[styles.menuItemRevenue, {color: '#999'}]}>–</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity style={styles.buttonSecondary}>
                        <Text style={styles.buttonTextSecondary}>View All Items</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon source="alert" size={24} color="#871919ff" />
                        <Text style={styles.cardTitle}>Low Performing Items</Text>
                        <Text style={styles.cardPeriod}>
                            {menuPerformance?.periodLabel || 
                                (activePeriod === 0 ? today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) :
                                activePeriod === 1 ? weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + " - " + weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) :
                                today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))}
                        </Text>
                    </View>
                    <View style={styles.menuItemAnalytics}>
                        <View style={styles.menuItemAnalyticsHeader}>
                            <Text style={[styles.menuItemAnalyticsName, {color: '#666'}]}>Item</Text>
                            <Text style={[styles.menuItemCount, {color: '#666'}]}>Quantity</Text>
                            <Text style={[styles.menuItemRevenue, {color: '#666'}]}>Revenue</Text>
                        </View>
                        {menuPerformance?.lowItems && menuPerformance.lowItems.length > 0 ? (
                            <>
                                {menuPerformance.lowItems.map((item, index) => (
                                    <View key={index} style={styles.menuItemAnalyticsRow}>
                                        <Text style={styles.menuItemAnalyticsName}>{item.name || '–'}</Text>
                                        <Text style={styles.menuItemCount}>
                                            {item.quantity != null ? 
                                                `${item.quantity} ${item.quantity === 1 ? 'order' : 'orders'}` : '–'}
                                        </Text>
                                        <Text style={styles.menuItemRevenue}>
                                            {item.revenue != null ? `$${item.revenue.toLocaleString()}` : '–'}
                                        </Text>
                                    </View>
                                ))}
                            </>
                        ) : (
                            <View style={styles.menuItemAnalyticsRow}>
                                <Text style={[styles.menuItemAnalyticsName, {color: '#999'}]}>–</Text>
                                <Text style={[styles.menuItemCount, {color: '#999'}]}>–</Text>
                                <Text style={[styles.menuItemRevenue, {color: '#999'}]}>–</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity style={styles.buttonSecondary}>
                        <Text style={styles.buttonTextSecondary}>View All Items</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.subtitle, {marginBottom: 10, marginTop: 15, fontSize: 18, fontWeight: '500'}]}>
                    {activePeriod === 0 && 'Daily Insights '}
                    {activePeriod === 1 && 'Weekly Insights '}
                    {activePeriod === 2 && 'Monthly Insights '}
                    <Text style={styles.periodLabel}>
                        {activePeriod === 0 && '(Today)'} 
                        {activePeriod === 1 && '( ' + today.toLocaleDateString('en-US', { month: 'short'}) + " " + weekAgo.toLocaleDateString('en-US', { day: 'numeric'}) + " - " + today.toLocaleDateString('en-US', { day: 'numeric'}) + ", "  + today.toLocaleDateString('en-US', { year: 'numeric' }) + ' )'}
                        {activePeriod === 2 && '( ' + today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' )'}
                    </Text>
                </Text>
                
                
                
                <View style={[styles.card, {marginBottom: 15}]}>
                    <View style={styles.cardHeader}>
                        {activePeriod === 0 && <Icon source="clock" size={24} color="#871919ff" />}
                        {activePeriod === 1 && <Icon source="calendar-week" size={24} color="#871919ff" />}
                        {activePeriod === 2 && <Icon source="calendar-month" size={24} color="#871919ff" />}
                        <Text style={styles.cardTitle}>
                            {activePeriod === 0 && 'Sales By Hour'}
                            {activePeriod === 1 && 'Sales By Day'}
                            {activePeriod === 2 && 'Sales By Week'}
                        </Text>
                        <Text style={styles.cardPeriod}>
                            {timeSalesData?.periodLabel || (
                                <>
                                    {activePeriod === 0 && today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    {activePeriod === 1 && weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + " - " + weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    {activePeriod === 2 && today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </>
                            )}
                        </Text>
                    </View> 
                    {timeSalesData && activePeriod === 0 ? (
                        <View style={styles.analyticsRow}>
                            {timeSalesData.periods && timeSalesData.periods.length > 0 ? 
                                timeSalesData.periods.map((period, index) => (
                                    <View key={index} style={styles.analyticsItem}>
                                        <Text style={styles.analyticsValue}>
                                            {period.value != null ? `$${period.value.toLocaleString()}` : '–'}
                                        </Text>
                                        <Text style={styles.analyticsLabel}>{period.label || '–'}</Text>
                                        <Text style={[styles.metricTrend, {fontSize: 12}]}>
                                            {period.percentage != null ? 
                                                `${period.percentage >= 0 ? '↑' : '↓'} ${Math.abs(period.percentage).toFixed(1)}%` : 
                                                '–'}
                                        </Text>
                                    </View>
                                )) : (
                                    <>
                                        <View style={styles.analyticsItem}>
                                            <Text style={styles.analyticsValue}>$512</Text>
                                            <Text style={styles.analyticsLabel}>12-2 PM</Text>
                                            <Text style={[styles.metricTrend, {fontSize: 12}]}>↑ 8.2%</Text>
                                        </View>
                                        <View style={styles.analyticsItem}>
                                            <Text style={styles.analyticsValue}>$385</Text>
                                            <Text style={styles.analyticsLabel}>2-4 PM</Text>
                                            <Text style={[styles.metricTrend, {fontSize: 12}]}>↑ 4.5%</Text>
                                        </View>
                                        <View style={styles.analyticsItem}>
                                            <Text style={styles.analyticsValue}>$453</Text>
                                            <Text style={styles.analyticsLabel}>4-6 PM</Text>
                                            <Text style={[styles.metricTrend, {fontSize: 12}]}>↑ 6.7%</Text>
                                        </View>
                                    </>
                                )
                            }
                        </View>
                    ) : timeSalesData === null && activePeriod === 0 ? (
                        <View style={styles.analyticsRow}>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>12-2 PM</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>2-4 PM</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>4-6 PM</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.analyticsRow}>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>12-2 PM</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>2-4 PM</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>4-6 PM</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                        </View>
                    )}
                    {timeSalesData && activePeriod === 1 ? (
                        <View style={styles.analyticsRow}>
                            {timeSalesData.periods && timeSalesData.periods.length > 0 ? 
                                timeSalesData.periods.map((period, index) => (
                                    <View key={index} style={styles.analyticsItem}>
                                        <Text style={styles.analyticsValue}>
                                            {period.value != null ? `$${period.value.toLocaleString()}` : '–'}
                                        </Text>
                                        <Text style={styles.analyticsLabel}>{period.label || '–'}</Text>
                                        <Text style={[styles.metricTrend, {fontSize: 12}]}>
                                            {period.percentage != null ? 
                                                `${period.percentage >= 0 ? '↑' : '↓'} ${Math.abs(period.percentage).toFixed(1)}%` : 
                                                '–'}
                                        </Text>
                                    </View>
                                )) : (
                                    <>
                                        <View style={styles.analyticsItem}>
                                            <Text style={styles.analyticsValue}>$1,842</Text>
                                            <Text style={styles.analyticsLabel}>Saturday</Text>
                                            <Text style={[styles.metricTrend, {fontSize: 12}]}>↑ 5.3%</Text>
                                        </View>
                                        <View style={styles.analyticsItem}>
                                            <Text style={styles.analyticsValue}>$1,625</Text>
                                            <Text style={styles.analyticsLabel}>Friday</Text>
                                            <Text style={[styles.metricTrend, {fontSize: 12}]}>↑ 3.7%</Text>
                                        </View>
                                        <View style={styles.analyticsItem}>
                                            <Text style={styles.analyticsValue}>$1,213</Text>
                                            <Text style={styles.analyticsLabel}>Sunday</Text>
                                            <Text style={[styles.metricTrend, {fontSize: 12}]}>↑ 2.1%</Text>
                                        </View>
                                    </>
                                )
                            }
                        </View>
                    ) : timeSalesData === null && activePeriod === 1 ? (
                        <View style={styles.analyticsRow}>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Saturday</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Friday</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Sunday</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                        </View>
                    ) : activePeriod === 1 && (
                        <View style={styles.analyticsRow}>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Saturday</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Friday</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Sunday</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                        </View>
                    )}
                    {timeSalesData && activePeriod === 2 ? (
                        <View style={styles.analyticsRow}>
                            {timeSalesData.periods && timeSalesData.periods.length > 0 ? 
                                timeSalesData.periods.map((period, index) => (
                                    <View key={index} style={styles.analyticsItem}>
                                        <Text style={styles.analyticsValue}>
                                            {period.value != null ? `$${period.value.toLocaleString()}` : '–'}
                                        </Text>
                                        <Text style={styles.analyticsLabel}>{period.label || '–'}</Text>
                                        <Text style={[styles.metricTrend, {fontSize: 12}]}>
                                            {period.percentage != null ? 
                                                `${period.percentage >= 0 ? '↑' : '↓'} ${Math.abs(period.percentage).toFixed(1)}%` : 
                                                '–'}
                                        </Text>
                                    </View>
                                )) : (
                                    <>
                                        <View style={styles.analyticsItem}>
                                            <Text style={styles.analyticsValue}>$3,850</Text>
                                            <Text style={styles.analyticsLabel}>Week 3</Text>
                                            <Text style={[styles.metricTrend, {fontSize: 12}]}>↑ 7.2%</Text>
                                        </View>
                                        <View style={styles.analyticsItem}>
                                            <Text style={styles.analyticsValue}>$3,425</Text>
                                            <Text style={styles.analyticsLabel}>Week 2</Text>
                                            <Text style={[styles.metricTrend, {fontSize: 12}]}>↑ 4.8%</Text>
                                        </View>
                                        <View style={styles.analyticsItem}>
                                            <Text style={styles.analyticsValue}>$2,980</Text>
                                            <Text style={styles.analyticsLabel}>Week 1</Text>
                                            <Text style={[styles.metricTrend, {fontSize: 12}]}>↑ 3.1%</Text>
                                        </View>
                                    </>
                                )
                            }
                        </View>
                    ) : timeSalesData === null && activePeriod === 2 ? (
                        <View style={styles.analyticsRow}>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Week 3</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Week 2</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Week 1</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.analyticsRow}>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Week 3</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Week 2</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                            <View style={styles.analyticsItem}>
                                <Text style={[styles.analyticsValue, {color: '#999'}]}>–</Text>
                                <Text style={styles.analyticsLabel}>Week 1</Text>
                                <Text style={[styles.metricTrend, {fontSize: 12, color: '#999'}]}>–</Text>
                            </View>
                        </View>
                    )}
                </View>
                
                <Text style={[styles.subtitle, {marginBottom: 10, marginTop: 15, fontSize: 18, fontWeight: '500'}]}>Monthly Reports</Text>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Icon source="file-document-outline" size={24} color="#871919ff" />
                        <Text style={styles.cardTitle}>PDF Reports</Text>
                        <Text style={styles.cardPeriod}>Available Reports</Text>
                    </View>
                    <Text style={{fontSize: 14, color: '#666', marginBottom: 15}}>Download detailed monthly performance reports:</Text>
                    
                    <View style={styles.reportsContainer}>
                        {reports?.available && reports.available.length > 0 ? (
                            <>
                                {reports.available.map((report, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={styles.reportButton}
                                        onPress={() => downloadReport(report.id)}
                                    >
                                        <Icon source="file-pdf-box" size={22} color="#871919ff" />
                                        <Text style={styles.reportButtonText}>{report.name || '–'}</Text>
                                        <Text style={{
                                            fontSize: 12, 
                                            color: report.status === 'current' ? '#4CAF50' : '#777', 
                                            marginTop: 4
                                        }}>
                                            {report.period || '–'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity style={[styles.reportButton, {backgroundColor: '#eee', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc'}]}>
                                    <Icon source="folder-outline" size={22} color="#555" />
                                    <Text style={[styles.reportButtonText, {color: '#555'}]}>View All Reports</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={{alignItems: 'center', padding: 20, width: '100%'}}>
                                <Text style={{fontSize: 16, color: '#999', textAlign: 'center',}}>– Coming Soon –</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

