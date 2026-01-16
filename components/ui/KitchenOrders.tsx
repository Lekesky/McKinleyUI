import OrderCardKitchen from '@/components/OrderCardKitchen';
import createAPIClient, { PageableResponse } from '@/services/api';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import { Toast } from 'toastify-react-native';
import styles from '../../styles/KitchenOrder.styles';

interface OrderedItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface User {
    uid: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

type Order = {
    id: string;
    customer: User;
    waitress: User;
    orderNumber: string;
    orderedItems: OrderedItem[];
    status: string;
    paymentStatus: string;
    totalPrice: number;
    orderStartTime: string;
    orderEndTime: string | null;
};

export default function KitchenOrders() {
    const api = useMemo(() => createAPIClient(), []);
    const [kitchenOrders, setKitchenOrders] = useState<Order[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [kitchenSelectedCategory, setKitchenSelectedCategory] = useState<string>('All');
    const lastRefreshAt = useRef<number>(0);
    const lastEndReachedAt = useRef<number>(0);
    const [canRefresh, setCanRefresh] = useState(true);
    const [refreshTimer, setRefreshTimer] = useState(0);

    const PAGE_SIZE = 10;
    const [kitchenPageNumber, setKitchenPageNumber] = useState(-1);
    const [kitchenHasMore, setKitchenHasMore] = useState(true);
    const [loadingMoreKitchen, setLoadingMoreKitchen] = useState(false);
    const REFRESH_COOLDOWN = 10; // 10 seconds cooldown between refreshes


    const fetchKitchenOrders = useCallback((page = 0) => {
        if (page > 0 && (!kitchenHasMore || loadingMoreKitchen)) {
            return Promise.resolve();
        }

        if (page > 0) {
            setLoadingMoreKitchen(true);
        }

        return api.get<PageableResponse<Order>>(`/orders/kitchen`, {
            params: {
                page,
                size: PAGE_SIZE
            }
        })
        .then(response => {
            const content = response.data.content || [];
            console.log('Fetched kitchen orders:', response.data);
            
            if (page === 0) {
                setKitchenOrders(content);
            } else {
                setKitchenOrders(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const newItems = content.filter(c => c && !existingIds.has(c.id));
                    if (newItems.length === 0) return prev;
                    return [...prev, ...newItems];
                });
            }

            const more = typeof response.data.last === 'boolean' ? !response.data.last : (content.length === PAGE_SIZE);
            setKitchenHasMore(more);
            setKitchenPageNumber(typeof response.data.number === 'number' ? response.data.number : page);
        })
        .catch((error: any) => {
            const errorMessage = error.response?.data || error.message || 'Failed to fetch kitchen orders';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch kitchen orders',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        })
        .finally(() => {
            if (page > 0) {
                setLoadingMoreKitchen(false);
            }
        });
    }, [api, kitchenHasMore, loadingMoreKitchen]);

    // Timer countdown effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!canRefresh && refreshTimer > 0) {
            interval = setInterval(() => {
                setRefreshTimer(prev => {
                    if (prev <= 1) {
                        setCanRefresh(true);
                        // Trigger refresh immediately when timer hits 0
                        setTimeout(() => {
                            lastRefreshAt.current = Date.now();
                            setRefreshing(true);
                            setKitchenPageNumber(0);
                            setKitchenHasMore(true);
                            setCanRefresh(false);
                            setRefreshTimer(REFRESH_COOLDOWN);
                            fetchKitchenOrders(0).finally(() => setRefreshing(false));
                        }, 0);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [canRefresh, refreshTimer, fetchKitchenOrders, REFRESH_COOLDOWN]);

    // Initial load and start auto-refresh cycle
    useEffect(() => {
        // Trigger initial fetch and start the timer
        setRefreshing(true);
        setKitchenPageNumber(0);
        setKitchenHasMore(true);
        setCanRefresh(false);
        setRefreshTimer(REFRESH_COOLDOWN);
        fetchKitchenOrders(0).finally(() => setRefreshing(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const handleOrderPress = (orderId: string) => {
        router.push({
            pathname: '/OrderDetails',
            params: { orderId }
        });
    };

    const handleStatusChange = useCallback((orderId: string, newStatus: string) => {
        // Optimistically update the order status in the local state
        setKitchenOrders(prev => 
            prev.map(order => 
                order.id === orderId 
                    ? { ...order, status: newStatus }
                    : order
            )
        );
    }, []);

    const orderCategories = ['All', 'In-Progress'];
    const filteredKitchenOrders = kitchenOrders.filter(order => {
        if (kitchenSelectedCategory === 'All') return true;
        const status = order.status.toUpperCase();
        if (kitchenSelectedCategory === 'In-Progress' && status === 'IN-PROGRESS') return true;
        if (kitchenSelectedCategory === 'Completed' && status === 'COMPLETED') return true;
        if (kitchenSelectedCategory === 'Canceled' && status === 'CANCELED') return true;
        return false;
    });

    return(
        <>
            {/* Filter Tabs with Refresh Button */}
            <View style={styles.filterContainer}>
                <View style={{ flexDirection: 'row', flex: 1, gap: 8 }}>
                    {orderCategories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.filterTab,
                                kitchenSelectedCategory === category && styles.activeFilterTab
                            ]}
                            onPress={() => setKitchenSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.filterTabText,
                                    kitchenSelectedCategory === category && styles.activeFilterTabText
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                {/* Refresh Button */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={() => {
                            lastRefreshAt.current = Date.now();
                            setRefreshing(true);
                            setKitchenPageNumber(0);
                            setKitchenHasMore(true);
                            setCanRefresh(false);
                            setRefreshTimer(REFRESH_COOLDOWN);
                            fetchKitchenOrders(0).finally(() => setRefreshing(false));
                        }}
                    >
                        {refreshing ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Icon source="refresh" size={20} color="#ffffff" />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.refreshTimerText}>{refreshTimer}s</Text>
                </View>
            </View>

            {/* Kitchen Order List (FlatList with infinite scroll) */}
            <FlatList
                data={filteredKitchenOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item: order }) => (
                    <OrderCardKitchen
                        id={order.id}
                        customer={order.customer}
                        waitress={order.waitress}
                        orderNumber={order.orderNumber}
                        orderedItems={order.orderedItems}
                        totalPrice={order.totalPrice}
                        status={order.status}
                        paymentStatus={order.paymentStatus}
                        orderDate={order.orderStartTime}
                        onPress={() => handleOrderPress(order.id)}
                        onStatusChange={handleStatusChange}
                    />
                )}
                contentContainerStyle={styles.flatListContainer}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={() => {
                    // mark refresh time to prevent onEndReached from firing immediately
                    lastRefreshAt.current = Date.now();
                    setRefreshing(true);
                    setKitchenPageNumber(0);
                    setKitchenHasMore(true);
                    setCanRefresh(false);
                    setRefreshTimer(REFRESH_COOLDOWN);
                    fetchKitchenOrders(0).finally(() => setRefreshing(false));
                }}
                // Automatically fetch next page when reaching the end (footer).
                    onEndReached={() => {
                        const now = Date.now();
                        // ignore if we just refreshed
                        if (now - lastRefreshAt.current < 800) return;
                        // simple debounce to avoid duplicate rapid triggers
                        if (now - lastEndReachedAt.current < 800) return;
                        if (!refreshing && kitchenHasMore && !loadingMoreKitchen) {
                            lastEndReachedAt.current = now;
                            fetchKitchenOrders(kitchenPageNumber + 1);
                        }
                    }}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={!refreshing ? (
                    <View style={styles.emptyContainer}>
                        <Icon source="chef-hat" size={120} color="#d0d0d0" />
                        <Text style={{ fontSize: 18, color: '#666', marginTop: 20, fontFamily: 'Helvetica' }}>Queue is empty</Text>
                        <Text style={{ fontSize: 14, color: '#999', marginTop: 8, fontFamily: 'Helvetica' }}>No orders in the kitchen right now</Text>
                    </View>
                ) : null}
                ListFooterComponent={loadingMoreKitchen ? (
                    <View style={styles.loadingMore}>
                        <ActivityIndicator size="small" color="#871919ff" />
                        <Text style={styles.loadingMoreText}>Loading more...</Text>
                    </View>
                ) : null}
            />
        </>
    );
}

