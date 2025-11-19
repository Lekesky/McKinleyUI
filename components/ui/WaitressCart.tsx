import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTable } from "@/context/TableContext";
import createAPIClient from "@/services/api";
import { useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import { Toast } from 'toastify-react-native';
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
        
        api.post(`/orders/table`, orderData)
          .then((response : any) => {
            orderId = response.data.id;
            clearCart("WAITRESS");
            clearTableNum();
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Order placed successfully',
              position: 'top',
              backgroundColor: '#4CAF50',
              textColor: '#FFFFFF',
            });
          })
          .catch((error) => {
            const errorMessage = error.response?.data || error.message || 'Failed to place order';
            Toast.show({
              type: 'error',
              text1: 'Order Failed',
              text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to place order. Try again later.',
              position: 'top',
              backgroundColor: '#871919ff',
              textColor: '#FFFFFF',
            });
            return false;
          });
        return true;
    };

    return (
        <View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Table <Text style={styles.tableNumber}>{tableNum}</Text></Text>
          </View> 
          <View style = {styles.checkoutContainer}>
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
                        <TouchableOpacity onPress={() => removeFromCart(item.id, "WAITRESS")} style={styles.plusMinusButton}>
                          <Icon source="minus" size={20} color='#ffffff' />
                        </TouchableOpacity>

                        <View style={styles.quantityPrice}>
                          <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 14, }}>{item.quantity} x ${item.price}</Text>
                        </View>

                        <TouchableOpacity onPress={() => addToCart(item, 1, "WAITRESS")} style={styles.plusMinusButton}>
                          <Icon source="plus" size={20} color='#ffffff' />
                        </TouchableOpacity>

                      </View>
                    </View>

                    <View style={styles.menuItemPriceContainer}>
                      <Text style={{ fontFamily: 'Helvetica', fontWeight: 'bold', textAlign: 'right' }}>${(item.quantity * Number.parseFloat(item.price)).toFixed(2)}</Text>
                    </View>
                </View>
              );
            })}

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
      </View>
    );
}

