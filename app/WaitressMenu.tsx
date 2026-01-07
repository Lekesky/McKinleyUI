import HorizontalPills from '@/components/HorizontalPills';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import createAPIClient from '../services/api';
import styles from '../styles/WaitressMenu.styles';

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
  const api = React.useMemo(() => createAPIClient(), []);
  const insets = useSafeAreaInsets();
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
        // Handle paginated response
        if (response.data.content) {
          setMenuItems(response.data.content);
        } else if (Array.isArray(response.data)) {
          // Fallback for non-paginated response
          setMenuItems(response.data);
        } else {
          setMenuItems([]);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Invalid menu data format',
            position: 'top',
            backgroundColor: '#871919ff',
            textColor: '#FFFFFF',
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data || error.message || 'Failed to fetch menu';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch menu',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
        });
        setMenuItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api]);

  // We can add refresh functionality if needed in the future

  // Filter menu items by search and category
  const filteredMenuItems = (menuItems || []).filter(item => {
    const matchesSearch = search.trim() === '' || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      item.tags?.includes(selectedCategory);
    
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
      <HorizontalPills 
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

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

