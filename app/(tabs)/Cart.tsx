import { Button, FlatList, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useCart } from '../../context/CartContext';
import styles from '../../styles/Cart.styles';


export default function Cart() {
    const { cart, clearCart, removeFromCart } = useCart();
    // const { confirmPayment } = useStripe();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let orderId : string = "";

    const placeOrder = async () => {
        // try {
        
        // if (!userUID) {
        //     Alert.alert("Not Logged In", "Please log in to place an order.");
        //     return;
        // }

        // const menuItemIds: string[] = cart.flatMap(item =>
        //     Array(item.quantity).fill(item.id)
        // );

        // const orderData = await api.post(`/orders/${userUID}/create`, {menuItemIds});
        // const { id } = orderData.data;
        // orderId = id;

        // clearCart();
        // Alert.alert("Order Placed", "Your order has been placed successfully!");
        // } catch (error: any) {
        // console.error("Order failed:", error);
        // Alert.alert("Error", "Failed to place order. Try again later.");
        // }
    };

    const initializePaymentSheet = async () => {
        // try {
        //   const amount = Math.round(total * 100);
        //   console.log("Customer UID: ", userUID);
        //   const res = await api.post('/payments/create-intent', {
        //      customerId: userUID,
        //      orderId: orderId,
        //      amount 
        // });
      
        //   const { paymentIntent, ephemeralKey, customer} = res.data;
        //   const { error } = await initPaymentSheet({
        //     merchantDisplayName: 'Mckinley Grill',
        //     customerId: customer,
        //     customerEphemeralKeySecret: ephemeralKey,
        //     paymentIntentClientSecret: paymentIntent,
        //     allowsDelayedPaymentMethods: false,
        //   });
      
        //   if (!error) {
        //     return true;
        //   } else {
        //     console.log('PaymentSheet init error:', error.message);
        //     return false;
        //   }
        // } catch (err) {
        //   console.error('Error initializing PaymentSheet:', err);
        //   return false;
        // }
    };
      

    const handleCheckout = async () => {
        // const ready = await initializePaymentSheet();
        // if (!ready) {
        //     Alert.alert('Error', 'Could not initialize payment.');
        //     return;
        // }

        // const { error } = await presentPaymentSheet();

        // if (error) {
        //     Alert.alert('Payment failed', error.message);
        // } else {
        //     await placeOrder();
        //     api.put(`/orders/${orderId}/pay`);
        //     clearCart();
        //     Alert.alert('Success', 'Your order has been paid and placed!');
        // }
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


