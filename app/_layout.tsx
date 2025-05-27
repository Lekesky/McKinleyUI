import { useColorScheme } from '@/hooks/useColorScheme';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import 'react-native-reanimated';
import { CartProvider } from '../context/CartContext';
import { TableProvider } from '../context/TableContext';



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
  const subscriber = onAuthStateChanged(getAuth(), (user) => {
    setUser(user);
    if (initializing) {setInitializing(false);}
  });
  return subscriber; // unsubscribe on unmount
  }, [initializing]);

  useEffect(() => {
    if(initializing) return;
    if(user){
      router.replace('/(tabs)/Home');
    }else{
      router.replace('/Login');
    }
  }, [user, initializing]);


  if (initializing) {
    return(
      <View
        style = {{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const AppContent = (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TableProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </CartProvider>
      </TableProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <StripeProvider publishableKey={publishableKey || ''}>
        {AppContent}
      </StripeProvider>
    );
  }

  return AppContent;
}
