import createAPIClient from '@/services/api';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

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

interface OrderCardKitchenrops {
    id: string;
    customer: User;
    waitress: User;
    orderNumber: string;
    orderedItems: OrderedItem[];
    totalPrice: number;
    status: string;
    paymentStatus: string;
    orderDate: string;
    onPress: () => void;
}

const OrderCardKitchen = ({
    id,
    customer,
    waitress,
    orderNumber,
    orderedItems,
    totalPrice,
    status,
    paymentStatus,
    orderDate,
    onPress,
}: OrderCardKitchenrops) => {

const getStatusColor = () => {
    switch (status.toUpperCase()) {
        case 'COMPLETED':
            return '#22C55E'; // Green
        case 'CANCELED':
            return '#EF4444'; // Red
        case 'PENDING':
            return '#F59E0B'; // Orange/Amber
        case 'IN-PROGRESS':
            return '#3B82F6'; // Blue
        default:
            return '#b6b6b6ff'; // Gray
    }
};

const getProgressWidth = () => {
    switch (status.toUpperCase()) {
        case 'COMPLETED':
            return '100%';
        case 'CANCELED':
            return '100%';
        case 'PENDING':
            return '50%';
        case 'IN-PROGRESS':
            return '75%';
        default:
            return '0%';
    }
};

const api = useMemo(() => createAPIClient(), []);

const handleInProgressOrder = async(orderId : string) =>{
    api.patch(`/orders/in-progress/${orderId}`)
    .then(() => {
        console.log('Order is now in progress');
    }).catch((error) => {
        console.error('Failed to start order:', error);
    });
} 

const handleCompleteOrder = async (orderId: string) => {
    api.patch(`/orders/complete/${orderId}`).then(() => {
        console.log('Order completed successfully');
    }).catch((error) => {
        console.error('Failed to complete order:', error);
    });
} 

    const isInProgress = status === 'IN_PROGRESS';
    const isCompleted = status === 'COMPLETED';
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
            </View>

            {!waitress ? (
                <View>
                    <Text style={styles.orderNumber}>Customer: {customer?.firstName} {customer?.lastName}</Text>
                </View>
            ) : (
                <View>
                    <Text style={styles.orderNumber}>Waitress: {waitress?.firstName} {waitress?.lastName}</Text>
                </View>
                
            )}

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View style={styles.statusText}>
                    <Text style={{ 
                        color: getStatusColor(),
                        fontWeight: 'bold'
                    }}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Text>
                </View>
                <View style={styles.progressBackground}>
                    <View style={[
                        styles.progressFill, 
                        { width: getProgressWidth(), backgroundColor: getStatusColor() }
                    ]} />
                </View>
            </View>
            
            {/* Order items preview */}
            <View style={styles.itemsContainer}>
                {orderedItems.map((item, index) => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemQuantity}>{item.quantity}×</Text>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    </View>
                ))}
            </View>

            
            
            {/* Footer with total */}
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => handleInProgressOrder(id)}
                    style={[
                        styles.addButton,
                        isInProgress && { backgroundColor: '#ccc' }
                    ]}
                    disabled={isInProgress || isCompleted}
                >
                    <Text style={styles.addButtonText}>
                        {isInProgress ? 'In Progress' : 'Start Order'}
                    </Text>
                </TouchableOpacity>
                {isInProgress && (
                    <TouchableOpacity
                        onPress={() => handleCompleteOrder(id)}
                        style={[styles.addButton, { backgroundColor: '#2196F3', marginTop: 8 }]}
                    >
                        <Text style={styles.addButtonText}>Complete Order</Text>
                    </TouchableOpacity>
                )}
            </View>
                
                <View style={styles.paymentBadge}>
                    <Text style={styles.paymentText}>{new Date(orderDate).toLocaleTimeString()}</Text>
                </View>
            </TouchableOpacity>
        
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#871919ff',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    progressContainer: {
        marginBottom: 16,
    },
    statusText: {
        marginBottom: 4,
    },
    progressBackground: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
    },
    progressFill: {
        height: 6,
        borderRadius: 3,
    },
    itemsContainer: {
        marginBottom: 16,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 14,
        fontWeight: 'bold',
        width: 30,
        color: '#444',
    },
    itemName: {
        fontSize: 14,
        flex: 1,
        color: '#333',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    moreItems: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
    footer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#871919ff',
    },
    paymentBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#f8d7da',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    paymentText: {
        color: '#721c24',
        fontSize: 10,
        fontWeight: 'bold',
    },
    addButton: {
        flex: 1,
        marginTop: 8,
        padding: 10,
        backgroundColor: "#4CAF50",
        borderRadius: 6,
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default OrderCardKitchen;