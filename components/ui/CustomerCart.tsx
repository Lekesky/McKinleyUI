import StripeCheckout from "@/components/ui/Checkout/StripeCheckout";
import { useCart } from "@/context/CartContext";
import createAPIClient from "@/services/api";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Icon, Text } from "react-native-paper";
import { Toast } from "toastify-react-native";
import createStyles from "../../styles/CustomerCart.styles";


interface CustomerCartProps {
    readonly customerCart: any[];
}

interface Side {
    id: string;
    name: string;
    price: string;
}

export default function CustomerCart( { customerCart }: CustomerCartProps) {
    const { clearCart, removeFromCart, removeSideFromItem, getTotal, getTotalItemCount, addToCart, isCartPaused } = useCart();
    const api = useMemo(() => createAPIClient(), []);
    const customerTotal = Number.parseFloat(getTotal("CUSTOMER"));
    const [subTotal, setSubTotal] = useState<number>(0);
    const [taxAmount, setTaxAmount] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [sidesMap, setSidesMap] = useState<Record<string, Side>>({});
    const styles = createStyles(isCartPaused);

    // Fetch all sides on component mount
    useEffect(() => {
        const fetchAllSides = async () => {
            try {
                const res = await api.get(`/menu/sides?pageNumber=0&pageSize=200`);
                const sidesData = res.data;
                let sidesArray: Side[] = [];
                
                if (Array.isArray(sidesData)) {
                    sidesArray = sidesData;
                } else if (sidesData.content && Array.isArray(sidesData.content)) {
                    sidesArray = sidesData.content;
                } else if (sidesData.items && Array.isArray(sidesData.items)) {
                    sidesArray = sidesData.items;
                }
                
                // Create a map of side id -> side details for quick lookup
                const map: Record<string, Side> = {};
                sidesArray.forEach(side => {
                    map[side.id] = side;
                });
                setSidesMap(map);
            } catch (error) {
                console.error('Failed to fetch sides:', error);
            }
        };
        
        fetchAllSides();
    }, [api]);

    useEffect(() => {
        if(isCartPaused) {
            Toast.show({
                type: 'info',
                text1: 'Order Fulfillment Paused',
                text2: 'We have put a pause on accepting new orders for the meantime. Please check back later.',
                autoHide: false,
                showCloseIcon: false,
                position: 'bottom',
                backgroundColor: '#871919ff',
                iconColor: '#FFFFFF',
                textColor: '#FFFFFF',
            });
        }
    },[isCartPaused]);

    

    const handleSuccess = () => {
        clearCart("CUSTOMER");
        Alert.alert('Success', 'Your order has been paid and placed!');
    };

    const handleError = (error: string) => {
        Alert.alert('Error', error);
    };

    const handleAmountsCalculated = (amounts: { subTotal: number; taxAmount: number; total: number }) => {
        setSubTotal(amounts.subTotal);
        setTaxAmount(amounts.taxAmount);
        setTotal(amounts.total);
    };

    // Returns the total number of items including sides (each side counts as an item per quantity)
    const getTotalItemCountWithSides = () => {
        let total = 0;
        customerCart.forEach(item => {
            total += item.quantity;
            if (item.selectedSideIds && item.selectedSideIds.length > 0) {
                total += item.selectedSideIds.length * item.quantity;
            }
        });
        return total;
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style = {styles.checkoutContainer}>
                {customerCart.map((item) => {
                    const selectedSides = item.selectedSideIds 
                        ? item.selectedSideIds.map(sideId => sidesMap[sideId]).filter(Boolean)
                        : [];
                    
                    const mainPrice = Number.parseFloat(item.price);
                    const sidesTotal = selectedSides.reduce((sum, side) => sum + Number.parseFloat(side.price), 0);
                    const itemTotal = ((mainPrice + sidesTotal) * item.quantity).toFixed(2);
                    
                    return (
                        <View key={item.id} style={styles.menuItemContainer}>
                            <View style={styles.menuItemImageWrapper}>
                                <View style={styles.menuItemImageContainer}>
                                    <Image style={styles.menuItemImage} source={{ uri: item.imageURL }} />
                                </View>
                            </View>

                            <View style={styles.menuItemDetailsContainer}>
                                <View style={styles.menuItemHeader}>
                                    <View style={styles.menuItemTitleSection}>
                                        <Text style={styles.menuItemNameText}>{item.name}</Text>
                                        <Text style={styles.basePriceText}>Base: ${item.price}</Text>
                                    </View>
                                    <View style={styles.totalPriceContainer}>
                                        <Text style={styles.menuItemTotalPrice}>${itemTotal}</Text>
                                    </View>
                                </View>
                                
                                {/* Display selected sides with remove button */}
                                {selectedSides.length > 0 && (
                                    <View style={styles.sidesContainer}>
                                        <Text style={styles.sidesLabel}>Add-ons</Text>
                                        {selectedSides.map((side) => (
                                            <View key={side.id} style={styles.sideRow}>
                                                <View style={styles.sideInfo}>
                                                    <View style={styles.sideDot} />
                                                    <Text style={styles.sideName}>{side.name}</Text>
                                                    <Text style={styles.sidePrice}>+${side.price}</Text>
                                                </View>
                                                <TouchableOpacity 
                                                    onPress={() => removeSideFromItem(item.id, side.id, "CUSTOMER")} 
                                                    style={styles.removeSideButton}
                                                >
                                                    <Icon source="close" size={12} color='#fff' />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}
                                
                                <View style={styles.quantityControlsContainer}>
                                    <View style={styles.quantityControls}>
                                        <TouchableOpacity onPress={() => removeFromCart(item.id, "CUSTOMER")} style={styles.minusButton}>
                                            <Icon source="minus" size={18} color='#871919ff' />
                                        </TouchableOpacity>
                                        <View style={styles.quantityBadge}>
                                            <Text style={styles.quantityText}>{item.quantity}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => addToCart(item, 1, item.selectedSideIds || [], "CUSTOMER")} style={styles.plusButton}>
                                            <Icon source="plus" size={18} color='#ffffff' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                })}

                <View style={styles.summary}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>
                    </View>
                    <View style= {styles.summaryColumn}>
                        <Text style={styles.summaryLabel}>Total Items</Text>
                        <Text style={styles.summaryValue}>{getTotalItemCountWithSides()}</Text>
                    </View>
                    <View style= {styles.summaryColumn}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>${subTotal.toFixed(2)}</Text>
                    </View>
                    <View style= {styles.summaryColumn}>
                        <Text style={styles.summaryLabel}>Tax</Text>
                        <Text style={styles.summaryValue}>${taxAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style= {styles.summaryColumn}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                    </View>
                </View>
                <View>
                    <StripeCheckout
                        customerCart={customerCart}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        buttonStyle={styles.checkoutButton}
                        onAmountsCalculated={handleAmountsCalculated}
                    />
                </View>
            </View>
        </ScrollView>
    );
}