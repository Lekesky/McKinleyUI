import { useCart } from "@/context/CartContext";
import createAPIClient from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, Modal, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, Divider, Icon, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import styles from "../styles/MenuItem.styles";


interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: string;
    imageURL: string;
    availableSideIds?: string[];
}

interface Side {
    id: string;
    name: string;
    price: string;
}

export default function MenuItemScreen() {
    const { id } = useLocalSearchParams();
    const api = useMemo(() => createAPIClient(), []);
    const insets = useSafeAreaInsets();
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [sides, setSides] = useState<MenuItem[]>([]);
    const [selectedSideIds, setSelectedSideIds] = useState<string[]>([]);
    const { addToCart } = useCart();

    useEffect(() => {
        api.get(`/menu/${id}`)
            .then((res) => {
                setMenuItem(res.data);
                fetchSides();
            })
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to fetch menu item';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch menu item',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
            });
    }, [api, id]);

    const fetchSides = async () => {
        try {
            const res = await api.get(`/menu/sides?pageNumber=0&pageSize=200`);
            setSides(res.data.content || []);

        } catch (error) {
            console.error('Failed to fetch sides:', error);
        }
    };

    const getAvailableSides = () => {
        if (!menuItem?.availableSidesIds) return [];
        return sides;
    };

    const toggleSideSelection = (sideId: string) => {
        setSelectedSideIds(prev => 
            prev.includes(sideId) 
                ? prev.filter(id => id !== sideId)
                : [...prev, sideId]
        );
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        if (menuItem) {
            addToCart(menuItem, quantity, selectedSideIds);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `${menuItem.name} added to cart!`,
                position: 'top',
                backgroundColor: '#4CAF50',
                textColor: '#FFFFFF',
            });
            router.back();
        }
    };

    const goBack = () => {
        router.back();
    };

    if (!menuItem) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: '#000' }}>Loading...</Text>
            </View>
        );
    }

    const isWeb = Platform.OS === 'web';
    const availableSides = getAvailableSides();
    
    const content = (
        <>
            {/* Food Image */}
            <Image
                source={{ uri: menuItem.imageURL }}
                style={isWeb ? styles.imageWeb : styles.image}
                resizeMode="cover"
            />
            
            {/* Content Container */}
            <View style={isWeb ? styles.contentContainerWeb : styles.contentContainer}>
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

                {/* Sides Selector */}
                {availableSides.length > 0 && (
                    <>
                        <Divider style={styles.divider} />
                        <Text style={styles.descriptionTitle}>Add Sides</Text>
                        <View style={{ gap: 8 }}>
                            {availableSides.map(side => (
                                <TouchableOpacity
                                    key={side.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        borderRadius: 8,
                                        backgroundColor: selectedSideIds.includes(side.id) ? '#f0f0f0' : '#fff',
                                        borderWidth: selectedSideIds.includes(side.id) ? 2 : 1,
                                        borderColor: selectedSideIds.includes(side.id) ? '#871919ff' : '#e0e0e0',
                                    }}
                                    onPress={() => toggleSideSelection(side.id)}
                                >
                                    <Icon 
                                        source={selectedSideIds.includes(side.id) ? "checkbox-marked" : "checkbox-blank-outline"} 
                                        size={20} 
                                        color="#871919ff"
                                    />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#555' }}>{side.name}</Text>
                                    </View>
                                    <Text style={{ fontSize: 12, color: '#666' }}>+ ${side.price.toFixed(2)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {/* Add to Cart Button - For Web */}
                {isWeb && (
                    <Button
                        mode="contained"
                        style={styles.addToCartButtonWeb}
                        onPress={handleAddToCart}
                    >
                        <Text style={{ color: '#fff' }}>Add to Cart - ${(parseFloat(menuItem.price) * quantity).toFixed(2)}</Text>
                    </Button>
                )}
            </View>
        </>
    );

    // Web Modal View
    if (isWeb) {
        return (
            <Modal
                visible={true}
                transparent={true}
                animationType="fade"
                onRequestClose={goBack}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={goBack}
                >
                    <TouchableOpacity 
                        style={styles.modalContent} 
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <IconButton
                            icon="close"
                            style={styles.closeButton}
                            iconColor="#871919ff"
                            size={24}
                            onPress={goBack}
                        />
                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContentWeb}
                        >
                            {content}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        );
    }
    
    // Mobile Full Screen View
    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={goBack} style={[styles.backButton, { top: insets.top + 10 }]}>
                <Icon source="arrow-left" size={24} color="#3c3c3cff" />
            </TouchableOpacity>
            {content}
            {/* Add to Cart Button - For Mobile */}
            <View style={styles.bottomButtonContainer}>
                <Button
                    mode="contained"
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                >
                    Add to Cart - ${(parseFloat(menuItem.price) * quantity).toFixed(2)}
                </Button>
            </View>
        </View>
    );
}

