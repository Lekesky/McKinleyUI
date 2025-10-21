import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Button } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import createAPIClient from '../services/api';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  imageURL?: string; // Adding this to handle both formats
  tags?: string[];
};

const CATEGORIES = [
  "entree",
  "Breakfast",
  "Sides",
  "Lunch",
  "Salads",
  "Original Favorites",
  "Burgers",
  "Sandwiches & Wraps",
  "Soups",
  "Kids Menu",
  "Fountain Drinks"
];

export default function WaitressMenuScreen() {
  const api = createAPIClient();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Breakfast');
  const { addToCart } = useCart();
  const { tableNum } = useTable();

  const handleBackButton = () => { router.back() };

  const handleViewOrder = () => {
    router.push({
      pathname: "/(tabs)/Cart",
      params: { defaultView: 'waitress' }
    });
  };

  const handleAddToCart = (item: MenuItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      imageURL: item.imageURL || item.imageUrl || '',
      quantity: 1
    };
    addToCart(cartItem, 1, 'WAITRESS');
  };

  useEffect(() => {
    api.get('/menu')
      .then((response) => {
        setMenuItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api]);

  // We can add refresh functionality if needed in the future

  // Filter menu items by search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = search.trim() === '' || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      (item.tags && item.tags.includes(selectedCategory));
    
    return matchesSearch && (search.trim() !== '' || matchesCategory);
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with table info */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#3c3c3cff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Table {tableNum}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            onChangeText={setSearch}
            value={search}
            placeholderTextColor="#999"
          />
          <View style={styles.searchIcon}>
            <AntDesign name="search1" size={20} color="#3c3c3cff" />
          </View>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.pillContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{paddingLeft: 35, paddingRight: 15}}
        >
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              mode="contained" 
              style={[
                styles.buttonSegment,
                selectedCategory === category && styles.selectedButton
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items - Grid Layout */}
      <ScrollView 
        contentContainerStyle={styles.menuGrid}
        showsVerticalScrollIndicator={false}
      >
        {/* Menu Container - matches Home screen */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>
            {search ? "Search Results" : selectedCategory}
          </Text>
          
          {filteredMenuItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {search ? "No items match your search" : "No items in this category"}
              </Text>
            </View>
          ) : (
            <View style={styles.menuItemsGrid}>
              {filteredMenuItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuCard}
                onPress={() => handleAddToCart(item)}
                >
                <Image 
                  source={{ uri: item.imageURL || item.imageUrl }} 
                  style={styles.menuImage}
                  resizeMode="cover"
                />
                <View style={styles.menuCardContent}>
                  <Text style={styles.menuItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() =>handleAddToCart(item)}>
                      <Text style={styles.addButtonText}>Add</Text>
                      <MaterialIcons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        </View>
      </ScrollView>
      
      {/* Quick Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleViewOrder}>
          <Text style={styles.footerButtonText}>View Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    padding: 20, // Match Order screen
  },
  // Header styles - updated to match Order.tsx
  header: {
    marginTop: 30,
    marginBottom: "1%",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  backButton: { 
    backgroundColor: '#e8e8e8ff', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerInfo: {
    marginLeft: 0,
  },
  headerTitle: {
    fontSize: 24,
    color: '#871919ff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  orderStatusText: {
    fontSize: 14,
    color: '#666',
  },
  
  // Search styles
  searchContainer: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
    marginBottom: 0,
    paddingHorizontal: 0, // No extra padding needed since container has padding
  },
  searchBarWrapper: {
    height: 50,
    backgroundColor: '#e8e8e8ff',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    paddingVertical: 0,
  },
  searchIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Category styles
  pillContainer: { 
    flexDirection: 'row',
    marginHorizontal: -20, // Extend beyond container padding for edge-to-edge appearance
  },
  buttonSegment: { 
    marginHorizontal: 5,
    marginVertical: 20, 
    backgroundColor: '#871919ff',
    minWidth: 105, // Ensure buttons have reasonable minimum width
  },
  selectedButton: {
    backgroundColor: '#600e0eff',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  selectedButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  
  // Menu grid styles
  menuGrid: {
    paddingBottom: 100, // Increased to avoid navigation bar overlap
  },
  menuContainer: {
    paddingHorizontal: 0, // No need for extra padding since container has it
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  menuItemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    width: "48%",
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  menuImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#eee",
  },
  menuCardContent: {
    padding: 12,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    height: 32,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#871919ff",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#871919ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginRight: 4,
  },
  
  // Empty state styles
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7e7d7dff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  
  // Footer styles - increased padding for navigation bar
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 15,
    paddingHorizontal: 16,
    paddingBottom: 25, // Extra padding for navigation bar
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: -1 },
  },
  footerButton: {
    backgroundColor: "#871919ff",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  // Loading state
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});