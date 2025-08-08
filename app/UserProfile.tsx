import api from "@/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function UserProfile() {
    const router = useRouter();
    const { user: userId } = useLocalSearchParams();

    const [user, setUser] = useState<User | null>(null);
    const [userOrder, setUserOrder] = useState<OrderHistory[] | null>(null);
    const [editRole, setEditRole] = useState("");
    const [loading, setLoading] = useState(true);

    type User = {
        uid: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        userRole: string;
    };

    type OrderHistory = {
        id: string;
        waitressFirstName: string;
        waitressLastName: string;
        tableNumber: number;
        menuItemIds: string[];
        totalPrice: number;
        orderStartTime: string;
        orderEndTime: string;
    }

    useEffect(() => {
        
        if (userId) {
            api.get(`/user/${userId}`)
                .then(res => {
                    setUser(res.data);
                    setEditRole(res.data.userRole);
                    

                    api.get(`/orders/customer/${userId}`)
                        .then(res => {
                            console.log("Order history:", res.data);
                            setUserOrder(Array.isArray(res.data) ? res.data : []);
                        })
                        .catch(err => {
                            console.error("Failed to fetch order history:", err);
                        });

                })
                .catch(() => setUser(null))
                .finally(() => setLoading(false));
        }
    }, [userId]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No user data found.</Text>
                <Button onPress={() => router.back()}>Back</Button>
            </View>
        );
    }

    const handleUpdateRole = async () => {
        console.log("Updating role for user:", userId, "to", editRole);
        api.put(`/user/role/update/${userId}`, 
            editRole, 
            { headers: { "Content-Type": "text/plain" } }
        ).then((response) => {
            alert("Role updated successfully: " + response.data);

        }).catch(() => {
            alert("Failed to update role");
        });
    };

    return (
        <View style={{ flex: 1, padding: 24, marginTop: 50 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
                User Profile
            </Text>
            <Text style={{ marginBottom: 8 }}>
                Name: {user.firstName} {user.lastName}
            </Text>
            <Text style={{ marginBottom: 8 }}>
                Phone Number: {user.phoneNumber}
            </Text>
            <Text style={{ marginBottom: 8 }}>
                Current Role: {user.userRole}
            </Text>
            <Text style={{ marginBottom: 8, fontWeight: "bold" }}>Change Role:</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                <Button
                    mode={editRole === "CUSTOMER" ? "contained" : "outlined"}
                    onPress={() => setEditRole("CUSTOMER")}
                    style={{ flex: 1, marginRight: 4 }}
                >
                    Customer
                </Button>
                <Button
                    mode={editRole === "WAITRESS" ? "contained" : "outlined"}
                    onPress={() => setEditRole("WAITRESS")}
                    style={{ flex: 1, marginHorizontal: 4 }}
                >
                    Waitress
                </Button>
                <Button
                    mode={editRole === "CHEF" ? "contained" : "outlined"}
                    onPress={() => setEditRole("CHEF")}
                    style={{ flex: 1, marginLeft: 4 }}
                >
                    Chef
                </Button>
            </View>

            <Button mode="contained" onPress={handleUpdateRole} disabled={editRole === "ADMIN"}>
                Update Role
            </Button>

            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8, marginTop: 24 }}>
                Order History
            </Text>
            <View style={{ flex: 1, maxHeight: 350 }}>
                <ScrollView>
                    {userOrder && userOrder.length > 0 ? (
                        userOrder.map((order: OrderHistory) => (
                            <View
                                key={order.id}
                                style={{
                                    marginBottom: 20,
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: 10,
                                    padding: 16,
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.08,
                                    shadowRadius: 4,
                                    elevation: 2,
                                    borderWidth: 1,
                                    borderColor: "#e0e0e0"
                                }}
                            >
                                <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
                                    Order ID: {order.id}
                                </Text>
                                <Text style={{ fontWeight: "bold", marginTop: 4 }}>Order Items:</Text>
                                {order.menuItemIds && order.menuItemIds.length > 0 ? (
                                    <View style={{ marginLeft: 12, marginBottom: 4 }}>
                                        {Object.entries(
                                            order.menuItemIds.reduce((acc: Record<string, number>, id: string) => {
                                                acc[id] = (acc[id] || 0) + 1;
                                                return acc;
                                            }, {})
                                        ).map(([itemId, count]) => (
                                            <Text key={itemId}>
                                                • {itemId} {count > 1 && <Text style={{ color: "#888" }}>×{count}</Text>}
                                            </Text>
                                        ))}
                                    </View>
                                ) : (
                                    <Text style={{ marginLeft: 12, fontStyle: "italic" }}>No items</Text>
                                )}
                                {order.tableNumber !== 0 && (
                                    <Text>
                                        Table Number: {order.tableNumber}
                                    </Text>
                                )}
                                <Text>
                                    Total Price: ${order.totalPrice.toFixed(2)}
                                </Text>
                                <Text>
                                    Order Created At: {order.orderStartTime ? new Date(order.orderStartTime).toLocaleString() : "N/A"}
                                </Text>
                                <Text>
                                    Order Fulfilled: {order.orderEndTime ? new Date(order.orderEndTime).toLocaleString() : "No time available"}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text>No order history found.</Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}