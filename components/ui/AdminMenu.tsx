import { router } from 'expo-router';
import React, { memo } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import styles from '../../styles/AdminMenu.styles';

type MenuItems = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageURL: string;
    availableSideIds?: string[];
};

interface ProductSearchProps {
    readonly productSearch: string;
    readonly menuItems: MenuItems[];
}

export default memo(function AdminMenu({ productSearch, menuItems } : ProductSearchProps) {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {menuItems && menuItems.length > 0 ? (
                <View style={styles.menuItemsGrid}>
                        {menuItems.filter(item =>
                            item.name.toLowerCase().includes(productSearch.toLowerCase())
                        ).map((item) => (
                            <View key={item.id} style={styles.cardContainer}>
                                <View style={styles.menuItemCard}>
                                    {Boolean(item.imageURL) && (
                                        <Image 
                                            source={{ uri: item.imageURL }} 
                                            style={styles.menuItemImage} 
                                            resizeMode="cover"
                                        />
                                    )}
                                    <View style={styles.contentContainer}>
                                        <View style={styles.menuItemHeader}>
                                            <View style={styles.menuItemInfo}>
                                                <Text style={styles.menuItemName}>{item.name}</Text>
                                                <Text style={styles.menuItemDescription}>{item.description}</Text>
                                                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                                                {item.availableSideIds && item.availableSideIds.length > 0 && (
                                                    <Text style={{ color: '#871919ff', fontSize: 12, marginTop: 4, fontWeight: '500' }}>
                                                        {item.availableSideIds.length} side{item.availableSideIds.length !== 1 ? 's' : ''} available
                                                    </Text>
                                                )}
                                            </View>
                                            <TouchableOpacity
                                                style={styles.editButton}
                                                onPress={() =>
                                                    router.push({
                                                        pathname: '/EditProduct',
                                                        params: { product: JSON.stringify(item) },
                                                    })
                                                }
                                            >
                                                <Icon source="pencil" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.emptyMessage}>No menu items found.</Text>
                )}
        </ScrollView>
    );
});

