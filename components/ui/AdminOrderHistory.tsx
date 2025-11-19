import createAPIClient from "@/services/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";
import { Text } from "react-native-paper";
import { Toast } from 'toastify-react-native';
import styles from "../../styles/AdminOrderHistory.styles";
import OrderHistoryCard from "../OrderHistoryCard";

type MenuItems = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageURL: string;
};

interface OrderedItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

type OrderHistory = {
    id: string;
    customerId: string;
    customerFirstName: string;
    customerLastName: string;
    waitressFirstName: string;
    waitressLastName: string;
    tableNumber: number;
    menuItemIds: string[];
    orderedItems?: OrderedItem[];
    status: string;
    paymentStatus: string;
    totalPrice: number;
    orderStartTime: string;
    orderEndTime: string;
}
interface OrderSearchProps {
    readonly orderSearch: string;
    readonly menuItems: MenuItems[];
}

export default function AdminOrderHistory({ orderSearch, menuItems } : OrderSearchProps) {

    const LoadingIndicatorComponent = () => (
        <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color="#871919ff" />
            <Text style={styles.loadingMoreText}>Loading more...</Text>
        </View>
    );
    
    const api = useMemo(() => createAPIClient(), []);
    const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Prevent concurrent page loads and track page-loading state separately from initial refreshing
    const [loadingMore, setLoadingMore] = useState(false);
    const loadingMoreRef = useRef(false);

    

    // Pagination states for each section
    const PAGE_SIZE = 20;
    const [orderPageNumber, setOrderPageNumber] = useState(0);
    const [hasMoreOrders, setHasMoreOrders] = useState(true);


    const handleOrderHistory = useCallback((page = 0, isRefresh = false) => {
        if (page > 0 && (!hasMoreOrders || refreshing)) {
            return;
        }

        // Clear previous data on refresh
        if (isRefresh) {
            setOrderHistory([]);
            setOrderPageNumber(0);
            setHasMoreOrders(true);
        }

        api.get('/orders', {
            params: {
                page,
                size: PAGE_SIZE
            }
        })
        .then((response) => {
            const content = response.data?.content || [];
            const last = response.data?.last;

            if (page === 0 || isRefresh) {
                setOrderHistory(content);
            } else {
                setOrderHistory(prev => {
                    const existingIds = new Set(prev.map((o: OrderHistory) => o.id));
                    const newItems = content.filter((o: OrderHistory) => !existingIds.has(o.id));
                    return [...prev, ...newItems];
                });
            }

            // Determine whether there are more pages. Prefer explicit `last` flag from API,
            // but fall back to checking page size if it's missing.
            const more = last === undefined ? content.length === PAGE_SIZE : !last;
            setHasMoreOrders(more);
            setOrderPageNumber(typeof response.data?.number === 'number' ? response.data.number : page);
        })
        .catch((error: any) => {
            const errorMessage = error.response?.data || error.message || 'Failed to fetch order history';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch order history',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
        })
        .finally(() => {
            setRefreshing(false);
            setLoadingMore(false);
            loadingMoreRef.current = false;
            if (page === 0) {
                setLoading(false);
            }
        });
    }, [api, hasMoreOrders, refreshing]);

    // Load initial page on mount (run once)
    useEffect(() => {
        handleOrderHistory(0, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <FlatList
            data={orderHistory.filter(order =>
                (order.customerFirstName + " " + order.customerLastName).toLowerCase().includes(orderSearch.toLowerCase()) ||
                (order.waitressFirstName + " " + order.waitressLastName).toLowerCase().includes(orderSearch.toLowerCase()) ||
                order.id.toLowerCase().includes(orderSearch.toLowerCase())
            )}
            contentContainerStyle={styles.orderList}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        handleOrderHistory(0, true);
                    }}
                    colors={['#871919ff']}
                    tintColor={'#871919ff'}
                />
            }
            onEndReached={() => {
                if (hasMoreOrders && !refreshing && !loadingMore) {
                    setLoadingMore(true);
                    handleOrderHistory(orderPageNumber + 1);
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? LoadingIndicatorComponent : undefined}
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Text style={styles.emptyIconText}>📋</Text>
                    </View>
                    <Text style={styles.emptyMessage}>No order history found</Text>
                    <Text style={styles.emptySubtext}>Orders will appear here once customers place them</Text>
                </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            keyExtractor={(item) => item.id}
            renderItem={({ item: order }) => {
                let orderedItems = order.orderedItems || [];
                if (orderedItems.length === 0 && order.menuItemIds) {
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
            }}
        />
    );
}