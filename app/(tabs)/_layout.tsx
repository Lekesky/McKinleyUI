import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Tabs as TabNames } from '@/constants/Tabs';
import { useAuth } from '@/context/AuthContext';
import { useMobileTabBar } from '@/context/TabBarContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {
  // const [role, setRole] = useState<string | null>(null);
  const { userRole } = useAuth();
  const { isTabBarVisible } = useMobileTabBar();

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
