import { useCart } from "@/context/CartContext";
import createAPIClient from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, SafeAreaView, View } from "react-native";
import { Button, Divider, IconButton, Text } from "react-native-paper";
import styles from "../styles/MenuItem.styles";


interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: string;
    imageURL: string;
}

export default function MenuItemScreen() {
    const { id } = useLocalSearchParams();
    const api = useMemo(() => createAPIClient(), []);
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        api.get(`/menu/${id}`)
            .then((res) => setMenuItem(res.data))
            .catch((error) => console.error("Error fetching menu item:", error));
    }, [api, id]);

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        // Add to cart logic will go here
        console.log(`Added ${quantity} ${menuItem?.name} to cart`);
        if (menuItem) {
            addToCart(menuItem, quantity);
            router.back();
        }
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

