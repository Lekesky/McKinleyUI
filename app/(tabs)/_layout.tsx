import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/context/AuthContext';
import { useTabBar } from '@/context/TabBarContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';


export default function TabLayout() {
  // const [role, setRole] = useState<string | null>(null);
  const { userRole } = useAuth();
  const { isTabBarVisible, showTabBar } = useTabBar();
  
  // Ensure tab bar is visible on initial load
  useEffect(() => {
    showTabBar();
  }, [showTabBar]);

  if (userRole === null) {
    return null; // Or a loading spinner if desired
  }

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#fcfcfcff", // Active tab icon color
      tabBarInactiveTintColor: '#ffffff', // Inactive tab icon color (customize this)
      tabBarShowLabel: false,
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarStyle: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        elevation: 0,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#871919ff',
        marginHorizontal: 10,
        display: isTabBarVisible ? 'flex' : 'none', // Hide tab bar based on context
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
          },
          android: {
            elevation: 10,
          },
        }),
      },
       tabBarItemStyle: {
          height: 60,
          justifyContent: 'center',
          paddingTop: 0,
          marginTop: 8,
      },
    }}
  >
    <Tabs.Screen
      name="Home"
      options={{
        title: 'Home',
        tabBarIcon: ({ color }: { color: string }) => (
          <IconSymbol size={28} name="house.fill" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Order"
      options={{
        title: 'Order',
        tabBarIcon: ({ color }: { color: string }) => (
          <MaterialCommunityIcons size={28} name="progress-clock" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Cart"
      options={{
        title: 'Cart',
        tabBarIcon: ({ color }: { color: string }) => (
          <IconSymbol size={28} name="cart.fill" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Notification"
      options={{
        title: 'Notification',
        tabBarIcon: ({ color }: { color: string }) => (
          <IconSymbol size={28} name="bell.fill" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Profile"
      options={{
        title: 'Profile',
        tabBarIcon: ({ color }: { color: string }) => (
          <IconSymbol size={28} name="person.crop.circle.fill" color={color} />
        ),
      }}
    />
  </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
});
