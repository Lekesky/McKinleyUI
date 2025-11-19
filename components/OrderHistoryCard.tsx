
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import styles from '../styles/components/OrderHistoryCard.styles';

interface OrderedItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface OrderHistoryCardProps {
    id: string;
    customerFirstName: string;
    customerLastName: string;
    waitressFirstName?: string | null;
    waitressLastName?: string | null;
    tableNumber: number;
    orderedItems: OrderedItem[];
    status: string;
    paymentStatus: string;
    totalPrice: number;
    orderStartTime: string;
    orderEndTime: string | null;
    onPress?: () => void;
}



const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({
    id,
    customerFirstName,
    customerLastName,
    waitressFirstName,
    waitressLastName,
    tableNumber,
    orderedItems,
    status,
    paymentStatus,
    totalPrice,
    orderStartTime,
    orderEndTime,
    onPress
}) => {
    return (
        <TouchableOpacity 
            style={styles.orderCard}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderTitle}>Order #{id.slice(-6)}</Text>
                    <Text style={styles.orderDate}>{new Date(orderStartTime).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    {/* Show status badge with label */}
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.statusLabel}>Order Status</Text>
                        <Text style={[
                            styles.orderStatus, 
                            status === 'COMPLETED' ? styles.statusCompleted : 
                            status === 'IN-PROGRESS' ? styles.statusInProgress : 
                            status === 'PENDING' ? styles.statusPending : 
                            styles.statusCanceled
                        ]}>
                            {status}
                        </Text>
                    </View>
                    {/* Show payment badge with label below */}
                    <View style={{ alignItems: 'center', marginTop: 8 }}>
                        <Text style={styles.paymentLabel}>Payment</Text>
                        <Text style={[
                            styles.paymentStatus, 
                            paymentStatus === 'PAID' ? styles.statusCompleted : 
                            styles.statusPending
                        ]}>
                            {paymentStatus}
                        </Text>
                    </View>
                </View>
            </View>

            {customerFirstName && customerLastName && (
                <View style={styles.userInfoRow}>
                    <View style={styles.infoIconContainer}>
                        <Icon source="account" size={18} color="#666" />
                    </View>
                    <Text style={styles.infoText}>
                        {customerFirstName} {customerLastName}
                    </Text>
                </View>
            )}
            
            {waitressFirstName && waitressLastName && (
                <View style={styles.userInfoRow}>
                    <View style={styles.infoIconContainer}>
                        <Icon source="account-tie" size={18} color="#666" />
                    </View>
                    <Text style={styles.infoText}>
                        Served by: {waitressFirstName} {waitressLastName}
                    </Text>
                </View>
            )}

            <View style={styles.userInfoRow}>
                <View style={styles.infoIconContainer}>
                    <Icon source="table-chair" size={18} color="#666" />
                </View>
                <Text style={styles.infoText}>
                    {tableNumber !== 0 ? `Table ${tableNumber}` : 'No table'}
                </Text>
            </View>

            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Items:</Text>
            {Array.isArray(orderedItems) && orderedItems.length > 0 ? (
                <View style={styles.itemsList}>
                    {orderedItems.map((item) => (
                        <View key={item.id} style={styles.orderItem}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemCount}>×{item.quantity}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.emptyMessage}>No items</Text>
            )}
            
            <View style={styles.orderTotal}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>
            
            <View style={styles.orderTimes}>
                <Text style={styles.timeInfo}>
                    Ordered: {orderStartTime ? new Date(orderStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                </Text>
                {orderEndTime && (
                    <Text style={styles.timeInfo}>
                        Completed: {new Date(orderEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default OrderHistoryCard;