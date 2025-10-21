import { MenuItemCard } from "@/components/MenuItemCard";
import ViewControl from "@/components/ViewSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useTable } from "@/context/TableContext";
import createAPIClient from "@/services/api";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Keyboard, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Icon, IconButton, Text } from "react-native-paper";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  tags: string[];
}

const CATEGORIES = [
  'entree',
  'Breakfast',
  'Lunch', 
  'Dinner', 
  'Sandwiches & Wraps', 
  'Salads', 
  'Drinks'
]

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { uid, userRole } = useAuth();
  const api = useMemo(() => createAPIClient(), []);
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
  const [selectedIndex, setSelectedIndex] = useState<number>(userRole === 'CUSTOMER' ? 0 : 1);
  const { tableNum, setTableNum } = useTable();

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
    )
      .then((res) => setFirstName(res.data.firstName))
      .catch((error) => {
        console.error(`Error fetching user details for: `, error.message);
      });
  }, [api, uid]);

  const fetchMenuItems = useCallback(() => {
    api.get('/menu')
      .then((res) => setMenuItems(res.data))
      .catch((error) => console.error("Error fetching menu item:", error));
  }, [api]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh both user data and menu items
      await Promise.all([
        fetchUserData(),
        fetchMenuItems()
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
  
  // For waitress view
  const handleEnter = (num : number) => {
    if(num !== 0){
      console.log("Table Number: ", num);
      setTableNum(num);
      router.push("/WaitressMenu");
    } else {
      Alert.alert("Please select a table number.");
      console.log("Missing table number.");
    }
  };
   

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

        {/* View Switcher */}
          {userRole && (userRole === 'WAITRESS' || userRole === 'ADMIN' || userRole === 'CHEF') && (
            <ViewControl
                values={["Customer", "Waitress"]}
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
                width={300}
                height={40}
                activeColor="#ffffff"
                inactiveColor="#d3d3d3"
                activeTextColor="#000"
                textColor="#333"
                borderRadius={20}
                containerStyle={{ alignSelf: "center", marginTop: "15%"}}
            />
          )}

        {/* Customer View */}
        {selectedIndex === 0 && (
          <>
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
              {CATEGORIES.map((category) => (
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
        </>
        )}

        {/* Waitress View */}
        {selectedIndex === 1 && (
          <View style={styles.waitressContainerWrapper}>
            <View style={styles.waitressContainer}>
              <Text style={styles.waitressTitle}>Table Selection</Text>
              
              {/* Visual Table Layout */}
              <View style={styles.tableLayout}>
                {/* Row 1 */}
                <View style={styles.tableRow}>
                  {[1, 2, 3, 4].map(num => (
                    <TouchableOpacity 
                      key={num}
                      style={[
                        styles.tableButton, 
                        tableNum === num && styles.selectedTableButton
                      ]}
                      onPress={() => setTableNum(num)}
                    >
                      <Text style={[styles.tableButtonText, tableNum === num && styles.selectedTableText]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Row 2 */}
                <View style={styles.tableRow}>
                  {[5, 6, 7, 8].map(num => (
                    <TouchableOpacity 
                      key={num}
                      style={[
                        styles.tableButton, 
                        tableNum === num && styles.selectedTableButton
                      ]}
                      onPress={() => setTableNum(num)}
                    >
                      <Text style={[styles.tableButtonText, tableNum === num && styles.selectedTableText]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Row 3 */}
                <View style={styles.tableRow}>
                  {[9, 10, 11, 12].map(num => (
                    <TouchableOpacity 
                      key={num}
                      style={[
                        styles.tableButton, 
                        tableNum === num && styles.selectedTableButton
                      ]}
                      onPress={() => setTableNum(num)}
                    >
                      <Text style={[styles.tableButtonText, tableNum === num && styles.selectedTableText]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Selected Table Info */}
              <View style={styles.selectedTableInfo}>
                <Text style={styles.selectedTableText}>
                  {tableNum ? `Table ${tableNum} selected` : "No table selected"}
                </Text>
              </View>
              
              {/* Take Order Button */}
              <TouchableOpacity 
                onPress={() => handleEnter(tableNum)} 
                style={[
                  styles.takeOrderButton,
                  !tableNum && styles.disabledButton
                ]}
                disabled={!tableNum}
              >
                <Icon source="food-fork-drink" size={24} color="#ffffff"  />
                <Text style={styles.takeOrderButtonText}>Take Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    marginTop: "1%",
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
  waitressContainerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - 190,
    paddingVertical: 20,
  },
  waitressContainer: {
    width: '90%',
    paddingVertical: 30,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  waitressTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#871919ff',
    marginBottom: 30,
    fontFamily: 'Helvetica',
  },
  tableLayout: {
    width: '100%',
    marginVertical: 20,
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tableButton: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedTableButton: {
    backgroundColor: '#871919ff',
    borderColor: '#700000',
  },
  tableButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedTableText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedTableInfo: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeOrderButton: {
    backgroundColor: '#871919ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 220,
    borderRadius: 30,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonIcon: {
    marginRight: 10,
  },
  takeOrderButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

