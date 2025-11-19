import OrderHistoryCard from "@/components/OrderHistoryCard";
import createAPIClient from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon, PaperProvider } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
import styles from "../styles/UserProfile.styles";

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
                    // Second API call - get orders with pagination
                    const ordersResponse = await api.get(`/orders/all/${uid}`, {
                        params: {
                            page: 0,  // API uses 0-based indexing
                            size: 10
                        }
                    });
                    const orders = ordersResponse.data.content || [];
                    
                    // Sort orders by start time (most recent first)
                    const sortedOrders = [...orders].sort((a, b) => 
                        new Date(b.orderStartTime).getTime() - new Date(a.orderStartTime).getTime()
                    );
                    
                    setUserOrder(sortedOrders);
                } catch (ordersError: any) {
                    const errorMessage = ordersError.response?.data || ordersError.message || 'Failed to fetch orders';
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch orders',
                        position: 'top',
                        backgroundColor: '#871919ff',
                        textColor: '#FFFFFF',
                    });
                }
            } catch (userError: any) {
                const errorMessage = userError.response?.data || userError.message || 'Failed to fetch user data';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch user data',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
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
                
                const orderResponse = await api.get(`/orders/all/${uid}`, {
                    params: {
                        page: 0,
                        size: 10
                    }
                });
                const orders = orderResponse.data.content || [];
                
                // Sort orders by start time (most recent first)
                const sortedOrders = [...orders].sort((a, b) => 
                    new Date(b.orderStartTime).getTime() - new Date(a.orderStartTime).getTime()
                );
                
                setUserOrder(sortedOrders);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data || error.message || 'Failed to refresh data';
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to refresh data',
                position: 'top',
                backgroundColor: '#871919ff',
                textColor: '#FFFFFF',
            });
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
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Role updated successfully: ' + response.data,
                    position: 'top',
                    backgroundColor: '#4CAF50',
                    textColor: '#FFFFFF',
                });
                // Update the user object to reflect the new role
                if (user) {
                    setUser({...user, userRole: editRole});
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to update role';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to update role',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
            });
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


