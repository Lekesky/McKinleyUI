import NavBar from '@/components/NavBar.web';
import StripeWrapper from '@/components/StripeWrapper';
import { AuthProvider } from '@/context/AuthContext';
import { TabBarProvider } from '@/context/TabBarContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getAuth0ProviderProps } from '@/services/auth0';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Auth0Provider } from 'react-native-auth0';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';
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

// Render all screens - let them handle redirects via auth state
function RootNavigator() {
  return (
    <TableProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="Intro" />
        </Stack>
      </CartProvider>
    </TableProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const auth0ProviderProps = getAuth0ProviderProps();

  // Only hide splash screen after fonts are loaded
  // Auth state will be evaluated separately
  useEffect(() => {
    if (loaded) {
      // For mobile, we need to hide the splash screen after fonts load
      // The AuthenticatedLayout will handle navigation
      if (Platform.OS !== 'web') {
        // Small delay to ensure auth context has initialized
        const timer = setTimeout(() => {
          SplashScreen.hideAsync();
        }, 100);
        return () => clearTimeout(timer);
      }
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
    <SafeAreaProvider>
      {/* The SDK supports web-specific provider props, but its exported TS type only includes the base options. */}
      <Auth0Provider {...(auth0ProviderProps as any)}>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DarkTheme}>
            <GestureHandlerRootView>
              <PaperProvider>
                <StripeWrapper>
                  <TabBarProvider>
                    {(Platform.OS === 'web' ? <NavBar /> : null) as any}
                    <RootNavigator />
                  </TabBarProvider>
                  <StatusBar style="auto" />
                  <ToastManager 
                    position='bottom'
                    bottomOffset={Platform.OS === 'web' ? 0 : 100}
                    showProgressBar={false}
                    animationStyle="fade"
                    useModal={false}
                  />
                </StripeWrapper>
              </PaperProvider>
            </GestureHandlerRootView>
          </ThemeProvider>
        </AuthProvider>
      </Auth0Provider>
    </SafeAreaProvider>
  );
}
