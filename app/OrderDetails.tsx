import createAPIClient from '@/services/api';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Divider, Icon, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/OrderDetails.styles';

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
    email: string;
    phoneNumber: string;
    userRole: string;
    signInMethod: string;
    timeCreated: string;
    registerPushToken: string | null;
}

interface Order {
    id: string;
    orderNumber: string;
    customer: User;
    waitress: User | null;
    tableNumber: number;
    orderedItems: OrderedItem[];
    totalPrice: number;
    status: string;
    paymentStatus: string;
    orderStartTime: string;
    orderEndTime: string | null;
}

export default function OrderDetails() {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const api = useMemo(() => createAPIClient(), []);
    const insets = useSafeAreaInsets();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const goBackHandler = () => { router.back() };

    useEffect(() => {
        const fetchOrderDetails = () => {
            api.get(`/orders/${orderId}`)
                .then((response) => {
                    console.log('Order details fetched:', response.data);
                    setOrder(response.data);
                })
                .catch((error: any) => {
                    const errorMessage = error.response?.data || error.message || 'Failed to fetch order details';
                    console.error('Error fetching order details:', errorMessage);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [api, orderId]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return '#FFA500';
            case 'PREPARING':
                return '#2196F3';
            case 'READY':
                return '#4CAF50';
            case 'COMPLETED':
                return '#4CAF50';
            case 'CANCELED':
                return '#F44336';
            default:
                return '#9E9E9E';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PAID':
                return '#4CAF50';
            case 'PENDING':
                return '#FFA500';
            case 'FAILED':
                return '#F44336';
            default:
                return '#9E9E9E';
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#871919ff" />
                    <Text style={styles.loadingText}>Loading order details...</Text>
                </View>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {Platform.OS !== 'web' && (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                            <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Order Details</Text>
                    </View>
                )}
                <View style={styles.errorContainer}>
                    <Icon source="alert-circle" size={48} color="#F44336" />
                    <Text style={styles.errorText}>Order not found</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { paddingTop: insets.top }]}
            contentContainerStyle={styles.scrollContent}
        >
            {Platform.OS !== 'web' && (
                <View style={styles.header}>
                    <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                        <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Order Details</Text>
                </View>
            )}

            {/* Order Number and Status */}
            <View style={styles.orderHeaderCard}>
                <View style={styles.orderNumberSection}>
                    <Text style={styles.orderNumberLabel}>Order #{order.orderNumber}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.orderStartTime)}</Text>
                </View>
                <View style={styles.statusSection}>
                    <View style={styles.statusGroup}>
                        <Text style={styles.statusLabel}>Order Status:</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                            <Text style={styles.statusText}>{order.status}</Text>
                        </View>
                    </View>
                    <View style={styles.statusGroup}>
                        <Text style={styles.statusLabel}>Payment:</Text>
                        <View style={[styles.paymentBadge, { backgroundColor: getPaymentStatusColor(order.paymentStatus) }]}>
                            <Text style={styles.paymentText}>{order.paymentStatus}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Customer & Service Information */}
            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Order Information</Text>
                <Divider style={styles.divider} />
                
                {/* Show either customer name OR table number, not both */}
                {order.customer?.firstName && order.customer?.lastName ? (
                    <View style={styles.infoRow}>
                        <Icon source="account" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Customer:</Text>
                        <Text style={styles.infoValue}>{order.customer.firstName} {order.customer.lastName}</Text>
                    </View>
                ) : order.tableNumber && order.tableNumber !== 0 ? (
                    <View style={styles.infoRow}>
                        <Icon source="table-furniture" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Table:</Text>
                        <Text style={styles.infoValue}>Table {order.tableNumber}</Text>
                    </View>
                ) : null}

                {order.waitress?.firstName && order.waitress?.lastName && (
                    <View style={styles.infoRow}>
                        <Icon source="account-tie" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Server:</Text>
                        <Text style={styles.infoValue}>{order.waitress.firstName} {order.waitress.lastName}</Text>
                    </View>
                )}

                {order.orderEndTime && (
                    <View style={styles.infoRow}>
                        <Icon source="clock-check" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Completed:</Text>
                        <Text style={styles.infoValue}>{formatDate(order.orderEndTime)}</Text>
                    </View>
                )}
            </View>

            {/* Ordered Items */}
            <View style={styles.itemsCard}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                <Divider style={styles.divider} />
                
                {order.orderedItems.map((item, index) => (
                    <View key={item.id || index}>
                        <View style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                        {index < order.orderedItems.length - 1 && <Divider style={styles.itemDivider} />}
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={styles.totalCard}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalAmount}>${order.totalPrice.toFixed(2)}</Text>
                </View>
            </View>
        </ScrollView>
    );
}
