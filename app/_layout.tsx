import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TabBarProvider } from '@/context/TabBarContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import createAPIClient from '@/services/api';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useFonts } from 'expo-font';
import * as Notifications from "expo-notifications";
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, Platform, View } from 'react-native';
import 'react-native-reanimated';
import { CartProvider } from '../context/CartContext';
import { TableProvider } from '../context/TableContext';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let publishableKey : string | null = null;
// Create a component to handle authenticated routing
function AuthenticatedLayout() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { refreshToken, refreshAccessToken, accessToken } = useAuth(); // This is now safely inside AuthProvider
  const api = useMemo(() => createAPIClient(), []);

  const fetchPublishableKey = useCallback(async() => {
    if(!accessToken) return;

    api.get('/payments/config').then((res) => {
      publishableKey = res.data.publishableKey;
    }).catch((error) => {
      console.error("Error fetching Stripe publishable key:", error);
    });

  }, [api, accessToken]);

  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    if (!initializing && nextAppState === 'active' && refreshToken) {
      console.log('App returned to foreground, refreshing token');
      refreshAccessToken();
    }
  }, [refreshToken, refreshAccessToken, initializing]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => { subscription.remove() };
  }, [handleAppStateChange]);

  useEffect(() => {
    // Short delay to allow auth state to be determined
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initializing || isRedirecting) return;
    
    setIsRedirecting(true);
    if(refreshToken){
      router.replace('/(tabs)/Home');
    } else {
      router.replace('/Intro');
    }
  }, [initializing, refreshToken, isRedirecting]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshToken) {
        console.log("Auto-refreshing access token");
        refreshAccessToken();
      }
    }, 1000 * 60 * 4.99);
    return () => clearInterval(interval);
  }, [refreshToken, refreshAccessToken]);

   useEffect(() => {
    if (accessToken) {
      fetchPublishableKey();
    }
  }, [accessToken, fetchPublishableKey]);


  if (initializing) {
    return(
      <View
        style = {{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#871919ff" />
      </View>
    );
  }

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Setup notification listeners
  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // Handle the notification here
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      // Example of handling notification data
      if (response.notification.request.content.data) {
        const data = response.notification.request.content.data;
        console.log('Notification data:', data);
        // Navigate based on data if needed
        // Example: if (data.screen) router.push(data.screen);
      }
    });

    return () => {
      // Clean up the listeners
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  


  return (
    <AuthProvider>
      <StripeProvider publishableKey={publishableKey || ''}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <TabBarProvider>
            <TableProvider>
              <CartProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="+not-found" />
                  <Stack.Screen name="Intro" />
                  <Stack.Screen name="Login" />
                  <Stack.Screen name="Signup" />
                </Stack>
                {Platform.OS !== 'web' && <AuthenticatedLayout />}
              </CartProvider>
            </TableProvider>
          </TabBarProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </StripeProvider>
    </AuthProvider>
  );
}