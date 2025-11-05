import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
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
    const [orders, setOrders] = useState<Order[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const goBackHandler = () => { router.back() }

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchOrderHistory();
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setRefreshing(false);
        }
    };

    const fetchOrderHistory = useCallback(async () => {
        api.get(`/orders/all/${uid}`)
        .then((response) => {
            setOrders(response.data);
        })
        .catch((error) => {
            console.error('Error fetching order history:', error.message);
        })
    }, [api, uid]);

    const handleOrderPress = (orderId: string) => {
        console.log('Order pressed:', orderId);
        // Navigate to order details screen or perform another action
    };

    useEffect(() => {
        fetchOrderHistory();
    }, [fetchOrderHistory]);
    
    return (
        <View style={styles.container}>
            
            {/* Header with Back Button and Title */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                    <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order History</Text>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#871919ff"]} // Android
                        tintColor="#871919ff" // iOS
                    />
                }
                contentContainerStyle={{ paddingBottom: 80 }}
            >       

                {orders.length === 0 ? (
                    <Text style={styles.emptyMessage}>No orders found.</Text>
                ) : (
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
                    />
                )}
            </ScrollView>

        </View>
    );
}

