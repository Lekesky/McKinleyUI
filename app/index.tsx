import { useAuth } from '@/context/AuthContext';
import { useAuthModal } from '@/context/AuthModalContext';
import createAPIClient, { PageableResponse } from '@/services/api';
import { Redirect, router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Image, Linking, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import styles from '../styles/index.styles';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  taxCode: string;
  featured: boolean;
  imageURL: string;
  tags: string[];
  order: null | number;
}

// Placeholder images - replace with your actual restaurant images
const heroImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', // Restaurant interior
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200', // Food dish
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200', // Restaurant ambiance
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200', // Grilled food
];

export default function Index() {
  const api = useMemo(() => createAPIClient(), []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isAuthenticated } = useAuth();
  const { showLoginModal, setShowLoginModal, showSignupModal, setShowSignupModal } = useAuthModal();
  
  // Featured items pagination state
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 3;

  const handleGetDirections = () => {
    const address = encodeURIComponent('119 E. Fifth Street, Marysville, OH 43040');
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    if (isWeb) {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handleFetchFeaturedItems = (page: number = 0) => {
    setLoading(true);
    api.get<PageableResponse<MenuItem>>(`/menu/featured?page=${page}&size=${pageSize}`)
      .then((response) => {
        setFeaturedItems(response.data.content);
        setCurrentPage(response.data.number);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error('Error fetching featured items:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      handleFetchFeaturedItems(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      handleFetchFeaturedItems(currentPage - 1);
    }
  };

  const handleGoToPage = (page: number) => {
    handleFetchFeaturedItems(page);
  };

  // Manual navigation to specific image
  const goToImage = (index: number) => {
    const imageWidth = width;
    
    // Clear any existing pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Pause auto-scroll
    setIsPaused(true);
    
    // Animate to selected image
    Animated.timing(slideAnim, {
      toValue: -imageWidth * index,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    setCurrentImageIndex(index);
    
    // Resume auto-scroll after 5 seconds
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  useEffect(() => {
    if (isPaused) return;

    const imageWidth = width; // Use full viewport width

    const interval = setInterval(() => {
      const nextIndex = currentImageIndex + 1;
      
      // Animate to next image
      Animated.timing(slideAnim, {
        toValue: -imageWidth * nextIndex,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // If we've shown all original images, reset to the beginning seamlessly
        if (nextIndex >= heroImages.length) {
          slideAnim.setValue(0);
          setCurrentImageIndex(0);
        } else {
          setCurrentImageIndex(nextIndex);
        }
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [slideAnim, currentImageIndex, isPaused]);

  // Fetch featured items on mount
  useEffect(() => {
    handleFetchFeaturedItems(0);
  }, []);

  // Mobile redirects to Intro
  if (Platform.OS !== 'web') {
    return <Redirect href="/Intro" />;
  }

  // Web homepage
  return (
    <>
      <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        {/* Background Image Collage - All images side by side */}
        <Animated.View 
          style={[
            styles.heroImageRow,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Render images twice for seamless loop */}
          {[...heroImages, ...heroImages].map((uri, index) => (
            <View key={index} style={styles.heroImageContainer}>
              <Image 
                source={{ uri }}
                style={[styles.heroImage, isWeb && { objectFit: 'cover' as any }]}
                resizeMode="cover"
              />
            </View>
          ))}
        </Animated.View>
        
        <View style={styles.heroContent}>
          <View style={styles.heroTextBackdrop}>
            <Text style={styles.heroTitle}>McKinley&apos;s Grill</Text>
            <Text style={styles.heroSubtitle}>
              Experience the finest dining with authentic flavors and warm hospitality
            </Text>
          </View>
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => {
                if (isAuthenticated) {
                  router.push('/(tabs)/Home' as any);
                } else {
                  setShowLoginModal(true);
                }
              }}
            >
              <Text style={styles.primaryButtonText}>View Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {
                if (isAuthenticated) {
                  router.push('/(tabs)/Order' as any);
                } else {
                  setShowLoginModal(true);
                }
              }}
            >
              <Text style={styles.secondaryButtonText}>Reserve Table</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {heroImages.map((_, index) => {
            const isActive = index === currentImageIndex;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => goToImage(index)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.paginationDot,
                    {
                      width: isActive ? 32 : 12,
                      opacity: isActive ? 1 : 0.5,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.sectionTitle}>Welcome to Our Table</Text>
        <Text style={styles.welcomeText}>
          At McKinley&apos;s Grill, we believe in creating memorable dining experiences through 
          quality ingredients, exceptional service, and a warm atmosphere. Join us for a meal 
          that feels like home.
        </Text>
      </View>

      {/* Featured Menu Items */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Dishes</Text>
        
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#871919ff" />
          </View>
        ) : (
          <>
            <View style={styles.menuGrid}>
              {featuredItems.map((item) => (
                <View key={item.id} style={styles.menuCard}>
                  {item.imageURL ? (
                    <Image 
                      source={{ uri: item.imageURL }} 
                      style={[styles.menuImage, { width: '100%', height: 200 }]}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.menuImage}>
                      <Text style={styles.imagePlaceholder}>🍽️</Text>
                    </View>
                  )}
                  <View style={styles.menuCardContent}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                    <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                    {item.tags && item.tags.length > 0 && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 4 }}>
                        {item.tags.map((tag, index) => (
                          <View key={index} style={{ backgroundColor: '#871919ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                            <Text style={{ color: 'white', fontSize: 10 }}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 12 }}>
                <TouchableOpacity 
                  onPress={handlePreviousPage}
                  disabled={currentPage === 0}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: currentPage === 0 ? '#ccc' : '#871919ff',
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>Previous</Text>
                </TouchableOpacity>
                
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                    <TouchableOpacity
                      key={page}
                      onPress={() => handleGoToPage(page)}
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: currentPage === page ? '#871919ff' : '#f0f0f0',
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ 
                        color: currentPage === page ? 'white' : '#333',
                        fontWeight: currentPage === page ? '700' : '400'
                      }}>
                        {page + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <TouchableOpacity 
                  onPress={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: currentPage === totalPages - 1 ? '#ccc' : '#871919ff',
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      {/* Info Cards */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}><Icon source="clock" size={48} color="#871919ff" /></Text>
          <Text style={styles.infoTitle}>Hours</Text>
          <Text style={styles.infoText}>Monday: 8am - 2pm</Text>
          <Text style={styles.infoText}>Tuesday: 8am - 2pm</Text>
          <Text style={styles.infoText}>Wednesday: 8am - 2pm</Text>
          <Text style={styles.infoText}>Thursday: 8am - 2pm</Text>
          <Text style={styles.infoText}>Friday: 8am - 2pm</Text>
          <Text style={styles.infoText}>Friday Reopen: 4:30pm - 8:30pm</Text>
          <Text style={styles.infoText}>Saturday: 8am - 2pm</Text>
          <Text style={styles.infoText}>Sunday: 8am - 2pm</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}><Icon source="map-marker" size={48} color="#871919ff" /></Text>
          <Text style={styles.infoTitle}>Location</Text>
          <Text style={styles.infoText}>119 E. Fifth Street</Text>
          <Text style={styles.infoText}>Marysville, OH 43040</Text>
          <TouchableOpacity style={styles.infoButton} onPress={handleGetDirections}>
            <Text style={styles.infoButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}><Icon source="phone" size={48} color="#871919ff" /></Text>
          <Text style={styles.infoTitle}>Contact</Text>
          <Text style={styles.infoText}>Phone: (937)-642-2704</Text>
        </View>
      </View>

      {/* Call to Action */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Dine With Us?</Text>
        <Text style={styles.ctaText}>
          Order online for pickup!
        </Text>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => {
            if (isAuthenticated) {
              router.push('/(tabs)/Order' as any);
            } else {
              setShowLoginModal(true);
            }
          }}
        >
          <Text style={styles.ctaButtonText}>Order Online</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>&copy; 2026 McKinley&apos;s Grill. All rights reserved.</Text>
      </View>
      </ScrollView>

      {/* Login and Signup Modals */}
      <LoginModal 
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      <SignupModal 
        visible={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}


