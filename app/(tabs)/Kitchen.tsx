import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../../services/api';
export default function Kitchen(){
    type Orders = {
    id: string;
    customerId: string;  //Subjected to be removed
    customerFirstName: string;
    customerLastName: string;
    waitressFirstName: string;
    waitressLastName: string;
    tableNumber: number;
    orderNumber: string;
    menuItemIds: string[];
    status: string;     // Order status: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  }

    const [orders, setOrders] = useState<Orders[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const onRefresh = () => {
        setRefreshing(true);
        setLoading(true);
        fetchOrders().finally(() => setRefreshing(false));
    };

    const fetchOrders = async () => {
        // try {
        // const uid = getAuth().currentUser?.uid;
        // if (!uid) return;
        // const res = await api.get(`/orders/recieveOrders`);
        // setOrders(res.data);
        // } catch (err) {
        // console.error('Failed to load orders:', err);
        // } finally {
        // setLoading(false);
        // }
    };

    useEffect(() => {fetchOrders();}, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrders();
        }, 10000); //10 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text>Loading orders...</Text>
          </View>
        );
      }

    const handleInProgressOrder = async(orderId : string) =>{
        api.put(`/orders/${orderId}/in-progress`).then(() => {
            setOrders((prevOrders) => 
                prevOrders.map((order) => 
                order.id === orderId ? { ...order, status: 'IN-PROGRESS' } : order)
            )
        }).catch((error) => {
            console.error('Failed to start order:', error);
        });
    } 

    const handleCompleteOrder = async (orderId: string) => {
        api.put(`/orders/${orderId}/complete`).then(() => {
            setOrders((prevOrders) => 
                prevOrders.map((order) => 
                order.id === orderId ? { ...order, status: 'COMPLETED' } : order)
            )
            console.log('Order completed successfully');
        }).catch((error) => {
            console.error('Failed to complete order:', error);
        });
    } 

    return (
        <View>
            <Text style={styles.header}>Kitchen</Text>
            {orders.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>No orders available.</Text>
            ) : null}
            <FlatList
                data={orders}
                keyExtractor={(order) => order.id}
                contentContainerStyle={{ paddingBottom: 80, paddingLeft: 10, paddingRight: 10 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={40}
                    />
                }
               renderItem={({ item }) => {
                    const isInProgress = item.status === 'IN-PROGRESS';
                    const isCompleted = item.status === 'COMPLETED';

                    const hasCustomer = item.customerFirstName && item.customerLastName;
                    const hasWaitress = item.waitressFirstName && item.waitressLastName && item.tableNumber;

                    return (
                        <TouchableOpacity activeOpacity={0.7}>
                            <View style={styles.card}>
                                <Text style={styles.orderNum}>Order: #{item.orderNumber}</Text>
                                {hasCustomer ? (
                                    <>
                                        <Text style={styles.name}>First Name: {item.customerFirstName}</Text>
                                        <Text style={styles.name}>Last Name: {item.customerLastName}</Text>
                                    </>
                                ) : hasWaitress ? (
                                    <>
                                        <Text style={styles.name}>Waitress Name: {item.waitressFirstName}, {item.waitressLastName}</Text>
                                        <Text style={styles.name}>Table Number: {item.tableNumber}</Text>
                                    </>
                                ) : (
                                    <Text style={styles.name}>Unknown Order</Text>
                                )}
                                <Text style={styles.name}>STATUS: {item.status}</Text>
                                <Text style={styles.orderList}>Order:{"\n"}{item.menuItemIds.join(', ')}</Text>
                                <TouchableOpacity
                                    onPress={() => handleInProgressOrder(item.id)}
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
                                        onPress={() => handleCompleteOrder(item.id)}
                                        style={[styles.addButton, { backgroundColor: '#2196F3', marginTop: 8 }]}
                                    >
                                        <Text style={styles.addButtonText}>Complete Order</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    orderNum: { fontSize: 25, fontWeight: 'bold', textAlign: 'center' },
    name: { fontSize: 16, alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginLeft: 20, marginBottom: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    orderList: { fontSize: 20, alignItems: 'center' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
    },
    addButton: {
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