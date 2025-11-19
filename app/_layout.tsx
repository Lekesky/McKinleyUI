import NavBar from '@/components/NavBar.web';
import StripeWrapper from '@/components/StripeWrapper';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TabBarProvider } from '@/context/TabBarContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { router, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { CartProvider } from '../context/CartContext';
import { TableProvider } from '../context/TableContext';

SplashScreen.preventAutoHideAsync();


// Configure notification handling for native platforms only
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Create a component to handle authenticated routing
function AuthenticatedLayout() {
  const segments = useSegments();
  const { refreshToken, refreshAccessToken, accessTokenTTL, isAuthLoading } = useAuth();

  // Handle app state changes (mobile only - web doesn't have AppState)
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (!isAuthLoading && nextAppState === 'active' && refreshToken) {
      refreshAccessToken();
    }
  }, [refreshToken, refreshAccessToken, isAuthLoading]);

  // Setup app state listener for mobile platforms
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const subscription = AppState.addEventListener('change', handleAppStateChange);
      return () => { subscription.remove() };
    }
  }, [handleAppStateChange]);

  // Hide splash screen once auth is ready
  useEffect(() => {
    if (!isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [isAuthLoading]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isAuthLoading) return;

    const inPublicRoute = segments[0] === 'Intro' || segments[0] === 'Login' || segments[0] === 'Signup';

    if (!refreshToken && !inPublicRoute) {
      // User is not authenticated and not on a public route
      if (Platform.OS !== 'web') {
        router.replace('/Intro');
      } else {
        router.replace('/Login');
      }
    } else if (refreshToken && inPublicRoute) {
      // User is authenticated but on a public route - send to home
      router.replace('/(tabs)/Home');
    }
  }, [isAuthLoading, refreshToken, segments]);

  // Auto-refresh access token
  useEffect(() => {
    if (isAuthLoading) return;
    
    const ttl = accessTokenTTL || 5 * 60 * 1000; // Default to 5 minutes if TTL not available
    const interval = setInterval(() => {
      if (refreshToken) {
        refreshAccessToken();
      }
    }, ttl * 0.9); // Refresh at 90% of TTL
    return () => clearInterval(interval);
  }, [accessTokenTTL, refreshToken, refreshAccessToken, isAuthLoading]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Only hide splash screen after fonts are loaded
  // Auth state will be evaluated separately
  useEffect(() => {
    if (loaded) {
      // Don't hide splash screen yet - let AuthenticatedLayout handle it
    }
  }, [loaded]);

  // Setup notification listeners for native platforms only
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // This listener is fired whenever a notification is received while the app is foregrounded
      const foregroundSubscription = Notifications.addNotificationReceivedListener(() => {
        // Handle the notification here
      });

      // This listener is fired whenever a user taps on or interacts with a notification
      const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        // Handle notification data
        if (response.notification?.request?.content?.data) {
          // Navigate based on data if needed
        }
      });

      return () => {
        // Clean up the listeners
        foregroundSubscription.remove();
        responseSubscription.remove();
      };
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DarkTheme}>
        <GestureHandlerRootView>
          <StripeWrapper>
            <TabBarProvider>
              {(Platform.OS === 'web' ? <NavBar /> : null) as any}
              <TableProvider>
                <CartProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="+not-found" />
                    <Stack.Screen name="Intro" />
                    <Stack.Screen name="Login" />
                    <Stack.Screen name="Signup" />
                  </Stack>
                  <AuthenticatedLayout />
                </CartProvider>
              </TableProvider>
            </TabBarProvider>
            <StatusBar style="auto" />
          </StripeWrapper>
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  );
}