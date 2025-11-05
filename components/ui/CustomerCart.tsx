import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import createAPIClient from "@/services/api";
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { useMemo } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import styles from "../../styles/CustomerCart.styles";


interface CustomerCartProps {
    readonly customerCart: any[];
}

export default function CustomerCart( { customerCart }: CustomerCartProps) {
    const { uid } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const { clearCart, removeFromCart, getTotal, getTotalItemCount, addToCart } = useCart();
    const [ tax ] = [0.07]; // Hardcoded tax for now
    const customerTotal = (Number.parseFloat(getTotal("CUSTOMER")) + (Number.parseFloat(getTotal("CUSTOMER")) * tax)).toFixed(2);

    let orderId : string = "";

    const placeOrder = async (paymentIntentId : string) => {
        const orderData = {
          userID: uid,
          orderItems: customerCart.map((item) => ({menuItemId: item.id, quantity: item.quantity})),
          paymentIntentId 
        }
        console.log("Placing order: ", orderData);
        api.post(`/orders`, orderData)
          .then((response : any) => {
            orderId = response.data.id;
            console.log("Order placed with ID:", orderId);
          })
          .catch((error) => {
            let errorMessage = "Failed to place order. Try again later.";

            if (error.response) {
              // Get the status code
              const statusCode = error.response.status;
              console.log(`Error status: ${statusCode}`);
              
              // Spring Boot typically returns error details in error.response.data
              if (error.response.data) {
                // Common Spring Boot error formats
                if (error.response.data.message) {
                  errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                  errorMessage = error.response.data.error;
                } else if (typeof error.response.data === 'string') {
                  errorMessage = error.response.data;
                }
              }
            }
            
            console.error("Order failed:", errorMessage);
            return false;
          });
        return true;
    };


    const initializePaymentSheet = async () => {
        const amount = Math.round(Number.parseFloat(customerTotal) * 100);
        const stripeData = {
          customerId: uid,
          orderId: orderId,
          amount
        }
        try {
          const resPaymentIntent = await api.post('/payments', stripeData);
          const { paymentIntentId, paymentIntent, ephemeralKey, customer} = resPaymentIntent.data;
          const resSetupIntent = await api.post('/payments/setup-intent', { customerId: customer });
          
          
          const { setupIntentClientSecret } = resSetupIntent.data;
          
          const { error } = await initPaymentSheet({
            merchantDisplayName: 'Mckinley Grill',
            customerId: customer,
            setupIntentClientSecret: setupIntentClientSecret,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
          });
      
          if (error) {
            console.log('PaymentSheet init error:', error.message);
            return false;
          } else {
            return paymentIntentId;
          }
        } catch (err) {
          console.error('Error initializing PaymentSheet:', err);
          return false;
        }
    };

    const handleCheckout = async () => {
        const paymentIntentID = await initializePaymentSheet();
        
        if (paymentIntentID === false) {
            Alert.alert('Error', 'Could not initialize payment.');
            return;
        }

        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert('Payment failed', error.message);
        } else {
            const result = await placeOrder(paymentIntentID);
            if (result) {
                clearCart("CUSTOMER");
                Alert.alert('Success', 'Your order has been paid and placed!');
            } else {
                Alert.alert('Error', 'Failed to place order. Please try again.');
            }
        }
    };


    return (
        <View>
            <View style = {{ marginBottom: 20, flexDirection: 'column', gap: 10 }}>
                {customerCart.map((item) => {
                return (
                    <View key={item.id} style={styles.menuItemContainer}>

                        <View style={styles.menuItemImageContainer}>
                        <Image style={styles.menuItemImage} source={{ uri: item.imageURL }} />
                        </View>

                        <View style={styles.menuItemDetailsContainer}>
                        <View style={styles.menuItemName}>
                            <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 17 }}>{item.name}</Text>
                        </View>
                        <View style={styles.quantityPriceContainer}>
                            <View style={styles.quantityPrice}>
                            <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 14, }}>{item.quantity} x ${item.price}</Text>
                            </View>
                            <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <TouchableOpacity onPress={() => removeFromCart(item.id, "CUSTOMER")} style={styles.plusMinusButton}>
                                <Icon source="minus" size={20} color='#ffffff' />
                            </TouchableOpacity>
                            <Text>{item.quantity}</Text>
                            <TouchableOpacity onPress={() => addToCart(item, 1, "CUSTOMER")} style={styles.plusMinusButton}>
                                <Icon source="plus" size={20} color='#ffffff' />
                            </TouchableOpacity>
                            </View>
                        </View>
                        </View>

                        <View style={styles.menuItemPriceContainer}>
                        <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', textAlign: 'right' }}>${(item.quantity * Number.parseFloat(item.price)).toFixed(2)}</Text>
                        </View>
                    </View>
                );
                })}
                </View>

                <View style={styles.summary}>
                <View style= {styles.summaryColumn}>
                    <Text>Total Items</Text>
                    <Text>{getTotalItemCount("CUSTOMER")}</Text>
                </View>
                <View style= {styles.summaryColumn}>
                    <Text>Subtotal</Text>
                    <Text>${getTotal("CUSTOMER")}</Text>
                </View>
                <View style= {styles.summaryColumn}>
                    <Text>Tax</Text>
                    <Text>{(tax * 100).toFixed(0)}%</Text>
                </View>
                <Divider/>
                <View style= {styles.summaryColumn}>
                    <Text>Total</Text>
                    <Text style = {{ fontWeight: 'bold', color: '#871919ff' }}>${customerTotal}</Text>
                </View>
            </View>
            <View>
                <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
            </View>
    );
}