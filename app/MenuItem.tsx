import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Divider, IconButton, Text } from "react-native-paper";


interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: string;
    imageURL: string;
}

export default function MenuItemScreen() {
    const { id } = useLocalSearchParams();
    const { accessToken } = useAuth();
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        api.get(`/menu/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((res) => setMenuItem(res.data))
            .catch((error) => console.error("Error fetching menu item:", error));
    }, [id, accessToken]);

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        // Add to cart logic will go here
        console.log(`Added ${quantity} ${menuItem?.name} to cart`);
    };

    const goBack = () => {
        router.back();
    };

    if (!menuItem) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }
    
    return (
        <SafeAreaView style={styles.container}>
                {/* Back Button */}
                <IconButton
                    icon="arrow-left"
                    style={styles.backButton}
                    iconColor="#fff"
                    size={24}
                    onPress={goBack}
                />
                
                {/* Food Image */}
                <Image
                    source={{ uri: menuItem.imageURL }}
                    style={styles.image}
                    resizeMode="cover"
                />
                
                {/* Content Container */}
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{menuItem.name}</Text>
                        <Text style={styles.price}>${menuItem.price}</Text>
                    </View>
                    
                    <Divider style={styles.divider} />
                    
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.description}>{menuItem.description}</Text>
                    
                    <Divider style={styles.divider} />
                    
                    {/* Quantity Selector */}
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>Quantity</Text>
                        <View style={styles.quantityControls}>
                            <IconButton
                                icon="minus"
                                style={styles.quantityButton}
                                iconColor="#871919ff"
                                size={20}
                                onPress={handleDecrement}
                            />
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <IconButton
                                icon="plus"
                                style={styles.quantityButton}
                                iconColor="#871919ff"
                                size={20}
                                onPress={handleIncrement}
                            />
                        </View>
                    </View>
                </View>
            {/* Add to Cart Button */}
            <View style={styles.bottomButtonContainer}>
                <Button
                    mode="contained"
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                >
                    Add to Cart - ${(parseFloat(menuItem.price) * quantity).toFixed(2)}
                </Button>
            </View>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    image: {
        width: width,
        // height: width * 0.75,
        height: 530,
    },
    contentContainer: {
        marginTop: -35,
        height: "100%",
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderRadius: 35,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#871919ff',
    },
    divider: {
        marginVertical: 15,
        backgroundColor: '#e0e0e0',
        height: 1,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
    },
    quantityLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        margin: 0,
        backgroundColor: '#f0f0f0',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
        minWidth: 24,
        textAlign: 'center',
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
    },
    addToCartButton: {
        paddingVertical: 8,
        backgroundColor: '#871919ff',
    },
});