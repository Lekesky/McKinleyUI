import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/context/AuthContext';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import api from '../../services/api';


export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);
  const { uid, accessToken, refreshToken } = useAuth();

  useEffect(() => {
    if (!uid) return;
    console.log("Fetching role for UID: ", uid);
    console.log(`Bearer ${accessToken}`);
    console.log(`Refresh token: ${refreshToken}`);
    api.get(`/user/role/${uid}`, 
      { headers: { Authorization: `Bearer ${accessToken}` }, 
    })
      .then(res => {setRole(res.data)})
      .catch((error) => {
        console.error(`Error fetching user role for: `, error.message);
        setRole('');
      });
  }, [uid, accessToken, refreshToken]);

  if (role === null) {
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
      name="Menu"
      options={{
        title: 'Menu',
        tabBarIcon: ({ color }: { color: string }) => (
          <IconSymbol size={28} name="book.fill" color={color} />
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
      name="Kitchen"
      options={{
        href: role === 'CHEF' || role === 'ADMIN' ? undefined : null,
        title: 'Kitchen',
        tabBarIcon: ({ color }: { color: string }) => (
          <IconSymbol size={28} name="kitchen.icon" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Waitress"
      options={{
        href: role === 'WAITRESS' || role === 'ADMIN' ? undefined : null,
        title: 'Waitress',
        tabBarIcon: ({ color }: { color: string }) => (
          <IconSymbol size={28} name="kitchen.icon" color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Admin"
      options={{
        href: role === 'ADMIN' ? undefined : null,
        title: 'Admin',
        tabBarIcon: ({ color }: { color: string }) => (
          <IconSymbol size={28} name="admin-panel.settings" color={color} />
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
