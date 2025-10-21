import ViewControl from '@/components/ViewSwitcher';
import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import { initPaymentSheet, presentPaymentSheet, useStripe } from '@stripe/stripe-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Icon, Text } from 'react-native-paper';
import { useCart } from '../../context/CartContext';
import { useTable } from '../../context/TableContext';

export default function Cart() {
    const { uid, userRole, accessToken } = useAuth();
    const { defaultView } = useLocalSearchParams<{ defaultView: string }>();
    const api = useMemo(() => createAPIClient(), []);
    const { getActiveCart, clearCart, removeFromCart, getTotal, getTotalItemCount, addToCart } = useCart();
    const customerCart = getActiveCart("CUSTOMER");
    const waitressCart = getActiveCart("WAITRESS");
    const [ tax ] = [0.07]; // Hardcoded tax for now
    const customerTotal = (parseFloat(getTotal("CUSTOMER")) + (parseFloat(getTotal("CUSTOMER")) * tax)).toFixed(2);
    const waitressTotal = (parseFloat(getTotal("WAITRESS")) + (parseFloat(getTotal("WAITRESS")) * tax)).toFixed(2);
    const { tableNum, clearTableNum } = useTable();
    const { confirmPayment } = useStripe();
    const [selectedIndex, setSelectedIndex] = useState<number>(
      defaultView === 'waitress' ? 1 : 
      userRole === 'CUSTOMER' ? 0 : 1
    );



    let orderId : string = "";

    const goBackHandler = () => { router.back() }

    const placeOrder = async (paymentIntentId : string) => {
        // if (!paymentIntentId) return false;
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

    const handleWaitressPlaceOrder = async () => {
      const orderData = {
          userID: uid,
          tableNumber: tableNum,
          orderItems: waitressCart.map((item) => ({menuItemId: item.id, quantity: item.quantity})),
        }
        console.log("Placing order for table:", orderData.tableNumber);
        console.log("Order data:", orderData);
        api.post(`/orders/table`, orderData)
          .then((response : any) => {
            orderId = response.data.id;
            clearCart("WAITRESS");
            clearTableNum();
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
        const amount = Math.round(parseFloat(customerTotal) * 100);
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
      
          if (!error) {
            return paymentIntentId;
          } else {
            console.log('PaymentSheet init error:', error.message);
            return false;
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
            // api.put(`/orders/${orderId}/pay`);
            if (result) {
                clearCart("CUSTOMER");
                Alert.alert('Success', 'Your order has been paid and placed!');
            } else {
                Alert.alert('Error', 'Failed to place order. Please try again.');
            }
        }
    };

      return (
        <View style={styles.container}>

          {/* Header with Back Button and Title */} 
          <View style={styles.header}>
              <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                  <Icon source="arrow-left" size={24} color="#3c3c3cff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Cart</Text>
          </View>

          {/* View Switcher */}
          {userRole && (userRole === 'WAITRESS' || userRole === 'ADMIN' || userRole === 'CHEF') && (
            <ViewControl
                values={["Customer Cart", "Waitress Cart"]}
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
                width={300}
                height={40}
                activeColor="#ffffff"
                inactiveColor="#d3d3d3"
                activeTextColor="#000"
                textColor="#333"
                borderRadius={20}
                containerStyle={{ alignSelf: "center", marginVertical: 20 }}
            />
          )}

          {/* Customer View*/}
          {selectedIndex === 0 && (
            customerCart.length === 0 ? (
              <View>
                <Text>Your cart is empty.</Text>
              </View>
            ) : (
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
                            <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', textAlign: 'right' }}>${(item.quantity * parseFloat(item.price)).toFixed(2)}</Text>
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
            )
          )}

          {/* Waitress View */}
          { selectedIndex === 1 && (
            waitressCart.length === 0 ? (
              <View>
                <Text>Your cart is empty.</Text>
              </View>
            ) : (
              <View>
                <View style={styles.headerInfo}>
                  <Text style={styles.headerTitle}>Table <Text style={styles.tableNumber}>{tableNum}</Text></Text>
                </View> 
                <View style = {{ marginBottom: 20, flexDirection: 'column', gap: 10 }}>
                  {waitressCart.map((item) => {
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
                                <TouchableOpacity onPress={() => removeFromCart(item.id, "WAITRESS")} style={styles.plusMinusButton}>
                                  <Icon source="minus" size={20} color='#ffffff' />
                                </TouchableOpacity>
                                <Text>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => addToCart(item, 1, "WAITRESS")} style={styles.plusMinusButton}>
                                  <Icon source="plus" size={20} color='#ffffff' />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>

                          <View style={styles.menuItemPriceContainer}>
                            <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', textAlign: 'right' }}>${(item.quantity * parseFloat(item.price)).toFixed(2)}</Text>
                          </View>
                      </View>
                    );
                  })}
                  </View>

                  <View style={styles.summary}>
                  <View style= {styles.summaryColumn}>
                      <Text>Total Items</Text>
                      <Text>{getTotalItemCount("WAITRESS")}</Text>
                  </View>
                  <View style= {styles.summaryColumn}>
                      <Text>Subtotal</Text>
                      <Text>${getTotal("WAITRESS")}</Text>
                  </View>
                  <View style= {styles.summaryColumn}>
                      <Text>Tax</Text>
                      <Text>{(tax * 100).toFixed(0)}%</Text>
                  </View>
                  <Divider/>
                  <View style= {styles.summaryColumn}>
                      <Text>Total</Text>
                      <Text style = {{ fontWeight: 'bold', color: '#871919ff' }}>${waitressTotal}</Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity onPress={handleWaitressPlaceOrder} style={styles.checkoutButton}>
                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Place Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}

        </View>
      );
      
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffffff',
        borderWidth: 1,
    },
    header: {
        marginTop: 30,
        marginBottom: "1%",
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
    checkoutButton: { 
        backgroundColor: '#871919ff', 
        marginTop: 20, 
        height: 58, 
        borderRadius: 30, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'column',
        gap: 10,
        marginBottom: 20,
        backgroundColor: '#F0F0F0',
        padding: 20,
        borderRadius: 10,
    },
    summaryColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menuItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 90,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
    },
    menuItemImageContainer: {
      // borderWidth: 1,
      width: "auto",
      height: "100%",
      justifyContent: 'center',
      alignItems: 'center',
      flex: 2,
    },
    menuItemDetailsContainer: {
      // borderWidth: 1,
      paddingLeft: 10,
      flex: 8,
      flexDirection: 'column',
      height: "100%",
    },
    menuItemPriceContainer: {
      // borderWidth: 1,
      height: "100%",
      justifyContent: 'center',
      width: 55,
    },
    quantityPriceContainer: {
      flexDirection: 'row',
      gap: 45,
      alignItems: 'center',
      // borderWidth: 1,
    },
    menuItemImage: {
      width: "100%",
      height: "100%",
      borderRadius: 25,
    },
    menuItemName: {
      // borderWidth: 1,
      justifyContent: 'center',
      flex: 3,
    },
    quantityPrice: {
      // borderWidth: 1,
      width: 85,
      justifyContent: 'center',
    },
    price: {
      
    },
    plusMinusButton: {
      backgroundColor: '#871919ff', 
      width: 30, 
      height: 30,
      borderRadius: 15, 
      justifyContent: 'center', 
      alignItems: 'center',
    },
    enterBoxStyle: {
        backgroundColor: "#53c851",
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 20,
        height: 35,
        width: "auto",
        borderRadius: 20,
    },
    picker: {
        borderWidth: 2,
        height: 50,
        width: 150,
        marginLeft: 10,
    },
    textBox: {
        marginLeft: 15,
        borderWidth: 2,
        width: 50,
        height: 50,
        alignSelf: "center",
    },
    tableNum: {
        fontSize: 30,
    },
    tableBox: {
        flexDirection: 'row',
    },
    enterBox: {
        marginTop: 30,
        width: 350,
    },
    box: {
        padding: 20,
        borderRadius: 8,
    },
    title: {
        textAlign: "center",
        fontSize: 60,
        fontWeight: 'bold',
        alignItems: "center"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    waitressContainer: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 20,
    },
    waitressTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#871919ff',
      marginBottom: 30,
      fontFamily: 'Helvetica',
    },
    tableLayout: {
      width: '100%',
      marginVertical: 20,
      alignItems: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
    },
    tableButton: {
      width: 70,
      height: 70,
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: '#d0d0d0',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    selectedTableButton: {
      backgroundColor: '#871919ff',
      borderColor: '#700000',
    },
    tableButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    selectedTableText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 15,
    },
    selectedTableInfo: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    takeOrderButton: {
      backgroundColor: '#871919ff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 60,
      width: 220,
      borderRadius: 30,
      marginTop: 20,
    },
    disabledButton: {
      backgroundColor: '#cccccc',
    },
    buttonIcon: {
      marginRight: 10,
    },
    takeOrderButtonText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    tableNumber: {
      fontSize: 28,
      fontWeight: '900',
      color: '#871919ff',
      letterSpacing: 0.5,
      textShadowColor: 'rgba(135, 25, 25, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    headerInfo: {
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: 5,
    },
});


