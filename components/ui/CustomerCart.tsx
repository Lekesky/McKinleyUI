import StripeCheckout from "@/components/ui/Checkout/StripeCheckout";
import { useCart } from "@/context/CartContext";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider, Icon, Text } from "react-native-paper";
import styles from "../../styles/CustomerCart.styles";


interface CustomerCartProps {
    readonly customerCart: any[];
}

export default function CustomerCart( { customerCart }: CustomerCartProps) {
    const { clearCart, removeFromCart, getTotal, getTotalItemCount, addToCart } = useCart();
    const [ tax ] = [0.07]; // Hardcoded tax for now
    const customerTotal = Number.parseFloat(getTotal("CUSTOMER")) + (Number.parseFloat(getTotal("CUSTOMER")) * tax);

    const handleSuccess = () => {
        clearCart("CUSTOMER");
        Alert.alert('Success', 'Your order has been paid and placed!');
    };

    const handleError = (error: string) => {
        Alert.alert('Error', error);
    };


    return (
        <ScrollView>
            <View style = {styles.checkoutContainer}>
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
                        <Text style = {{ fontWeight: 'bold', color: '#871919ff' }}>${customerTotal.toFixed(2)}</Text>
                    </View>
                </View>
                <View>
                    <StripeCheckout
                        amount={customerTotal}
                        customerCart={customerCart}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        buttonStyle={styles.checkoutButton}
                    />
                </View>
            </View>
        </ScrollView>
    );
}