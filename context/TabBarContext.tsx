import React, { createContext, useCallback, useContext, useState } from 'react';

type TabBarContextType = {
  isTabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
  hideTabBar: () => void;
  showTabBar: () => void;
  toggleTabBar: () => void;
};

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState<boolean>(true);

  const setTabBarVisible = useCallback((visible: boolean) => {
    console.log(`Setting tab bar visibility to: ${visible}`);
    setIsTabBarVisible(visible);
  }, []);

  const hideTabBar = useCallback(() => {
    setIsTabBarVisible(false);
  }, []);

  const showTabBar = useCallback(() => {
    setIsTabBarVisible(true);
  }, []);

  const toggleTabBar = useCallback(() => {
    setIsTabBarVisible(prev => !prev);
  }, []);

  return (
    <TabBarContext.Provider value={{ 
      isTabBarVisible, 
      setTabBarVisible,
      hideTabBar,
      showTabBar,
      toggleTabBar 
    }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = (): TabBarContextType => {
  const context = useContext(TabBarContext);
  
  if (context === undefined) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  
  return context;
};