import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import styles from '../../styles/Menu.styles';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);


  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading menu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom + 70 }]}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            )}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => addToCart(item)} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}


