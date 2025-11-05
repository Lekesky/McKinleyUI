import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTable } from "@/context/TableContext";
import createAPIClient from "@/services/api";
import { useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import styles from "../../styles/WaitressCart.styles";

interface WaitressCartProps {
    readonly waitressCart: any[];
}

export default function WaitressCart( { waitressCart }: WaitressCartProps) {
    const { uid } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const { clearCart, removeFromCart, getTotal, getTotalItemCount, addToCart } = useCart();
    const [ tax ] = [0.07]; // Hardcoded tax for now
    const waitressTotal = (Number.parseFloat(getTotal("WAITRESS")) + (Number.parseFloat(getTotal("WAITRESS")) * tax)).toFixed(2);
    const { tableNum, clearTableNum } = useTable();
    

    let orderId : string = "";
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

    return (
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
                            <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', textAlign: 'right' }}>${(item.quantity * Number.parseFloat(item.price)).toFixed(2)}</Text>
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
    );
}

