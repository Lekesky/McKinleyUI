import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Tabs as TabNames } from '@/constants/Tabs';
import { useAuth } from '@/context/AuthContext';
import { useMobileTabBar } from '@/context/TabBarContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';


export default function TabLayout() {
  const { userRole } = useAuth();
  const { isTabBarVisible } = useMobileTabBar();

  // Show loading state while userRole is being fetched, don't block rendering
  if (userRole === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#871919ff" />
      </View>
    );
  }

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#fcfcfcff",
      tabBarInactiveTintColor: "#d3a3a3",
      tabBarShowLabel: false,
      headerPressOpacity: 1,
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
        // Hide tab bar completely on web, use context state on mobile
        display: Platform.OS === 'web' ? 'none' : (isTabBarVisible ? 'flex' : 'none'),
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
          },
          android: {
            elevation: 10,
            rippleColor: 'transparent',
          },
        }),
      },
      tabBarItemStyle: {
        top: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
    }}
  >

    {TabNames.map((tab) => (
      <Tabs.Screen
        key={tab.name}
        name={tab.name}
        options={{
          title: tab.title,
          tabBarIcon: ({ color }: { color: string }) => {
            
            if (tab.iconProvider === 'MaterialCommunityIcons') {
              return <MaterialCommunityIcons size={28} name={tab.iconName as any} color={color} />;
            }
            return <IconSymbol size={28} name={tab.iconName as any} color={color} />;
          },
        }}
      />
    ))}
    
  </Tabs>
  );
}
