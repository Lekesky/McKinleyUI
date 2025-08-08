import ViewControl from "@/components/ViewSwitch";
import api from '@/services/api';
import { router } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import styles from "../../styles/Admin.styles";
export default function Admin(){

    // Define the type for staff members
    type Users = {
        uid: string;
        firstName: string;
        lastName: string;
        userRole: string;
    };
    // Define the type for products
    type MenuItems = {
        id: string;
        name: string;
        description: string;
        price: number;
        imageURL: string;
    };

    type OrderHistory = {
        id: string;
        customerId: string;
        customerFirstName: string;
        customerLastName: string;
        waitressFirstName: string;
        waitressLastName: string;
        tableNumber: number;
        menuItemIds: string[];
        status: string;
        paymentStatus: string;
        totalPrice: number;
        orderStartTime: string;
        orderEndTime: string;
    }

    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [productSearch, setProductSearch] = useState<string>("");
    const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
    const [staff, setStaff] = useState<Users[] | null>([]);
    const [customers, setCustomers] = useState<Users[] | null>([]);
    const [userSearch, setUserSearch] = useState<string>('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);

      
    const handleMembers = () =>{
        // Fetch staff members
        api.get(`user/staff`)
        .then(res => {
            console.log("Staff members: ", res.data);
            setStaff(res.data);
        }).catch(err => {
            console.error("Error fetching staff members: ", err);
        });

        // Fetch customers
        api.get(`user/customers`)
        .then(res => {
            console.log("Customers: ", res.data);
            setCustomers(res.data);
        }).catch(err => {
            console.error("Error fetching staff members: ", err);
        });
    }


    const handleMenuItmems = () => {
        api.get(`menu`)
        .then(res => {
            setMenuItems(res.data);
        }).catch(err => {
            console.error("Error fetching menu items: ", err);
        });
    }


    const handleOrderHistory = () => {
        api.get(`orders`)
        .then(res => {
            setOrderHistory(res.data);
        }).catch(err => {
            console.error("Error fetching order history: ", err);
        });
    }

    const handleStripe = () => {
        // Placeholder for Stripe functionality
        console.log("Stripe functionality not implemented yet.");
    }

    // Combine staff and customers for search
    const allUsers = [
        ...(staff || []),
        ...(customers || [])
    ];


    useEffect(() => {
        if(selectedIndex === 0) {
            handleStripe();
        }else if (selectedIndex === 1) {
            handleMembers();
        }else if (selectedIndex === 2) {
            handleMenuItmems();
        }else if (selectedIndex === 3) {
            handleOrderHistory();
        }

    }, [selectedIndex]);


    // Filter users based on search
    const filteredUsers = allUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearch.toLowerCase())
    );

    

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Admin Page</Text>
            <ViewControl
                values={["Stripe", "Members", "Menu", "Order History"]}
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
                width={440}
                height={45}
                activeColor="#ffffff"
                inactiveColor="#d3d3d3"
                activeTextColor="#000"
                textColor="#333"
                borderRadius={20}
                containerStyle={{ alignSelf: "center", marginVertical: 20, marginHorizontal: 10 }}
            />

            {selectedIndex === 0 && (
                <View>
                    <Text style={styles.subtitle}>Stripe:</Text>
                </View>
            )}

            {selectedIndex === 1 && (
                <View>
                <Text style={styles.subtitle}>Search Users:</Text>
                <TextInput
                    label="Search for user"
                    value={userSearch}
                    onChangeText={text => {
                        setUserSearch(text);
                        setDropdownVisible(true);
                    }}
                    mode="outlined"
                    style={{ marginBottom: 10, marginHorizontal: 0 }}
                />
                {dropdownVisible && userSearch.length > 0 && (
                    <View style={{ backgroundColor: '#fff', borderRadius: 5, elevation: 2, marginBottom: 10 }}>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => {
                                        setDropdownVisible(false);
                                        setUserSearch(`${user.firstName} ${user.lastName}`);
                                        // Navigate to UserProfile screen, passing user as param
                                        router.push({
                                            pathname: '/UserProfile',
                                            params: { user: user.uid }
                                        });
                                    }}
                                    style={{ padding: 10, borderBottomWidth: idx !== filteredUsers.length - 1 ? 1 : 0, borderColor: '#eee' }}
                                >
                                    <Text>{user.firstName} {user.lastName} - {user.userRole}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ padding: 10 }}>No users found.</Text>
                        )}
                    </View>
                )}

                    <Text style={styles.subtitle}>Staff Members:</Text>
                    {staff && staff.length > 0 ? (
                        staff.map((user, index) => (
                            <Text key={index}>
                                {user.firstName} {user.lastName} - {user.userRole}
                            </Text>
                        ))
                    ) : (
                        <Text>No staff members found.</Text>
                    )}
                    
                    <Text style={styles.subtitle}>Members:</Text>
                    {customers && customers.length > 0 ? (
                        customers.map((user, index) => (
                            <Text key={index}>
                                {user.firstName} {user.lastName} - {user.userRole}
                            </Text>
                        ))
                    ) : (
                        <Text>No staff members found.</Text>
                    )}
                </View>
            )}

            {selectedIndex === 2 && (
                <View>
                    <Text style={styles.subtitle}>Menu:</Text>

                    {/*Search for product */}
                    <TextInput
                        label="Search for product"
                        value={productSearch}
                        onChangeText={setProductSearch}
                        mode="outlined"
                        style={{ marginBottom: 20, marginHorizontal: 20 }}
                    />
                   <TouchableOpacity
                        style={{
                            backgroundColor: '#63D471',
                            padding: 10,
                            borderRadius: 5,
                            marginHorizontal: 20,
                            marginBottom: 15,
                            alignItems: 'center',
                        }}
                        onPress={() =>
                            router.push({
                                pathname: '/EditProduct',
                                params: { 
                                    product: JSON.stringify({ 
                                        id: '', name: '', description: '', price: 0, imageURL: '' 
                                    }) 
                                },
                            })
                        }
                    >
                        <Text style={{ color: '#fff' }}>Add a Menu Item</Text>
                    </TouchableOpacity>
                    <ScrollView style={{ marginHorizontal: 20, maxHeight: 550}}>
                        {menuItems && menuItems.length > 0 ? (
                            menuItems.filter(item =>
                                item.name.toLowerCase().includes(productSearch.toLowerCase())
                            ).map((item, index) => (
                                <View key={index} style={{ marginBottom: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                    <Text>{item.description}</Text>
                                    <Image source={{ uri: item.imageURL }} style={{ width: 100, height: 100 }} />
                                    <Text>${item.price.toFixed(2)}</Text>
                                    <TouchableOpacity
                                            style={{
                                                backgroundColor: '#007bff',
                                                padding: 10,
                                                borderRadius: 5,
                                                marginTop: 5,
                                                alignSelf: 'flex-start',
                                            }}
                                            onPress={() =>
                                                router.push({
                                                    pathname: '/EditProduct',
                                                    params: { product: JSON.stringify(item) },
                                                })
                                            }
                                        >
                                            <Text style={{ color: '#fff' }}>Edit</Text>
                                        </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text>Menu Item could not be found.</Text>
                        )}
                    </ScrollView>

                </View>
            )}

            {selectedIndex === 3 && (
                <View>
                    <Text style={styles.subtitle}>Order History:</Text>
                    <TextInput
                        label="Search orders"
                        value={productSearch}
                        onChangeText={setProductSearch}
                        mode="outlined"
                        style={{ marginBottom: 12, marginHorizontal: 20 }}
                        placeholder="Search by customer, waitress, or order ID"
                    />
                    <ScrollView style={{ marginHorizontal: 20, maxHeight: 530 }}>
                        {orderHistory && orderHistory.length > 0 ? (
                            orderHistory
                                .filter(order =>
                                    (order.customerFirstName + " " + order.customerLastName).toLowerCase().includes(productSearch.toLowerCase()) ||
                                    (order.waitressFirstName + " " + order.waitressLastName).toLowerCase().includes(productSearch.toLowerCase()) ||
                                    order.id.toLowerCase().includes(productSearch.toLowerCase())
                                )
                                .map((order: OrderHistory) => (
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
                                        {order.customerFirstName && order.customerLastName && (
                                            <View>
                                                <Text style={{ fontStyle: "italic", marginBottom: 4 }}>
                                                    Customer ID: {order.customerId}
                                                </Text>
                                                <Text style={{ fontStyle: "italic", marginBottom: 4 }}>
                                                    Customer: {order.customerFirstName} {order.customerLastName}
                                                </Text>
                                            </View>
                                        )}
                                        {order.waitressFirstName && order.waitressLastName && (
                                            <Text style={{ fontStyle: "italic", marginBottom: 4 }}>
                                                Waitress: {order.waitressFirstName} {order.waitressLastName}
                                            </Text>
                                        )}
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
                                        <Text style={{ fontWeight: "bold", marginTop: 4 }}>
                                            Order Status: {order.status}
                                        </Text>
                                        <Text style={{ fontWeight: "bold", marginTop: 4 }}>
                                            Payment Status: {order.paymentStatus}
                                        </Text>
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
            )}
            
        </ScrollView>
    );
}