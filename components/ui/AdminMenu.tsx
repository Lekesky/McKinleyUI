import { router } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import styles from '../../styles/AdminMenu.styles';

type MenuItems = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageURL: string;
};

interface ProductSearchProps {
    readonly productSearch: string;
    readonly menuItems: MenuItems[];
}

export default function AdminMenu({ productSearch, menuItems } : ProductSearchProps) {
    return (
        <View>
            <ScrollView>
                {menuItems && menuItems.length > 0 ? (
                    menuItems.filter(item =>
                        item.name.toLowerCase().includes(productSearch.toLowerCase())
                    ).map((item) => (
                        <View key={item.id} style={styles.menuItemCard}>
                            <View style={styles.menuItemHeader}>
                                <View style={styles.menuItemInfo}>
                                    <Text style={styles.menuItemName}>{item.name}</Text>
                                    <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
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
                            <Text style={styles.menuItemDescription}>{item.description}</Text>
                            {Boolean(item.imageURL) && (
                                <Image 
                                    source={{ uri: item.imageURL }} 
                                    style={styles.menuItemImage} 
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyMessage}>No menu items found.</Text>
                )}
            </ScrollView>
        </View>
    );
}

