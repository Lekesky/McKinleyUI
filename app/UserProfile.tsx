import OrderHistoryCard from "@/components/OrderHistoryCard";
import createAPIClient from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon, PaperProvider } from 'react-native-paper';
type OrderedItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

type OrderHistory = {
    id: string;
    customerFirstName: string;
    customerLastName: string;
    waitressFirstName: string;
    waitressLastName: string;
    tableNumber: number;
    menuItemIds: string[];
    orderedItems: OrderedItem[];
    totalPrice: number;
    orderStartTime: string;
    orderEndTime: string | null;
    status: string;
    paymentStatus: string;
};

type User = {
    uid: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    userRole: string;
};


export default function UserProfile() {
    const { user: uid } = useLocalSearchParams();
    const api = useMemo(() => createAPIClient(), []);
    const [user, setUser] = useState<User | null>(null);
    const [userOrder, setUserOrder] = useState<OrderHistory[]>([]);
    const [displayedOrders, setDisplayedOrders] = useState<OrderHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [editRole, setEditRole] = useState<string>("");
    const [refreshing, setRefreshing] = useState(false);
    const [showAllOrders, setShowAllOrders] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await api.get(`/user/${uid}`);
                setUser(userResponse.data);
                setEditRole(userResponse.data.userRole);
                try {
                    // Second API call - get orders
                    const ordersResponse = await api.get(`/orders/all/${uid}`);
                    const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];
                    
                    // Sort orders by start time (most recent first)
                    const sortedOrders = [...orders].sort((a, b) => 
                        new Date(b.orderStartTime).getTime() - new Date(a.orderStartTime).getTime()
                    );
                    
                    setUserOrder(sortedOrders);
                } catch (ordersError: any) {
                    console.error("Error fetching orders:", ordersError.message);
                }
            } catch (userError: any) {
                console.error("Error fetching user data:", userError.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uid, api]);
    

    
    // Update displayed orders whenever userOrder changes or when showAllOrders toggle changes
    useEffect(() => {
        if (userOrder.length > 0) {
            setDisplayedOrders(showAllOrders ? userOrder : userOrder.slice(0, 5));
        } else {
            setDisplayedOrders([]);
        }
    }, [userOrder, showAllOrders]);
    
    // Handle pull-to-refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            if (uid) {
                const userResponse = await api.get(`/user/${uid}`);
                setUser(userResponse.data);
                setEditRole(userResponse.data.userRole);
                
                const orderResponse = await api.get(`/orders/all/${uid}`);
                const orders = Array.isArray(orderResponse.data) ? orderResponse.data : [];
                
                // Sort orders by start time (most recent first)
                const sortedOrders = [...orders].sort((a, b) => 
                    new Date(b.orderStartTime).getTime() - new Date(a.orderStartTime).getTime()
                );
                
                setUserOrder(sortedOrders);
            }
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setRefreshing(false);
        }
    }, [uid, api]);

    const goBackHandler = () => router.back();

    const handleUpdateRole = async () => {
        // Prevent updates if the role is the same
        if (editRole === user?.userRole) {
            return;
        }
        
        api.patch(`/user/role/${uid}`, editRole, { headers: { "Content-Type": "text/plain" } })
            .then((response) => { 
                alert("Role updated successfully: " + response.data);
                // Update the user object to reflect the new role
                if (user) {
                    setUser({...user, userRole: editRole});
                }
            })
            .catch(() => { alert("Failed to update role") });
    };
    

    // Display loading state while data is being fetched
    if (loading) {
        return (
            <PaperProvider>
                <View style={styles.centeredContainer}>
                    <Text style={styles.loadingText}>Loading user profile...</Text>
                </View>
            </PaperProvider>
        );
    }

    // Display error state if user data couldn't be fetched
    if (!user) {
        return (
            <PaperProvider>
                <View style={styles.centeredContainer}>
                    <Text style={styles.errorTitle}>Could not load profile</Text>
                    <Button 
                        mode="contained" 
                        onPress={onRefresh} 
                        style={styles.buttonPrimary}
                        labelStyle={{ color: "#fff", fontSize: 15, fontWeight: '600', letterSpacing: 0.5 }}
                        contentStyle={{ height: 46 }}
                    >
                        Retry
                    </Button>
                </View>
            </PaperProvider>
        );
    }
    
    return (
        <PaperProvider>
            <ScrollView 
                style={styles.scrollContainer} 
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#871919ff"]} tintColor="#871919ff" />
                }
            >
            {/* Header with Back Button and Title */} 
            <View style={styles.header}>
                <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                    <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Profile</Text>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <Text style={styles.profileTitle}>User Profile</Text>
                <View style={styles.profileDetail}>
                    <View style={styles.profileIcon}>
                        <Icon source="account" size={20} color="#871919ff" />
                    </View>
                    <View>
                        <Text style={styles.profileLabel}>Name</Text>
                        <Text style={styles.profileValue}>{user.firstName} {user.lastName}</Text>
                    </View>
                </View>
                <View style={styles.profileDetail}>
                    <View style={styles.profileIcon}>
                        <Icon source="phone" size={20} color="#871919ff" />
                    </View>
                    <View>
                        <Text style={styles.profileLabel}>Phone Number</Text>
                        <Text style={styles.profileValue}>{user.phoneNumber}</Text>
                    </View>
                </View>
                <View style={styles.profileDetail}>
                    <View style={styles.profileIcon}>
                        <Icon source="badge-account-horizontal" size={20} color="#871919ff" />
                    </View>
                    <View>
                        <Text style={styles.profileLabel}>Current Role</Text>
                        <Text style={styles.profileValue}>{user.userRole}</Text>
                    </View>
                </View>
            </View>

            {/* Role Change Section */}
            <View style={styles.sectionCard}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <Icon source="account-convert" size={24} color="#871919ff" />
                    <Text style={[styles.sectionTitle, {marginLeft: 10}]}>
                        Change Role
                    </Text>
                </View>
                <View style={styles.roleButtonRow}>
                    <Button
                        mode={editRole === "CUSTOMER" ? "contained" : "outlined"}
                        onPress={() => setEditRole("CUSTOMER")}
                        style={[
                            styles.roleButton, 
                            editRole === "CUSTOMER" && styles.activeRoleButton
                        ]}
                        labelStyle={{ color: editRole === "CUSTOMER" ? "#fff" : "#871919ff", fontSize: 13, fontWeight: '600' }}
                        icon={() => <Icon source="account" size={18} color={editRole === "CUSTOMER" ? "#fff" : "#871919ff"} />}
                    >
                        Customer
                    </Button>
                    <Button
                        mode={editRole === "WAITRESS" ? "contained" : "outlined"}
                        onPress={() => setEditRole("WAITRESS")}
                        style={[
                            styles.roleButton, 
                            editRole === "WAITRESS" && styles.activeRoleButton
                        ]}
                        labelStyle={{ color: editRole === "WAITRESS" ? "#fff" : "#871919ff", fontSize: 13, fontWeight: '600' }}
                        icon={() => <Icon source="food-fork-drink" size={18} color={editRole === "WAITRESS" ? "#fff" : "#871919ff"} />}
                    >
                        Waitress
                    </Button>
                    <Button
                        mode={editRole === "CHEF" ? "contained" : "outlined"}
                        onPress={() => setEditRole("CHEF")}
                        style={[
                            styles.roleButton, 
                            editRole === "CHEF" && styles.activeRoleButton
                        ]}
                        labelStyle={{ color: editRole === "CHEF" ? "#fff" : "#871919ff", fontSize: 13, fontWeight: '600' }}
                        icon={() => <Icon source="chef-hat" size={18} color={editRole === "CHEF" ? "#fff" : "#871919ff"} />}
                    >
                        Chef
                    </Button>
                </View>
                <Button 
                    mode="contained" 
                    onPress={handleUpdateRole} 
                    disabled={editRole === "" || editRole === user.userRole} 
                    style={[
                        styles.buttonPrimary,
                        (editRole === "" || editRole === user.userRole) && styles.disabledButton
                    ]}
                    labelStyle={{ 
                        color: (editRole === "" || editRole === user.userRole) ? "#9E9E9E" : "#fff", 
                        fontSize: 15, 
                        fontWeight: '600', 
                        letterSpacing: 0.5 
                    }}
                    contentStyle={{ height: 46 }}
                >
                    {editRole === user.userRole ? "Current Role" : "Update Role"}
                </Button>
            </View>

            {/* Order History Section */}
            <View style={styles.sectionCard}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <Icon source="history" size={24} color="#871919ff" />
                    <Text style={[styles.sectionTitle, {marginLeft: 10}]}>
                        Order History
                    </Text>
                </View>
                {displayedOrders && displayedOrders.length > 0 ? (
                    <>
                        {displayedOrders.map((order) => (
                            <OrderHistoryCard
                                key={order.id}
                                id={order.id}
                                customerFirstName={order.customerFirstName}
                                customerLastName={order.customerLastName}
                                waitressFirstName={order.waitressFirstName}
                                waitressLastName={order.waitressLastName}
                                tableNumber={order.tableNumber}
                                orderedItems={order.orderedItems || []}
                                status={order.status || "PENDING"}
                                paymentStatus={order.paymentStatus || "PENDING"}
                                totalPrice={order.totalPrice}
                                orderStartTime={order.orderStartTime}
                                orderEndTime={order.orderEndTime}
                            />
                        ))}
                        
                        {/* View More / View Less Button */}
                        {userOrder.length > 5 && (
                                <Button
                                mode="outlined"
                                onPress={() => setShowAllOrders(!showAllOrders)}
                                style={styles.viewMoreButton}
                                labelStyle={{ color: "#871919ff", fontSize: 14 }}
                                icon={() => <Icon source={showAllOrders ? "chevron-up" : "chevron-down"} size={20} color="#871919ff" />}
                            >
                                {showAllOrders ? "View Less" : "View More"}
                            </Button>
                        )}
                    </>
                ) : (
                    <Text style={styles.emptyMessage}>No order history found.</Text>
                )}
            </View>
        </ScrollView>
        </PaperProvider>
    );
}


const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 18,
        paddingTop: 45,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    viewMoreButton: {
        marginTop: 10,
        marginBottom: 5,
        borderColor: '#871919ff',
        borderRadius: 25,
        alignSelf: 'center',
        width: '50%',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 18,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    profileTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#871919ff',
        marginBottom: 10,
        fontFamily: 'Helvetica',
    },
    profileDetail: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 8,
    },
    profileIcon: {
        marginRight: 12,
        marginTop: 3,
    },
    profileLabel: {
        fontWeight: 'bold',
        color: '#871919ff',
        fontSize: 14,
        marginBottom: 2,
    },
    profileValue: {
        fontSize: 16,
        color: '#333',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 18,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#871919ff',
        marginBottom: 10,
        fontFamily: 'Helvetica',
    },
    roleButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 5,
    },
    roleButton: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#871919ff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    activeRoleButton: {
        backgroundColor: '#871919ff',
    },
    buttonPrimary: {
        backgroundColor: '#871919ff',
        borderRadius: 25,
        marginTop: 12,
        marginBottom: 2,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },
    disabledButton: {
        backgroundColor: '#D3D3D3',
        opacity: 0.8,
        elevation: 1,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    orderId: {
        fontWeight: '700',
        fontSize: 17,
        marginBottom: 12,
        color: '#871919ff',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderLabel: {
        fontWeight: '700',
        marginTop: 8,
        color: '#333',
        fontSize: 15,
    },
    orderValue: {
        fontWeight: '400',
        color: '#333',
    },
    orderItemsList: {
        marginLeft: 12,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 8,
    },
    orderItemText: {
        fontSize: 15,
        color: '#333',
        paddingVertical: 3,
    },
    orderItemCount: {
        color: '#871919ff',
        fontSize: 14,
        fontWeight: '600',
    },
    orderNoItems: {
        marginLeft: 12,
        fontStyle: 'italic',
        color: '#888',
        marginVertical: 8,
    },
    timeSection: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    priceText: {
        fontWeight: '600',
        fontSize: 16,
        color: '#871919ff',
    },
    pendingText: {
        color: '#e69500',
        fontStyle: 'italic',
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#7e7d7dff',
        fontFamily: 'Helvetica',
        fontSize: 16,
        marginVertical: 10,
        maxWidth: '80%',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
        fontFamily: 'Helvetica',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        width: '100%',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#871919ff',
        marginVertical: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        marginTop: 30,
        marginBottom: "5%",
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
});