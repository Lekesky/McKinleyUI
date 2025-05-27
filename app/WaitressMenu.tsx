import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import api from '../services/api';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

const CATEGORIES = [
  "Breakfast",
  "Sides",
  "Lunch",
  "Salads",
  "Original Favorites",
  "Burgers",
  "Sandwiches & Wraps",
  "Soups",
  "Kids Menu",
  "Foutain Drinks"
];

export default function WaitressMenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  const handleBackButton = () => {
    router.push("/(tabs)/Waitress");
  };

  const handleChartButton = () => {
    router.push("/WaitressCart");
  };

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

  // Filter menu items by search
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.backIcon}>
            <TouchableOpacity onPress={handleBackButton}>
                <AntDesign name="arrowleft" size={35} color="black" />
            </TouchableOpacity>
        </View>
        <View style={styles.searchBarContainer}>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearch}
            value={search}
            style={styles.paperSearchBar}
            inputStyle={{ fontSize: 16 }}
          />
        </View>
        <View style={styles.cartIcon}>
            <TouchableOpacity onPress={handleChartButton}>
                <Entypo name="shopping-cart" size={30} color="grey" />
            </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.menuScroll}>
        {CATEGORIES.map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <FlatList
                data={filteredMenuItems}
                keyExtractor={(item) => item.id + category}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                initialNumToRender={5}
                windowSize={5}
                removeClippedSubviews={true}
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
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 80,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backIcon: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cartIcon: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
  searchBarContainer: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  paperSearchBar: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    height: 48,
    elevation: 0,
  },
  menuScroll: {
    paddingBottom: 24,
    paddingTop: 12,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#333",
    marginLeft: 16,
    marginBottom: 8,
  },
  horizontalList: {
    paddingLeft: 16,
    paddingTop:3,
    paddingBottom: 3,
    paddingRight: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 220,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  desc: {
    fontSize: 13,
    color: "#666",
    marginVertical: 2,
    textAlign: "center",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 2,
  },
  addButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});