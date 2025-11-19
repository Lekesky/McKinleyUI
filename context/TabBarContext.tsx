import React, { createContext, useCallback, useContext, useState } from 'react';

type MobileTabBarContextType = {
  isTabBarVisible: boolean;
  setMobileTabBarVisible: (visible: boolean) => void;
  hideTabBar: () => void;
  showTabBar: () => void;
  toggleTabBar: () => void;
};

const TabBarContext = createContext<MobileTabBarContextType | undefined>(undefined);

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState<boolean>(true);

  const setMobileTabBarVisible = useCallback((visible: boolean) => {
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
      setMobileTabBarVisible,
      hideTabBar,
      showTabBar,
      toggleTabBar 
    }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useMobileTabBar = (): MobileTabBarContextType => {
  const context = useContext(TabBarContext);
  
  if (context === undefined) {
    throw new Error('useMobileTabBar must be used within a TabBarProvider');
  }
  
  return context;
};