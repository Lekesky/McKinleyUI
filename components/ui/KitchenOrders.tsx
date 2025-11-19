import OrderCardKitchen from '@/components/OrderCardKitchen';
import createAPIClient, { PageableResponse } from '@/services/api';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { Toast } from 'toastify-react-native';
import styles from '../../styles/KitchenOrder.styles';

interface OrderedItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface User {
    id: string;
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
    totalPrice: number;
    status: string;
    paymentStatus: string;
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

    const PAGE_SIZE = 10;
    const [kitchenPageNumber, setKitchenPageNumber] = useState(0);
    const [kitchenHasMore, setKitchenHasMore] = useState(true);
    const [loadingMoreKitchen, setLoadingMoreKitchen] = useState(false);


    const fetchKitchenOrders = useCallback(async(page = 0) => {
        if (page > 0 && (!kitchenHasMore || loadingMoreKitchen)) {
            return;
        }

        try {
            if (page > 0) {
                setLoadingMoreKitchen(true);
            }

            const response = await api.get<PageableResponse<Order>>(`/orders/kitchen`, {
                params: {
                    page,
                    size: PAGE_SIZE
                }
            });

            const content = response.data.content || [];
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
        } catch (error : any) {
            const errorMessage = error.response?.data || error.message || 'Failed to fetch kitchen orders';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch kitchen orders',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        } finally {
            if (page > 0) {
                setLoadingMoreKitchen(false);
            }
        }
    }, [api, kitchenHasMore, loadingMoreKitchen]);

    const handleOrderPress = (orderId: string) => {

        // Navigate to order details screen or perform another action
    };
    const orderCategories = ['All', 'In-Progress', 'Completed', 'Canceled'];
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
            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
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

