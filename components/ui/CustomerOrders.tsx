import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";

import OrderCard from '@/components/OrderCard';
import { useAuth } from "@/context/AuthContext";
import createAPIClient, { PageableResponse } from "@/services/api";

import { useCallback, useMemo, useRef, useState } from "react";
import { Text } from "react-native-paper";
import styles from "../../styles/CustomerOrder.styles";

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

export default function CustomerOrders() {
    const { uid } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const [userSelectedCategory, setUserSelectedCategory] = useState<string>('All');
    const [refreshing, setRefreshing] = useState(false);
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const lastRefreshAt = useRef<number>(0);
    const lastEndReachedAt = useRef<number>(0);

    const PAGE_SIZE = 10;
    const [userHasMore, setUserHasMore] = useState(true);
    const [loadingMoreUser, setLoadingMoreUser] = useState(false);
    const [userPageNumber, setUserPageNumber] = useState(0);

    const handleOrderPress = (orderId: string) => {

        // Navigate to order details screen or perform another action
    };

    const fetchUserOrders = useCallback(async(page = 0) => {
            if (page > 0 && (!userHasMore || loadingMoreUser)) {
                return;
            }
            
            try {
                if (page > 0) {
                    setLoadingMoreUser(true);
                }
                
                const response = await api.get<PageableResponse<Order>>(`/orders/all/${uid}`, {
                    params: {
                        page,
                        size: PAGE_SIZE
                    }
                });
                
                const content = response.data.content || [];
                if (page === 0) {
                    setUserOrders(content);
                } else {
                    setUserOrders(prev => {
                        const existingIds = new Set(prev.map(p => p.id));
                        const newItems = content.filter(c => c && !existingIds.has(c.id));
                        if (newItems.length === 0) return prev;
                        return [...prev, ...newItems];
                    });
                }
    
                // Prefer explicit server 'last' flag. If absent, fall back to page size check.
                const more = typeof response.data.last === 'boolean' ? !response.data.last : (content.length === PAGE_SIZE);
                setUserHasMore(more);
                // Use server-provided page number when available, otherwise use requested page
                setUserPageNumber(typeof response.data.number === 'number' ? response.data.number : page);
            } catch (error: any) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    console.error('Error fetching order history - Status:', error.response.status);
                    console.error('Error message:', error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('Error fetching order history - No response:', error.request);
                } else {
                    // Something happened in setting up the request
                    console.error('Error fetching order history:', error.message);
                }
            } finally {
                if (page > 0) {
                    setLoadingMoreUser(false);
                }
            }
        }, [uid, api, userHasMore, loadingMoreUser]);

        const filteredUserOrders = userOrders.filter(order => {
            if (userSelectedCategory === 'All') return true;
            const status = order.status.toUpperCase();
            if (userSelectedCategory === 'In-Progress' && status === 'IN-PROGRESS') return true;
            if (userSelectedCategory === 'Completed' && status === 'COMPLETED') return true;
            if (userSelectedCategory === 'Canceled' && status === 'CANCELED') return true;
            return false;
        });

        const orderCategories = ['All', 'In-Progress', 'Completed', 'Canceled'];
    
    return (
        <>
            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                {orderCategories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.filterTab,
                            userSelectedCategory === category && styles.activeFilterTab
                        ]}
                        onPress={() => setUserSelectedCategory(category)}
                    >
                        <Text
                            style={[
                                styles.filterTabText,
                                userSelectedCategory === category && styles.activeFilterTabText
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Order List (FlatList with infinite scroll) */}
            <FlatList
                data={filteredUserOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item: order }) => (
                    <OrderCard
                        id={order.id}
                        orderNumber={order.orderNumber}
                        orderedItems={order.orderedItems}
                        totalPrice={order.totalPrice}
                        status={order.status}
                        paymentStatus={order.paymentStatus}
                        orderDate={order.orderStartTime}
                        onPress={() => handleOrderPress(order.id)}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={() => {
                    // mark refresh time to prevent onEndReached from firing immediately
                    lastRefreshAt.current = Date.now();
                    setRefreshing(true);
                    // reset page number and fetch first page
                    setUserPageNumber(0);
                    setUserHasMore(true);
                    fetchUserOrders(0).finally(() => setRefreshing(false));
                }}
                // Automatically fetch next page when reaching the end (footer).
                onEndReached={() => {
                    const now = Date.now();
                    // ignore if we just refreshed
                    if (now - lastRefreshAt.current < 800) return;
                    // simple debounce to avoid duplicate rapid triggers
                    if (now - lastEndReachedAt.current < 800) return;
                    if (!refreshing && userHasMore && !loadingMoreUser) {
                        lastEndReachedAt.current = now;
                        fetchUserOrders(userPageNumber + 1);
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMoreUser ? (
                    <View style={styles.loadingMore}>
                        <ActivityIndicator size="small" color="#871919ff" />
                        <Text style={styles.loadingMoreText}>Loading more...</Text>
                    </View>
                ) : null}
            />
        </>
    );
}