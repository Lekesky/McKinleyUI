import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getAuth } from '@react-native-firebase/auth';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import api from '../../services/api';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [role, setRole] = useState<string | null>(null);
  const [userUID, setUserUID] = useState('');

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(user => {
      setUserUID(getAuth().currentUser?.uid!);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userUID) return;
    api.get(`user/role/${userUID}`)
      .then(res => {
        setRole(res.data);
        console.log("User role: ", res.data);
      })
      .catch(err => {
        console.error('Error fetching user role:', err);
        setRole('');
      });
  }, [userUID]);

  if (role === null) {
    return null; // Or a loading spinner if desired
  }

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarBackground: TabBarBackground,
      tabBarStyle: Platform.select({
        ios: {
          // Use a transparent background on iOS to show the blur effect
          position: 'absolute',
        },
        default: {},
      }),
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
