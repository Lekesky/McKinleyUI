import React from 'react';
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';



export default function WaitressCart() {
    const { cart, clearCart, removeFromCart } = useCart();
    const { tableNum } = useTable();
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    let orderId : string = "";

    const placeOrder = async () => {
        // try {
        
        //     if (!userUID) {
        //         Alert.alert("Not Logged In", "Please log in to place an order.");
        //         return;
        //     }

        //     const menuItemIds: string[] = cart.flatMap(item =>
        //         Array(item.quantity).fill(item.id)
        //     );
            
        //     const orderData = await api.post(`/orders/${userUID}/create-table`, {
        //         menuItemIds,
        //         tableNumber: parseInt(tableNum),
        //     });
            
        //     const { id } = orderData.data;
        //     orderId = id;

        //     clearCart();
        //     Alert.alert("Order Placed", "Order has been placed successfully!");
        // } catch (error: any) {
        //     console.error("Order failed:", error);
        //     Alert.alert("Error", "Failed to place order. Try again later.");
        // }
    };
      

    const handleCheckout = async () => {
        placeOrder()
    };

      return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
        <Text style={styles.title}>🛒 Your Cart</Text>
      
            <FlatList
            style = {styles.orderList}
              data={cart}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.quantity}>Qty: {item.quantity}</Text>
                  <Text style={styles.price}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <Button title="Remove" onPress={() => removeFromCart(item.id)} />
                </View>
              )}
              scrollEnabled={true}
            />
      
            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      
            <View style={styles.actions}>
              <Button title="Place Order & Pay" onPress={handleCheckout} />
              <Button title="Clear Cart" color="red" onPress={clearCart} />
            </View>
        </KeyboardAvoidingView>
      );
      
}

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    paddingTop: 20 ,
    marginBottom: 16, 
    color: 'black', 
    marginTop: 40 
},
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 18 },
  quantity: { fontSize: 14, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: 'bold' },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 20,
  },
  actions: {
    marginBottom: 90,
    gap: 10,
  },
    orderList: {
        marginLeft: 13,
        marginRight: 13,
    },
});