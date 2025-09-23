import { MenuItemCard } from "@/components/MenuItemCard";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Keyboard, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  tags: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { uid, accessToken } = useAuth();
  const [firstName, setFirstName] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const animatedWidth = useRef(new Animated.Value(50)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedGreetingOpacity = useRef(new Animated.Value(1)).current;
  const [selectedCategory, setSelectedCategory] = useState('Breakfast');
  const [refreshing, setRefreshing] = useState(false);

  const toggleSearch = () => {
    if (isSearchExpanded) {
      // Collapse search bar and show greeting
      Keyboard.dismiss(); // Dismiss keyboard explicitly
      
      // Start animations
      Animated.parallel([
        // Search bar animations
        Animated.timing(animatedWidth, {
          toValue: 50,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        // Greeting animations
        Animated.timing(animatedGreetingOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
      
      // Clear search query which will restore category filter via useEffect
      setSearchQuery('');
      
      // Force blur the input to ensure keyboard is dismissed
      if (inputRef.current) {
        inputRef.current.blur();
      }
    } else {
      // Expand search bar and hide greeting
      Animated.parallel([
        // Search bar animations
        Animated.timing(animatedWidth, {
          toValue: SCREEN_WIDTH - 40,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        // Greeting animations
        Animated.timing(animatedGreetingOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        })
      ]).start(() => {
        // Focus the input after animation completes
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
    }
    
    // Update state to track expanded/collapsed state
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  
  // Update filtered items whenever search query, selected category, or menu items change
  useEffect(() => {
    if (menuItems.length === 0) return;
    
    if (searchQuery.trim() !== '') {
      // Filter by search query
      const searchResults = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(searchResults);
    } else {
      // Filter by selected category
      const categoryResults = menuItems.filter(item => {
        if (item.tags && Array.isArray(item.tags)) {
          return item.tags.includes(selectedCategory);
        }
        return false;
      });
      setFilteredItems(categoryResults);
    }
  }, [searchQuery, selectedCategory, menuItems]);

  const fetchUserData = useCallback(() => {
    api.get(`/user/${uid}`, 
      { headers: { Authorization: `Bearer ${accessToken}` }, 
    })
      .then(res => {
        setFirstName(res.data.firstName);
      })
      .catch((error) => {
        console.error(`Error fetching user details for: `, error.message);
      });
  }, [uid, accessToken]);

  const fetchMenuItems = useCallback(() => {
    api.get('/menu', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => setMenuItems(res.data))
      .catch((error) => console.error("Error fetching menu item:", error));
  }, [accessToken]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh both user data and menu items
      await Promise.all([
        fetchUserData(),
        fetchMenuItems(),
        console.log("Data refreshed successfully: ", menuItems)
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchUserData();
    fetchMenuItems();
  }, [fetchUserData, fetchMenuItems]);
  
  // Add an effect to manage keyboard visibility based on search state
  useEffect(() => {
    if (!isSearchExpanded) {
      Keyboard.dismiss();
    }
  }, [isSearchExpanded]);
    

  const greeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Clear any search query when changing categories
    setSearchQuery('');
  };

  const handleItemPress = (id: string) => {
    router.push({ pathname: '/MenuItem', params: { id } });
  };

  // No need to manually set filteredItems here as it's handled by the useEffect
   

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#871919ff"]} // Android
            tintColor="#871919ff" // iOS
          />
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.header}>
          <Animated.View style={[
            styles.greetingContainer,
            { 
              opacity: animatedGreetingOpacity,
              width: isSearchExpanded ? 0 : 'auto',
              overflow: 'hidden'
            }
          ]}>
            <Text style={styles.greetingText} numberOfLines={2} ellipsizeMode="tail">
              {greeting()}, {firstName}!
            </Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.searchContainer,
              { width: animatedWidth }
            ]}
          >
            <Animated.View 
              style={[
                styles.inputContainer,
                { opacity: animatedOpacity }
              ]}
              pointerEvents={isSearchExpanded ? 'auto' : 'none'}
            >
              <TextInput
                ref={inputRef}
                style={[styles.input, !isSearchExpanded && styles.disabledInput]}
                placeholder={isSearchExpanded ? "Search menu..." : ""}
                value={isSearchExpanded ? searchQuery : ""}
                onChangeText={isSearchExpanded ? handleSearch : () => {}}
                onSubmitEditing={isSearchExpanded ? () => console.log("Search submitted:", searchQuery) : () => {}}
                editable={isSearchExpanded}
                pointerEvents={isSearchExpanded ? 'auto' : 'none'}
                keyboardType={isSearchExpanded ? 'default' : 'default'}
                caretHidden={!isSearchExpanded}
              />
            </Animated.View>
            
            <TouchableOpacity
              style={styles.searchIcon}
              onPress={toggleSearch}
            >
              <IconButton
                icon={isSearchExpanded ? "close" : "magnify"}
                size={24}
                iconColor="#3c3c3cff"
                style={{ margin: 0 }}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
        <View style = {styles.pillContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle = {{paddingHorizontal: 15}}>
            {['entree', 'Breakfast', 'Lunch', 'Dinner', 'Sandwiches & Wraps', 'Salads', 'Drinks'].map((category) => (
              <Button 
                key={category}
                mode="contained" 
                style={[
                  styles.buttonSegment, 
                  selectedCategory === category && styles.selectedButton
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </ScrollView>
        </View>

        <View style={styles.menuContainer}>
          {searchQuery ? (
            <Text style={styles.sectionTitle}>Search Results</Text>
          ) : (
            <Text style={styles.sectionTitle}>{selectedCategory}</Text>
          )}
          
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? "No items match your search" : "No items in this category"}
              </Text>
            </View>
          ) : (
            <View style={styles.menuItemsGrid}>
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price.toFixed(2)}
                  imageURL={item.imageURL}
                  description={item.description}
                  tags={item.tags}
                  onPress={handleItemPress}
                />
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffffff' },
  disabledInput: {
    // This ensures the input is visually disabled
    color: 'transparent',
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center', // Center text vertically in container
    marginRight: 10,
  },
  header: { 
    marginHorizontal: 20, 
    marginTop: "13%",
    height: 80,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#e8e8e8ff', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  greetingText: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#871919ff', 
    fontFamily: 'Helvetica',
  },
  buttonSegment: { 
    marginHorizontal: 5,
    marginVertical: 20, 
    backgroundColor: '#871919ff' 
  },
  pillContainer: { flexDirection: 'row'},
  selectedButton: {
    backgroundColor: '#600e0eff',
    elevation: 4,
  },
  menuContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  menuItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  searchContainer: {
    marginLeft: -11,
    height: 50,
    backgroundColor: '#e8e8e8ff',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  searchIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0, 
    position: 'relative',
  },
  inputContainer: {
    flex: 1,
    paddingRight: 10,
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

