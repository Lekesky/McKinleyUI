import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, RefreshControl, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import OrderDetailsCard from '../components/OrderDetailsCard';
import styles from '../styles/OrderHistory.styles';

interface OrderedItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}


type Order = {
    id: string;
    orderNumber: string;
    orderedItems: OrderedItem[];
    totalPrice: number;
    status: string;
    paymentStatus: string;
};

export default function OrderHistory() {
    const { uid } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const insets = useSafeAreaInsets();
    const [orders, setOrders] = useState<Order[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 10;
    const lastRefreshAt = useRef<number>(0);
    const lastEndReachedAt = useRef<number>(0);

    const goBackHandler = () => { router.back() }

    const onRefresh = async () => {
        lastRefreshAt.current = Date.now();
        setRefreshing(true);
        setPageNumber(0);
        setHasMore(true);
        try {
            await fetchOrderHistory(0);
        } catch (error: any) {
            const errorMessage = error.response?.data || error.message || 'Failed to refresh data';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to refresh data',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        } finally {
            setRefreshing(false);
        }
    };

    const fetchOrderHistory = useCallback(async (page = 0) => {
        if (page > 0 && (!hasMore || loadingMore)) {
            return;
        }

        try {
            if (page > 0) {
                setLoadingMore(true);
            }

            const response = await api.get(`/orders/all/${uid}`, {
                params: {
                    page,
                    size: PAGE_SIZE
                }
            });

            const content = response.data.content || response.data || [];
            if (page === 0) {
                setOrders(content);
            } else {
                setOrders(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const newItems = content.filter((c: Order) => c && !existingIds.has(c.id));
                    if (newItems.length === 0) return prev;
                    return [...prev, ...newItems];
                });
            }

            // Handle pagination metadata
            const more = response.data.last !== undefined ? !response.data.last : (content.length === PAGE_SIZE);
            setHasMore(more);
            setPageNumber(response.data.number !== undefined ? response.data.number : page);
            
        } catch (error: any) {
            const errorMessage = error.response?.data || error.message || 'Failed to fetch order history';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch order history',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        } finally {
            if (page === 0) {
                setLoading(false);
            }
            if (page > 0) {
                setLoadingMore(false);
            }
        }
    }, [api, uid, hasMore, loadingMore]);

    const handleOrderPress = (orderId: string) => {
        router.push({
            pathname: '/OrderDetails',
            params: { orderId }
        });
    };

    useEffect(() => {
        fetchOrderHistory();
    }, [fetchOrderHistory]);
    
    if (loading) {
        return (
            <View style={styles.center}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#871919ff" />
                    <Text style={styles.loadingText}>Loading order history...</Text>
                </View>
            </View>
        );
    }
    
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            
            {Platform.OS !== 'web' && (
                <>
                    {/* Header with Back Button and Title */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                            <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Order History</Text>
                    </View>
                </>
            )}

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <OrderDetailsCard
                        orderNumber={item.orderNumber}
                        orderedItems={item.orderedItems}
                        totalPrice={item.totalPrice}
                        status={item.status}
                        paymentStatus={item.paymentStatus}
                        onPress={() => handleOrderPress(item.id)}
                    />
                )}
                contentContainerStyle={styles.orderList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#871919ff"]} // Android
                        tintColor="#871919ff" // iOS
                    />
                }
                onEndReached={() => {
                    const now = Date.now();
                    // ignore if we just refreshed
                    if (now - lastRefreshAt.current < 800) return;
                    // simple debounce to avoid duplicate rapid triggers
                    if (now - lastEndReachedAt.current < 800) return;
                    if (!refreshing && hasMore && !loadingMore) {
                        lastEndReachedAt.current = now;
                        fetchOrderHistory(pageNumber + 1);
                    }
                }}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                            <Icon source="receipt-outline" size={80} color="#d1d5db" />
                        </View>
                        <Text style={styles.emptyMessage}>No orders yet</Text>
                        <Text style={styles.emptySubtext}>Your order history will appear here once you place your first order</Text>
                    </View>
                )}
                ListFooterComponent={loadingMore ? (
                    <View style={styles.loadingMore}>
                        <ActivityIndicator size="small" color="#871919ff" />
                        <Text style={styles.loadingMoreText}>Loading more...</Text>
                    </View>
                ) : null}
            />

        </View>
    );
}

