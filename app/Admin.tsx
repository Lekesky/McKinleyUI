import OrderHistoryCard from '@/components/OrderHistoryCard';
import ViewControl from "@/components/ViewSwitch";
import { useAuth } from "@/context/AuthContext";
import { useTabBar } from "@/context/TabBarContext";
import createAPIClient from "@/services/api";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text, TextInput } from 'react-native-paper';
export default function Admin(){

    // Define the type for staff members
    type Users = {
        uid: string;
        firstName: string;
        lastName: string;
        userRole: string;
    };
    // Define the type for products
    type MenuItems = {
        id: string;
        name: string;
        description: string;
        price: number;
        imageURL: string;
    };

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
    }
    const api = useMemo(() => createAPIClient(), []);
    const { uid } = useAuth();
    const { hideTabBar, showTabBar } = useTabBar();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [activePeriod, setActivePeriod] = useState<number>(0); // 0: Today, 1: This Week, 2: This Month
    const [productSearch, setProductSearch] = useState<string>("");
    const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
    const [staff, setStaff] = useState<Users[] | null>([]);
    const [customers, setCustomers] = useState<Users[] | null>([]);
    
    // Define Analytics types
    type AnalyticsSummary = {
        revenue: {
            totalSales: number;
            netRevenue: number;
            comparison: {
                percentage: number;
                period: string;
            };
        };
        orders: {
            count: number;
            newCustomers: number;
            comparison: {
                orders: { percentage: number; period: string };
                customers: { percentage: number; period: string };
            };
        };
        averages: {
            orderValue: number;
            fulfillmentTime: number;
            comparison: {
                orderValue: { percentage: number; period: string };
                fulfillmentTime: { percentage: number; period: string };
            };
        };
    };

    type MenuPerformance = {
        topItems: {
            name: string;
            quantity: number;
            revenue: number;
        }[];
        lowItems: {
            name: string;
            quantity: number;
            revenue: number;
        }[];
        periodLabel: string;
    };

    type OrderFulfillment = {
        kitchenTime: {
            average: number;
            comparison: { difference: number; period: string };
        };
        servingTime: {
            average: number;
            comparison: { difference: number; period: string };
        };
        peakOrWaitTime: {
            value: number;
            label: string;
            comparison: { difference: number; period: string };
        };
    };

    type TimeSalesData = {
        periods: {
            label: string;
            value: number;
            percentage: number;
        }[];
        periodType: string;
    };

    type ReportsList = {
        available: {
            name: string;
            period: string;
            url: string;
            status: string;
        }[];
    };

    const dates = () => {
        const today = new Date();
        const weekAgo = new Date(today)
        weekAgo.setDate(today.getDate() - 7);
        return { today, weekAgo };
    }

    const { today, weekAgo } = dates();

    // Analytics state
    const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
    const [menuPerformance, setMenuPerformance] = useState<MenuPerformance | null>(null);
    const [orderFulfillment, setOrderFulfillment] = useState<OrderFulfillment | null>(null);
    const [timeSalesData, setTimeSalesData] = useState<TimeSalesData | null>(null);
    const [reports, setReports] = useState<ReportsList | null>(null);
    
    // Analytics API functions
    const getSummary = useCallback((period: 'daily' | 'weekly' | 'monthly', date?: string) => {
        const params: any = { period };
        if (date) params.date = date;
        
        return api.get('/analytics/summary', { params })
            .then((response) => {
                setAnalyticsSummary(response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching analytics summary:', error);
                return null;
            });
    }, [api]);
    
    const getMenuPerformance = useCallback((period: 'daily' | 'weekly' | 'monthly', date?: string, limit: number = 5) => {
        const params: any = { period, limit };
        if (date) params.date = date;
        
        return api.get('/analytics/menu-performance', { params })
            .then((response) => {
                setMenuPerformance(response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching menu performance:', error);
                return null;
            });
    }, [api]);
    
    const getOrderFulfillment = useCallback((period: 'daily' | 'weekly' | 'monthly', date?: string) => {
        const params: any = { period };
        if (date) params.date = date;
        
        return api.get('/analytics/order-fulfillment', { params })
            .then((response) => {
                setOrderFulfillment(response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching order fulfillment:', error);
                return null;
            });
    }, [api]);
    
    const getTimeSalesData = useCallback((period: 'daily' | 'weekly' | 'monthly', date?: string, limit: number = 3) => {
        const params: any = { period, limit };
        if (date) params.date = date;
        
        return api.get('/analytics/time-sales', { params })
            .then((response) => {
                setTimeSalesData(response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching time sales data:', error);
                return null;
            });
    }, [api]);
    
    const getAvailableReports = useCallback((limit: number = 5) => {
        return api.get('/analytics/reports', { params: { limit } })
            .then((response) => {
                setReports(response.data);
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching reports:', error);
                return null;
            });
    }, [api]);
    
    const downloadReport = useCallback((reportId: string) => {
        return api.get(`/analytics/reports/${reportId}/download`)
            .then((response) => {
                return response.data.url;
            })
            .catch((error) => {
                console.error('Error downloading report:', error);
                return null;
            });
    }, [api]);
    // Fetch menu items, staff, and customers on mount

    const handleOrderHistory = useCallback(() => {
        api.get('/orders')
            .then((response) => {
                setOrderHistory(response.data || []);
            })
            .catch((error) => {
                console.error('Error fetching order history:', error);
            })
            .finally(() => {
                setRefreshing(false);
            });
    }, [api]);

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
            getSummary(periodType);
            getMenuPerformance(periodType);
            getOrderFulfillment(periodType);
            getTimeSalesData(periodType);
            getAvailableReports();
        }
    }, [activePeriod, selectedIndex, getSummary, getMenuPerformance, getOrderFulfillment, getTimeSalesData, getAvailableReports, getPeriodType, today, weekAgo]);

    useEffect(() => {
        // Fetch menu items
        api.get('menu')
            .then((response) => {
                setMenuItems(response.data || []);
            })
            .catch((error) => {
                console.error('Error fetching menu items:', error);
            });

        // Fetch staff
        api.get('user/staff')
            .then((response) => {
                setStaff(response.data || []);
            })
            .catch((error) => {
                console.error('Error fetching staff:', error);
            });

        // Fetch customers
        api.get('user/customers')
            .then((response) => {
                setCustomers(response.data || []);
            })
            .catch((error) => {
                console.error('Error fetching customers:', error);
            });

        handleOrderHistory();

        // Only fetch analytics data if on analytics tab
        if (selectedIndex === 0) {
            const periodType = getPeriodType();
            getSummary(periodType);
            getMenuPerformance(periodType);
            getOrderFulfillment(periodType);
            getTimeSalesData(periodType);
            getAvailableReports();
        }
    }, [api, handleOrderHistory, selectedIndex, getSummary, getMenuPerformance, getOrderFulfillment, getTimeSalesData, getAvailableReports, getPeriodType]);

    const [userSearch, setUserSearch] = useState<string>('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    // Handler to dismiss dropdown
    const dismissDropdown = () => {
        setDropdownVisible(false);
        showTabBar();
    };

    // Filtered users for dropdown
    const filteredUsers = useMemo(() => {
        if (!userSearch || !staff) return [];
        const searchLower = userSearch.toLowerCase();
        return staff.filter(user =>
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower)
        );
    }, [userSearch, staff]);
    

    return (
        <View style={styles.container}>
            {/* Header and controls fixed at top */}
            <View style={{ backgroundColor: '#ffffffff', zIndex: 10 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                </View>
                <ViewControl
                    values={["Analytics", "Members", "Menu", "Order History"]}
                    selectedIndex={selectedIndex}
                    onChange={setSelectedIndex}
                    width={340}
                    height={45}
                    activeColor="#ffffff"
                    inactiveColor="#e8e8e8ff"
                    activeTextColor="#000"
                    textColor="#333"
                    borderRadius={20}
                    containerStyle={{ alignSelf: "center", marginVertical: 20, marginHorizontal: 10 }}
                />
                {/* Top controls for each tab */}
                {selectedIndex === 1 && (
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={styles.subtitle}>Search Users:</Text>
                        <TextInput
                            label="Search for user"
                            value={userSearch}
                            onChangeText={text => {
                                setUserSearch(text);
                                setDropdownVisible(true);
                                hideTabBar();
                            }}
                            mode="outlined"
                            style={styles.textInput}
                            outlineStyle={styles.textInputOutline}
                        />
                    </View>
                )}
                {selectedIndex === 2 && (
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={styles.subtitle}>Menu Items:</Text>
                        <TextInput
                            label="Search for product"
                            value={productSearch}
                            onChangeText={setProductSearch}
                            mode="outlined"
                            style={styles.textInput}
                            outlineStyle={styles.textInputOutline}
                            placeholder="Search by name"
                        />
                        <TouchableOpacity
                            style={styles.buttonPrimary}
                            onPress={() =>
                                router.push({
                                    pathname: '/EditProduct',
                                    params: { 
                                        product: JSON.stringify({ 
                                            id: '', name: '', description: '', price: 0, imageURL: '' 
                                        }) 
                                    },
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Add New Menu Item</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {selectedIndex === 3 && (
                    <View style={{ paddingBottom: 10 }}>
                        <Text style={styles.subtitle}>Order History:</Text>
                        <TextInput
                            label="Search orders"
                            value={productSearch}
                            onChangeText={setProductSearch}
                            mode="outlined"
                            style={styles.textInput}
                            outlineStyle={styles.textInputOutline}
                            placeholder="Search by customer, waitress, or order ID"
                        />
                    </View>
                )}
            </View>
            {/* Scrollable content only */}
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }} onTouchStart={dismissDropdown}>
                    {selectedIndex === 0 && (
                        <View>
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
                            
                            <Text style={[styles.subtitle, {marginBottom: 10, fontSize: 18, fontWeight: '500'}]}>
                                {activePeriod === 0 && 'Daily Revenue '}
                                {activePeriod === 1 && 'Weekly Revenue '}
                                {activePeriod === 2 && 'Monthly Revenue '}
                                <Text style={styles.periodLabel}>
                                    {activePeriod === 0 && '(Today)'}
                                    {activePeriod === 1 && '(' + weekAgo.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' - ' + today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ')'}
                                    {activePeriod === 2 && '(' + today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ')'}
                                </Text>
                            </Text>
                            <View style={styles.dashboardContainer}>
                                <View style={styles.metricCard}>
                                    <Icon source="currency-usd" size={28} color="#871919ff" />
                                    <Text style={styles.metricValue}>
                                        {analyticsSummary?.revenue?.totalSales != null ? 
                                            `$${analyticsSummary.revenue.totalSales.toLocaleString()}` :
                                            analyticsSummary?.revenue?.totalSales === 0 ? 
                                            '$0' :
                                            '–'
                                        }
                                    </Text>
                                    <Text style={styles.metricLabel}>
                                        {activePeriod === 0 && 'Daily Sales Revenue'}
                                        {activePeriod === 1 && 'Weekly Sales Revenue'}
                                        {activePeriod === 2 && 'Monthly Sales Revenue'}
                                    </Text>
                                    <Text style={styles.metricTrend}>
                                        {analyticsSummary?.revenue?.comparison ? 
                                            `${analyticsSummary.revenue.comparison.percentage > 0 ? '↑' : '↓'} ${Math.abs(analyticsSummary.revenue.comparison.percentage).toFixed(1)}% vs ${analyticsSummary.revenue.comparison.period}` :
                                            '–'
                                        }
                                    </Text>
                                </View>
                                <View style={styles.metricCard}>
                                    <Icon source="cash-multiple" size={28} color="#871919ff" />
                                    <Text style={styles.metricValue}>
                                        {analyticsSummary?.revenue?.netRevenue != null ? 
                                            `$${analyticsSummary.revenue.netRevenue.toLocaleString()}` :
                                            analyticsSummary?.revenue?.netRevenue === 0 ? 
                                            '$0' :
                                            '–'
                                        }
                                    </Text>
                                    <Text style={styles.metricLabel}>
                                        {activePeriod === 0 && 'Daily Net Revenue'}
                                        {activePeriod === 1 && 'Weekly Net Revenue'}
                                        {activePeriod === 2 && 'Monthly Net Revenue'}
                                    </Text>
                                    <Text style={styles.metricTrend}>
                                        {analyticsSummary?.revenue?.comparison ? 
                                            `${analyticsSummary.revenue.comparison.percentage > 0 ? '↑' : '↓'} ${Math.abs(analyticsSummary.revenue.comparison.percentage).toFixed(1)}% vs ${analyticsSummary.revenue.comparison.period}` :
                                            analyticsSummary === null ? 
                                            '–' :
                                            activePeriod === 0 ? '↑ 7.5% vs yesterday' : 
                                            activePeriod === 1 ? '↑ 5.2% vs last week' : '↑ 8.7% vs Sept'
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
                                            analyticsSummary?.orders?.count === 0 ? 
                                            '0' :
                                            '–'
                                        }
                                    </Text>
                                    <Text style={styles.metricLabel}>
                                        {activePeriod === 0 && 'Orders Today'}
                                        {activePeriod === 1 && 'Orders This Week'}
                                        {activePeriod === 2 && 'Orders This Month'}
                                    </Text>
                                    <Text style={styles.metricTrend}>
                                        {analyticsSummary?.orders?.comparison?.orders ? 
                                            `${analyticsSummary.orders.comparison.orders.percentage > 0 ? '↑' : '↓'} ${Math.abs(analyticsSummary.orders.comparison.orders.percentage).toFixed(1)}% vs ${analyticsSummary.orders.comparison.orders.period}` :
                                            '–'
                                        }
                                    </Text>
                                </View>
                                <View style={styles.metricCard}>
                                    <Icon source="account-group" size={28} color="#871919ff" />
                                    <Text style={styles.metricValue}>
                                        {analyticsSummary?.orders?.newCustomers != null ? 
                                            analyticsSummary.orders.newCustomers.toLocaleString() :
                                            analyticsSummary?.orders?.newCustomers === 0 ? 
                                            '0' :
                                            '–'
                                        }
                                    </Text>
                                    <Text style={styles.metricLabel}>
                                        {activePeriod === 0 && 'New Customers Today'}
                                        {activePeriod === 1 && 'New Customers This Week'}
                                        {activePeriod === 2 && 'New Customers This Month'}
                                    </Text>
                                    <Text style={styles.metricTrend}>
                                        {analyticsSummary?.orders?.comparison?.customers ? 
                                            `${analyticsSummary.orders.comparison.customers.percentage > 0 ? '↑' : '↓'} ${Math.abs(analyticsSummary.orders.comparison.customers.percentage).toFixed(1)}% vs ${analyticsSummary.orders.comparison.customers.period}` :
                                            '–'
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
                                        {analyticsSummary?.averages?.orderValue != null ? 
                                            `$${analyticsSummary.averages.orderValue.toFixed(2)}` :
                                            analyticsSummary?.averages?.orderValue === 0 ? 
                                            '$0.00' :
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
                                        {analyticsSummary?.averages?.fulfillmentTime != null ? 
                                            `${analyticsSummary.averages.fulfillmentTime} min` :
                                            analyticsSummary?.averages?.fulfillmentTime === 0 ? 
                                            '0 min' :
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
                                            `${analyticsSummary.averages.comparison.fulfillmentTime.percentage < 0 ? '↓' : '↑'} ${Math.abs(analyticsSummary.averages.comparison.fulfillmentTime.percentage).toFixed(1)}% vs ${analyticsSummary.averages.comparison.fulfillmentTime.period}` :
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
                                            activePeriod === 1 ? today.toLocaleDateString('en-US', { month: 'short'}) + " " + weekAgo.toLocaleDateString('en-US', { day: 'numeric'}) + " - " + today.toLocaleDateString('en-US', { day: 'numeric'}) + ", "  + today.toLocaleDateString('en-US', { year: 'numeric' }) : today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))}
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
                                    ) : menuPerformance === null ? (
                                        <View style={styles.menuItemAnalyticsRow}>
                                            <Text style={[styles.menuItemAnalyticsName, {color: '#999'}]}>–</Text>
                                            <Text style={[styles.menuItemCount, {color: '#999'}]}>–</Text>
                                            <Text style={[styles.menuItemRevenue, {color: '#999'}]}>–</Text>
                                        </View>
                                    ) : (
                                        activePeriod === 0 ? (
                                            <>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Signature Steak</Text>
                                                    <Text style={styles.menuItemCount}>15 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$420</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Truffle Pasta</Text>
                                                    <Text style={styles.menuItemCount}>11 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$220</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Chocolate Cake</Text>
                                                    <Text style={styles.menuItemCount}>9 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$81</Text>
                                                </View>
                                            </>
                                        ) : activePeriod === 1 ? (
                                            <>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Signature Steak</Text>
                                                    <Text style={styles.menuItemCount}>78 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$2,184</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Truffle Pasta</Text>
                                                    <Text style={styles.menuItemCount}>52 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$1,040</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Chocolate Cake</Text>
                                                    <Text style={styles.menuItemCount}>43 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$387</Text>
                                                </View>
                                            </>
                                        ) : (
                                            <>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Signature Steak</Text>
                                                    <Text style={styles.menuItemCount}>142 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$3,976</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Truffle Pasta</Text>
                                                    <Text style={styles.menuItemCount}>98 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$1,960</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Chocolate Cake</Text>
                                                    <Text style={styles.menuItemCount}>87 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$783</Text>
                                                </View>
                                            </>
                                        )
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
                                            activePeriod === 1 ? today.toLocaleDateString('en-US', { month: 'short'}) + " " + weekAgo.toLocaleDateString('en-US', { day: 'numeric'}) + " - " + today.toLocaleDateString('en-US', { day: 'numeric'}) + ", "  + today.toLocaleDateString('en-US', { year: 'numeric' }) : today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))}
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
                                    ) : menuPerformance === null ? (
                                        <View style={styles.menuItemAnalyticsRow}>
                                            <Text style={[styles.menuItemAnalyticsName, {color: '#999'}]}>–</Text>
                                            <Text style={[styles.menuItemCount, {color: '#999'}]}>–</Text>
                                            <Text style={[styles.menuItemRevenue, {color: '#999'}]}>–</Text>
                                        </View>
                                    ) : (
                                        activePeriod === 0 ? (
                                            <>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Seafood Platter</Text>
                                                    <Text style={styles.menuItemCount}>1 order</Text>
                                                    <Text style={styles.menuItemRevenue}>$30</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Vegan Salad</Text>
                                                    <Text style={styles.menuItemCount}>2 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$30</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Fruit Dessert</Text>
                                                    <Text style={styles.menuItemCount}>2 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$20</Text>
                                                </View>
                                            </>
                                        ) : activePeriod === 1 ? (
                                            <>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Seafood Platter</Text>
                                                    <Text style={styles.menuItemCount}>6 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$180</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Vegan Salad</Text>
                                                    <Text style={styles.menuItemCount}>8 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$120</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Fruit Dessert</Text>
                                                    <Text style={styles.menuItemCount}>7 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$70</Text>
                                                </View>
                                            </>
                                        ) : (
                                            <>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Seafood Platter</Text>
                                                    <Text style={styles.menuItemCount}>12 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$360</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Vegan Salad</Text>
                                                    <Text style={styles.menuItemCount}>15 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$225</Text>
                                                </View>
                                                <View style={styles.menuItemAnalyticsRow}>
                                                    <Text style={styles.menuItemAnalyticsName}>Fruit Dessert</Text>
                                                    <Text style={styles.menuItemCount}>18 orders</Text>
                                                    <Text style={styles.menuItemRevenue}>$180</Text>
                                                </View>
                                            </>
                                        )
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
                                    <Icon source="clock-outline" size={24} color="#871919ff" />
                                    <Text style={styles.cardTitle}>Order Fulfillment Time</Text>
                                    <Text style={styles.cardPeriod}>
                                        {activePeriod === 0 && today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        {activePeriod === 1 && 'This Week'}
                                        {activePeriod === 2 && 'This Month'}
                                    </Text>
                                </View>
                                <View style={styles.fulfillmentContainer}>
                                    {orderFulfillment === null ? (
                                        <>
                                            <View style={styles.fulfillmentRow}>
                                                <Text style={styles.fulfillmentLabel}>Avg. Kitchen Time:</Text>
                                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={[styles.fulfillmentValue, {color: '#999'}]}>–</Text>
                                                    <Text style={[styles.fulfillmentTrend, {color: '#999'}]}>–</Text>
                                                </View>
                                            </View>
                                            <View style={styles.fulfillmentRow}>
                                                <Text style={styles.fulfillmentLabel}>Avg. Serving Time:</Text>
                                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={[styles.fulfillmentValue, {color: '#999'}]}>–</Text>
                                                    <Text style={[styles.fulfillmentTrend, {color: '#999'}]}>–</Text>
                                                </View>
                                            </View>
                                            <View style={styles.fulfillmentRow}>
                                                <Text style={styles.fulfillmentLabel}>
                                                    {activePeriod === 0 ? 'Current Wait Time:' : 
                                                     activePeriod === 1 ? 'Peak Hour Fulfillment:' : 
                                                     'Total Fulfillment Time:'}
                                                </Text>
                                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={[styles.fulfillmentValue, {color: '#999'}]}>–</Text>
                                                    <Text style={[styles.fulfillmentTrend, {color: '#999'}]}>–</Text>
                                                </View>
                                            </View>
                                        </>
                                    ) : orderFulfillment ? (
                                        <>
                                            <View style={styles.fulfillmentRow}>
                                                <Text style={styles.fulfillmentLabel}>Avg. Kitchen Time:</Text>
                                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={styles.fulfillmentValue}>
                                                        {orderFulfillment.kitchenTime?.average != null ? 
                                                         `${orderFulfillment.kitchenTime.average} min` : '–'}
                                                    </Text>
                                                    {orderFulfillment.kitchenTime?.comparison ? (
                                                        <Text style={[
                                                            styles.fulfillmentTrend, 
                                                            {color: orderFulfillment.kitchenTime.comparison.difference < 0 ? '#4CAF50' : 
                                                                   orderFulfillment.kitchenTime.comparison.difference > 0 ? '#F44336' : '#9E9E9E'}
                                                        ]}>
                                                            {orderFulfillment.kitchenTime.comparison.difference === 0 ? 
                                                                `↔ same as ${orderFulfillment.kitchenTime.comparison.period}` :
                                                                `${orderFulfillment.kitchenTime.comparison.difference < 0 ? '↓' : '↑'} 
                                                                 ${Math.abs(orderFulfillment.kitchenTime.comparison.difference)} min vs 
                                                                 ${orderFulfillment.kitchenTime.comparison.period}`
                                                            }
                                                        </Text>
                                                    ) : <Text style={styles.fulfillmentTrend}>–</Text>}
                                                </View>
                                            </View>
                                            <View style={styles.fulfillmentRow}>
                                                <Text style={styles.fulfillmentLabel}>Avg. Serving Time:</Text>
                                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={styles.fulfillmentValue}>
                                                        {orderFulfillment.servingTime?.average != null ?
                                                         `${orderFulfillment.servingTime.average} min` : '–'}
                                                    </Text>
                                                    {orderFulfillment.servingTime?.comparison ? (
                                                        <Text style={[
                                                            styles.fulfillmentTrend, 
                                                            {color: orderFulfillment.servingTime.comparison.difference < 0 ? '#4CAF50' : 
                                                                   orderFulfillment.servingTime.comparison.difference > 0 ? '#F44336' : '#9E9E9E'}
                                                        ]}>
                                                            {orderFulfillment.servingTime.comparison.difference === 0 ? 
                                                                `↔ same as ${orderFulfillment.servingTime.comparison.period}` :
                                                                `${orderFulfillment.servingTime.comparison.difference < 0 ? '↓' : '↑'} 
                                                                 ${Math.abs(orderFulfillment.servingTime.comparison.difference)} min vs 
                                                                 ${orderFulfillment.servingTime.comparison.period}`
                                                            }
                                                        </Text>
                                                    ) : <Text style={styles.fulfillmentTrend}>–</Text>}
                                                </View>
                                            </View>
                                            <View style={styles.fulfillmentRow}>
                                                <Text style={styles.fulfillmentLabel}>
                                                    {orderFulfillment.peakOrWaitTime?.label || 'Wait Time'}:
                                                </Text>
                                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <Text style={styles.fulfillmentValue}>
                                                        {orderFulfillment.peakOrWaitTime?.value != null ?
                                                         `${orderFulfillment.peakOrWaitTime.value} min` : '–'}
                                                    </Text>
                                                    {orderFulfillment.peakOrWaitTime?.comparison ? (
                                                        <Text style={[
                                                            styles.fulfillmentTrend, 
                                                            {color: orderFulfillment.peakOrWaitTime.comparison.difference < 0 ? '#4CAF50' : 
                                                                   orderFulfillment.peakOrWaitTime.comparison.difference > 0 ? '#F44336' : '#9E9E9E'}
                                                        ]}>
                                                            {orderFulfillment.peakOrWaitTime.comparison.difference === 0 ? 
                                                                `↔ same as ${orderFulfillment.peakOrWaitTime.comparison.period}` :
                                                                `${orderFulfillment.peakOrWaitTime.comparison.difference < 0 ? '↓' : '↑'} 
                                                                 ${Math.abs(orderFulfillment.peakOrWaitTime.comparison.difference)} min vs 
                                                                 ${orderFulfillment.peakOrWaitTime.comparison.period}`
                                                            }
                                                        </Text>
                                                    ) : <Text style={styles.fulfillmentTrend}>–</Text>}
                                                </View>
                                            </View>
                                        </>
                                    ) : (
                                        activePeriod === 0 ? (
                                            <>
                                                <View style={styles.fulfillmentRow}>
                                                    <Text style={styles.fulfillmentLabel}>Avg. Kitchen Time:</Text>
                                                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <Text style={styles.fulfillmentValue}>15 min</Text>
                                                        <Text style={[styles.fulfillmentTrend, {color: '#4CAF50'}]}>↓ 1 min vs yesterday</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.fulfillmentRow}>
                                                    <Text style={styles.fulfillmentLabel}>Avg. Serving Time:</Text>
                                                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <Text style={styles.fulfillmentValue}>4 min</Text>
                                                        <Text style={[styles.fulfillmentTrend, {color: '#4CAF50'}]}>↓ 1 min vs yesterday</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.fulfillmentRow}>
                                                    <Text style={styles.fulfillmentLabel}>Current Wait Time:</Text>
                                                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <Text style={styles.fulfillmentValue}>22 min</Text>
                                                        <Text style={[styles.fulfillmentTrend, {color: '#9E9E9E'}]}>↔ same as 1 hour ago</Text>
                                                    </View>
                                                </View>
                                            </>
                                        ) : activePeriod === 1 ? (
                                            <>
                                                <View style={styles.fulfillmentRow}>
                                                    <Text style={styles.fulfillmentLabel}>Avg. Kitchen Time:</Text>
                                                    <Text style={styles.fulfillmentValue}>16 min</Text>
                                                    <Text style={[styles.fulfillmentTrend, {color: '#4CAF50'}]}>↓ 2 min vs last week</Text>
                                                </View>
                                                <View style={styles.fulfillmentRow}>
                                                    <Text style={styles.fulfillmentLabel}>Avg. Serving Time:</Text>
                                                    <Text style={styles.fulfillmentValue}>5 min</Text>
                                                    <Text style={[styles.fulfillmentTrend, {color: '#9E9E9E'}]}>↔ same as last week</Text>
                                                </View>
                                                <View style={styles.fulfillmentRow}>
                                                    <Text style={styles.fulfillmentLabel}>Peak Hour Fulfillment:</Text>
                                                    <Text style={styles.fulfillmentValue}>28 min (7-8 PM)</Text>
                                                    <Text style={[styles.fulfillmentTrend, {color: '#4CAF50'}]}>↓ 3 min vs last week</Text>
                                                </View>
                                            </>
                                        ) : (
                                            <>
                                                <View style={styles.fulfillmentRow}>
                                                    <Text style={styles.fulfillmentLabel}>Avg. Kitchen Time:</Text>
                                                    <Text style={styles.fulfillmentValue}>17 min</Text>
                                                    <Text style={[styles.fulfillmentTrend, {color: '#4CAF50'}]}>↓ 2 min vs Sept</Text>
                                                </View>
                                                <View style={styles.fulfillmentRow}>
                                                    <Text style={styles.fulfillmentLabel}>Avg. Serving Time:</Text>
                                                    <Text style={styles.fulfillmentValue}>5 min</Text>
                                                    <Text style={[styles.fulfillmentTrend, {color: '#4CAF50'}]}>↓ 1 min vs Sept</Text>
                                                </View>
                                                <View style={styles.fulfillmentRow}>
                                                    <Text style={styles.fulfillmentLabel}>Total Fulfillment Time:</Text>
                                                    <Text style={styles.fulfillmentValue}>22 min</Text>
                                                    <Text style={[styles.fulfillmentTrend, {color: '#4CAF50'}]}>↓ 3 min vs Sept</Text>
                                                </View>
                                            </>
                                        )
                                    )}
                                </View>
                            </View>
                            
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
                                        {activePeriod === 0 && today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        {activePeriod === 1 && today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        {activePeriod === 2 && today.toLocaleDateString('en-US', { month: 'short'}) + " " + weekAgo.toLocaleDateString('en-US', { day: 'numeric'}) + " - " + today.toLocaleDateString('en-US', { day: 'numeric'}) + ", "  + today.toLocaleDateString('en-US', { year: 'numeric' })}
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
                                                    onPress={() => downloadReport(report.url)}
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
                                    ) : reports === null ? (
                                        <View style={{alignItems: 'center', padding: 20}}>
                                            <Text style={{fontSize: 16, color: '#999'}}>– No reports available –</Text>
                                        </View>
                                    ) : (
                                        <>
                                            <TouchableOpacity style={styles.reportButton}>
                                                <Icon source="file-pdf-box" size={22} color="#871919ff" />
                                                <Text style={styles.reportButtonText}>October 2025</Text>
                                                <Text style={{fontSize: 12, color: '#4CAF50', marginTop: 4}}>Current Month</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.reportButton}>
                                                <Icon source="file-pdf-box" size={22} color="#871919ff" />
                                                <Text style={styles.reportButtonText}>September 2025</Text>
                                                <Text style={{fontSize: 12, color: '#777', marginTop: 4}}>Last Month</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.reportButton}>
                                                <Icon source="file-pdf-box" size={22} color="#871919ff" />
                                                <Text style={styles.reportButtonText}>August 2025</Text>
                                                <Text style={{fontSize: 12, color: '#777', marginTop: 4}}>2 Months Ago</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.reportButton, {backgroundColor: '#eee', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc'}]}>
                                                <Icon source="folder-outline" size={22} color="#555" />
                                                <Text style={[styles.reportButtonText, {color: '#555'}]}>View All Reports</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}
                    {selectedIndex === 1 && (
                        <View>
                            {dropdownVisible && userSearch.length > 0 && (
                                <View 
                                    style={styles.dropdown}
                                    onTouchStart={(e) => e.stopPropagation()}
                                >
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, idx) => (
                                            <TouchableOpacity
                                                key={idx}
                                                onPress={() => {
                                                    setDropdownVisible(false);
                                                    showTabBar();
                                                    setUserSearch(`${user.firstName} ${user.lastName}`);
                                                    router.push({
                                                        pathname: '/UserProfile',
                                                        params: { user: user.uid }
                                                    });
                                                }}
                                                style={styles.dropdownItem}
                                            >
                                                <Text style={styles.dropdownItemText}>{user.firstName} {user.lastName} - {user.userRole}</Text>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <Text style={styles.emptyMessage}>No users found.</Text>
                                    )}
                                </View>
                            )}
                            <Text style={styles.subtitle}>Staff Members:</Text>
                            <View style={styles.sectionContainer}>
                                {staff && staff.length > 0 ? (
                                    staff.map((user, index) => (
                                        <TouchableOpacity 
                                            key={index}
                                            style={styles.userCard}
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/UserProfile',
                                                    params: { user: user.uid }
                                                });
                                            }}
                                        >
                                            <View style={styles.userCardContent}>
                                                <View style={styles.userIcon}>
                                                    <Icon source="account" size={24} color="#871919ff" />
                                                </View>
                                                <View style={styles.userInfo}>
                                                    <Text style={styles.userName}>{user.firstName} {user.lastName} {user.uid === uid ? (<Text style={{ fontWeight: 'bold', color: '#871919ff' }}>(Me)</Text>) : ""}</Text>
                                                    <Text style={styles.userRole}>{user.userRole}</Text>
                                                </View>
                                                <Icon source="chevron-right" size={24} color="#666" />
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text style={styles.emptyMessage}>No staff members found.</Text>
                                )}
                            </View>
                            <Text style={styles.subtitle}>Members:</Text>
                            <View style={styles.sectionContainer}>
                                {customers && customers.length > 0 ? (
                                    customers.map((user, index) => (
                                        <TouchableOpacity 
                                            key={index}
                                            style={styles.userCard}
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/UserProfile',
                                                    params: { user: user.uid }
                                                });
                                            }}
                                        >
                                            <View style={styles.userCardContent}>
                                                <View style={styles.userIcon}>
                                                    <Icon source="account" size={24} color="#871919ff" />
                                                </View>
                                                <View style={styles.userInfo}>
                                                    <Text style={styles.userName}>{user.firstName} {user.lastName} {user.uid === uid ? (<Text style={{ fontWeight: 'bold', color: '#871919ff' }}>(Me)</Text>) : ""}</Text>
                                                    <Text style={styles.userRole}>{user.userRole}</Text>
                                                </View>
                                                <Icon source="chevron-right" size={24} color="#666" />
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text style={styles.emptyMessage}>No members found.</Text>
                                )}
                            </View>
                        </View>
                    )}
                    {selectedIndex === 2 && (
                        <View>
                            <ScrollView>
                                {menuItems && menuItems.length > 0 ? (
                                    menuItems.filter(item =>
                                        item.name.toLowerCase().includes(productSearch.toLowerCase())
                                    ).map((item, index) => (
                                        <View key={index} style={styles.menuItemCard}>
                                            <View style={styles.menuItemHeader}>
                                                <View style={styles.menuItemInfo}>
                                                    <Text style={styles.menuItemName}>{item.name}</Text>
                                                    <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.editButton}
                                                    onPress={() =>
                                                        router.push({
                                                            pathname: '/EditProduct',
                                                            params: { product: JSON.stringify(item) },
                                                        })
                                                    }
                                                >
                                                    <Icon source="pencil" size={20} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.menuItemDescription}>{item.description}</Text>
                                            {item.imageURL && (
                                                <Image 
                                                    source={{ uri: item.imageURL }} 
                                                    style={styles.menuItemImage} 
                                                    resizeMode="cover"
                                                />
                                            )}
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.emptyMessage}>No menu items found.</Text>
                                )}
                            </ScrollView>
                        </View>
                    )}
                    {selectedIndex === 3 && (
                        <View>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={() => {
                                            setRefreshing(true);
                                            handleOrderHistory();
                                        }}
                                        colors={['#871919ff']}
                                        tintColor={'#871919ff'}
                                    />
                                }
                            >
                                {orderHistory && orderHistory.length > 0 ? (
                                    orderHistory
                                        .filter(order =>
                                            (order.customerFirstName + " " + order.customerLastName).toLowerCase().includes(productSearch.toLowerCase()) ||
                                            (order.waitressFirstName + " " + order.waitressLastName).toLowerCase().includes(productSearch.toLowerCase()) ||
                                            order.id.toLowerCase().includes(productSearch.toLowerCase())
                                        )
                                        .sort((a, b) => new Date(b.orderStartTime).getTime() - new Date(a.orderStartTime).getTime())
                                        .map((order: any) => {
                                            let orderedItems = order.orderedItems;
                                            if (!orderedItems && order.menuItemIds) {
                                                orderedItems = (order.menuItemIds || [])
                                                    .map((id: string) => menuItems.find(item => item.id === id))
                                                    .filter((item: MenuItems | undefined): item is MenuItems => !!item)
                                                    .map((item: MenuItems) => ({
                                                        id: item.id,
                                                        name: item.name,
                                                        price: item.price,
                                                        quantity: 1
                                                    }));
                                            }
                                            return (
                                                <OrderHistoryCard
                                                    key={order.id}
                                                    id={order.id}
                                                    customerFirstName={order.customerFirstName}
                                                    customerLastName={order.customerLastName}
                                                    waitressFirstName={order.waitressFirstName}
                                                    waitressLastName={order.waitressLastName}
                                                    tableNumber={order.tableNumber}
                                                    orderedItems={orderedItems}
                                                    status={order.status}
                                                    paymentStatus={order.paymentStatus}
                                                    totalPrice={order.totalPrice}
                                                    orderStartTime={order.orderStartTime}
                                                    orderEndTime={order.orderEndTime}
                                                />
                                            );
                                        })
                                ) : (
                                    <Text style={styles.emptyMessage}>No order history found.</Text>
                                )}
                            </ScrollView>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20,
        backgroundColor: '#ffffffff' 
    },
    header: {
        marginTop: 30,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    // Analytics styles
    analyticsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        marginVertical: 10,
    },
    analyticsItem: {
        alignItems: 'center',
        flex: 1,
    },
    analyticsValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#871919ff',
        marginBottom: 5,
    },
    analyticsLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    // Dashboard overview styles
    dashboardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metricCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        flex: 1,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    metricValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 8,
    },
    metricLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    metricTrend: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 5,
    },
    // Card styles
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
        flex: 1,
    },
    cardPeriod: {
        fontSize: 12,
        color: '#666',
        alignSelf: 'center',
    },
    // Menu item analytics
    menuItemAnalytics: {
        marginTop: 5,
        marginBottom: 15,
    },
    menuItemAnalyticsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#e0e0e0',
        marginBottom: 5,
    },
    menuItemAnalyticsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemAnalyticsName: {
        flex: 2,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    menuItemCount: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    menuItemRevenue: {
        flex: 1,
        fontSize: 14,
        color: '#871919ff',
        fontWeight: '600',
        textAlign: 'right',
    },
    // Order fulfillment styles
    fulfillmentContainer: {
        padding: 10,
    },
    fulfillmentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    fulfillmentLabel: {
        fontSize: 14,
        color: '#333',
        flex: 1.5,
    },
    fulfillmentValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginRight: 10,
    },
    fulfillmentTrend: {
        fontSize: 12,
        fontWeight: '500',
        color: '#4CAF50',
        textAlign: 'right',
    },
    // Period selector styles
    periodSelector: {
        flexDirection: 'row',
        marginBottom: 15,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        marginHorizontal: 5,
    },
    periodTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    periodTabActive: {
        backgroundColor: '#871919ff',
    },
    periodTabText: {
        fontSize: 14,
        color: '#333',
    },
    periodTabTextActive: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    periodLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'normal',
    },
    // Reports styles
    reportsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20,
    },
    reportButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        padding: 16,
        width: '48%',
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    reportButtonText: {
        fontSize: 14,
        color: '#333',
        marginTop: 8,
        fontWeight: '500',
        textAlign: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 24,
        color: '#871919ff',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
    backButton: { 
        backgroundColor: '#e8e8e8ff', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#871919ff',
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'Helvetica',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#871919ff',
        marginBottom: 10,
        marginTop: 15,
        fontFamily: 'Helvetica',
    },
    textInput: { 
        marginBottom: 15, 
        backgroundColor: '#e8e8e8ff', 
        height: 58 
    },
    textInputOutline: { 
        borderRadius: 30, 
        borderWidth: 0 
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 100
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333'
    },
    emptyMessage: {
        padding: 15,
        textAlign: 'center',
        color: '#7e7d7dff',
        fontFamily: 'Helvetica',
    },
    sectionContainer: {
        marginBottom: 20,
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    userIcon: {
        backgroundColor: '#f0f0f0',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userRole: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    buttonPrimary: {
        backgroundColor: '#871919ff',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonSecondary: {
        backgroundColor: '#e8e8e8ff',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextSecondary: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
    menuItemCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    menuItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuItemInfo: {
        flex: 1,
    },
    menuItemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    menuItemPrice: {
        fontSize: 16,
        color: '#871919ff',
        fontWeight: 'bold',
        marginTop: 2,
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    menuItemImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#871919ff',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Order history styles moved to OrderHistoryCard component
    stripeSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stripeIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    stripeInfo: {
        flex: 1,
    },
    stripeSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    stripeDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
});