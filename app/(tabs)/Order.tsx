import OrderCard from '@/components/OrderCard';
import OrderCardKitchen from '@/components/OrderCardKitchen';
import ViewControl from '@/components/ViewSwitcher';
import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

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

export default function OrderScreen() {
    const { uid, userRole } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const [refreshing, setRefreshing] = useState(false);
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [kitchenOrders, setKitchenOrders] = useState<Order[]>([]);
    const [userSelectedCategory, setUserSelectedCategory] = useState<string>('All');
    const [kitchenSelectedCategory, setKitchenSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedIndex, setSelectedIndex] = useState<number>(userRole === 'CUSTOMER' ? 0 : 1);

    const goBackHandler = () => { router.back() }

    const fetchUserOrders = useCallback(async() => {
        api.get(`/orders/all/${uid}`)
            .then((response) => {
                setUserOrders(response.data);
            })
            .catch((error) => {
                console.error('Error fetching order history:', error.response.data);
            })
    }, [uid, api]);

    const fetchKitchenOrders = useCallback(async() => {
        api.get(`/orders/kitchen`)
            .then((response) => {
                setKitchenOrders(response.data);
                console.log("KITCHEN ORDERS:", response.data);
            })
            .catch((error) => {
                console.error("Error status:", error.response.status);
                console.error('Error fetching kitchen orders:', error.response.data);
            })
    }, [api]);

    const handleOrderPress = (orderId: string) => {
        console.log('Order pressed:', orderId);
        // Navigate to order details screen or perform another action
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchUserOrders();
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserOrders();
        fetchKitchenOrders();
    }, [fetchUserOrders, fetchKitchenOrders]);

    // Filtering logic for order status
    const orderCategories = ['All', 'In-Progress', 'Completed', 'Canceled'];
    const filteredUserOrders = userOrders.filter(order => {
        if (userSelectedCategory === 'All') return true;
        const status = order.status.toUpperCase();
        if (userSelectedCategory === 'In-Progress' && status === 'IN-PROGRESS') return true;
        if (userSelectedCategory === 'Completed' && status === 'COMPLETED') return true;
        if (userSelectedCategory === 'Canceled' && status === 'CANCELED') return true;
        return false;
    });

    const filteredKitchenOrders = kitchenOrders.filter(order => {
        if (kitchenSelectedCategory === 'All') return true;
        const status = order.status.toUpperCase();
        if (kitchenSelectedCategory === 'In-Progress' && status === 'IN-PROGRESS') return true;
        if (kitchenSelectedCategory === 'Completed' && status === 'COMPLETED') return true;
        if (kitchenSelectedCategory === 'Canceled' && status === 'CANCELED') return true;
        return false;
    });

    return (
        <View style={styles.container}>
            {/* Header with Back Button and Title */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                    <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Orders</Text>
            </View>

            {/* View Switcher */}
            {userRole && (userRole === 'WAITRESS' || userRole === 'ADMIN' || userRole === 'CHEF') && (
                <ViewControl
                    values={["Customer", "Kitchen"]}
                    selectedIndex={selectedIndex}
                    onChange={setSelectedIndex}
                    width={300}
                    height={40}
                    activeColor="#ffffff"
                    inactiveColor="#d3d3d3"
                    activeTextColor="#000"
                    textColor="#333"
                    borderRadius={20}
                    containerStyle={{ alignSelf: "center", marginVertical: 20 }}
                />
            )}

            {/*Customer View*/}
            {selectedIndex === 0 && (
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

                    {/* Order List */}
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={["#871919ff"]} // Android
                                tintColor="#871919ff" // iOS
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                    >
                        {filteredUserOrders.length === 0 ? (
                            <Text style={styles.emptyMessage}>No orders found.</Text>
                        ) : (
                            filteredUserOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    id={order.id}
                                    orderNumber={order.orderNumber}
                                    orderedItems={order.orderedItems}
                                    totalPrice={order.totalPrice}
                                    status={order.status}
                                    paymentStatus={order.paymentStatus}
                                    orderDate={order.orderStartTime}
                                    onPress={() => handleOrderPress(order.id)}
                                />
                            ))
                        )}
                    </ScrollView>
                </>
            )}

            {/*Kitchen View*/}
            {selectedIndex === 1 && (
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

                    {/* Order List */}
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={["#871919ff"]} // Android
                                tintColor="#871919ff" // iOS
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                    >
                        {filteredKitchenOrders.length === 0 ? (
                            <Text style={styles.emptyMessage}>No orders found.</Text>
                        ) : (
                            filteredKitchenOrders.map(order => (
                                <OrderCardKitchen
                                    key={order.id}
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
                            ))
                        )}
                    </ScrollView>
                </>
            )}
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
        marginBottom: "1%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    headerTitle: {
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
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    filterTab: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        minWidth: 80,
        alignItems: 'center',
    },
    activeFilterTab: {
        backgroundColor: '#871919ff',
    },
    filterTabText: {
        color: '#333',
        fontWeight: '500',
    },
    activeFilterTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#7e7d7dff',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
});

