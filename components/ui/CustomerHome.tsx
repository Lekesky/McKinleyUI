import HorizontalPills from '@/components/HorizontalPills';
import { MenuItemCard } from "@/components/MenuItemCard";
import { useAuth } from "@/context/AuthContext";
import createAPIClient, { API_URL } from "@/services/api";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Keyboard, Platform, RefreshControl, ScrollView, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { IconButton, Text } from "react-native-paper";
import RNEventSource from 'react-native-sse';
import { Toast } from 'toastify-react-native';
import { getStyles } from '../../styles/CustomerHome.styles';

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
export default function CustomerHome() {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const styles = getStyles(SCREEN_WIDTH);
    const { uid, accessToken, refreshAccessToken, isAuthenticated } = useAuth();
    const api = useMemo(() => createAPIClient(), []); 
    const [firstName, setFirstName] = useState<string>('');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('Breakfast');
    const animatedWidth = useRef(new Animated.Value(50)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;
    const animatedGreetingOpacity = useRef(new Animated.Value(1)).current;

    const greeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) return "Good Morning";
        if (currentHour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const toggleSearch = useCallback(() => {
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
    }, [isSearchExpanded, animatedWidth, animatedOpacity, animatedGreetingOpacity]);

    useEffect(() => {
      // Only establish SSE connection if user is authenticated
      if (!isAuthenticated) {
        return;
      }
      
      const url = `${API_URL}/orders/stream?streamMessage=FULFILLMENT_STATUS`;
      
      if (Platform.OS === 'web') {
        // Web EventSource
        const sse = new EventSource(url, { withCredentials: true });

        sse.onopen = () => {
          console.log('SSE connection opened');
        };

        sse.onmessage = (event) => {
          try {
            if (event.data == null) return;
            const data = JSON.parse(event.data);
            if (data.paused === true) {
              Toast.show({
                type: 'info',
                text1: 'Order Fulfillment Paused',
                text2: 'We have put a pause on accepting new orders in the meantime. Please check back later.',
                autoHide: false,
                position: 'bottom',
                backgroundColor: '#871919ff',
                iconColor: '#FFFFFF',
                textColor: '#FFFFFF',
              });
            }
          } catch (parseError) {
            console.warn('SSE: Failed to parse message', parseError);
          }
        };

        sse.onerror = (error) => {
          console.error('SSE error:', error);
          sse.close();
        };

        return () => {
          console.log('Closing SSE connection');
          sse.close();
        };
      } else {
        // React Native EventSource
        const sse = new RNEventSource(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        sse.addEventListener('open', () => {
          console.log('SSE connection opened');
        });

        sse.addEventListener('message', (event) => {
          try {
            if (event.data == null) return;
            const data = JSON.parse(event.data);
            if (data.paused === true) {
              Toast.show({
                type: 'info',
                text1: 'Order Fulfillment Paused',
                text2: 'We have put a pause on accepting new orders in the meantime. Please check back later.',
                autoHide: false,
                position: 'bottom',
                backgroundColor: '#871919ff',
                iconColor: '#FFFFFF',
                textColor: '#FFFFFF',
              });
            }
          } catch (parseError) {
            console.warn('SSE: Failed to parse message', parseError);
          }
        });

        sse.addEventListener('error', (error) => {
          console.error('SSE error:', error);
          // Only attempt refresh if still authenticated
          if(isAuthenticated && JSON.stringify(error).includes('403')){
            refreshAccessToken();
          }
        });

        return () => {
          console.log('Closing SSE connection');
          sse.close();
        };
      }
    }, [isAuthenticated, accessToken, refreshAccessToken]);

    const handleSearch = useCallback((text: string) => {
        setSearchQuery(text);
    }, []);

    const handleItemPress = useCallback((id: string) => {
        router.push({ pathname: '/MenuItem', params: { id } });
    }, []);

    const fetchUserData = useCallback(() => {
        if (!uid) return Promise.resolve();
        
        return api.get(`/user/${uid}`)
            .then((res) => setFirstName(res.data.firstName))
            .catch((error) => {
                const errorMessage = error.response?.data || error.message || 'Failed to fetch user data';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch user data',
                    position: 'top',
                    backgroundColor: '#871919ff',
                    textColor: '#FFFFFF',
                });
            });
    }, [api, uid]);

    const fetchMenuItems = useCallback(() => {
        const params: any = { page: 0, size: 15 };
        return api.get('/menu', params)
            .then((res) => {
                // If paginated, use res.data.content; else fallback
                if (Array.isArray(res.data)) {
                    setMenuItems(res.data);
                } else if (res.data && Array.isArray(res.data.content)) {
                    setMenuItems(res.data.content);
                } else {
                    setMenuItems([]);
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
            });
    }, [api]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        return Promise.all([
            fetchUserData(),
            fetchMenuItems()
        ])
            .finally(() => {
                setRefreshing(false);
            });
    }, [fetchUserData, fetchMenuItems]);

    useEffect(() => {
        fetchUserData();
        fetchMenuItems();
    }, [fetchUserData, fetchMenuItems]);

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

    // Add an effect to manage keyboard visibility based on search state
    useEffect(() => {
        if (!isSearchExpanded) {
        Keyboard.dismiss();
        }
    }, [isSearchExpanded]);

    return (
        <>
            {/* <ToastManager
                showProgressBar={false}
                showCloseIcon={true}
                animationStyle="fade"
                useModal={false}
            /> */}
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
                    onSubmitEditing={isSearchExpanded ? () => {} : () => {}}
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

            {/* Category Pills */}
            <View style={styles.pillsWrapper}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 20}}
              >
                <HorizontalPills 
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </ScrollView>
            </View>

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
        </>
    );
}

