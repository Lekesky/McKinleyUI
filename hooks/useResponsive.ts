import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';

// Define breakpoints
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  width: number;
  height: number;
  currentBreakpoint: BreakpointKey;
}

/**
 * Hook to get current responsive state
 * Works on both mobile and web platforms
 */
export const useResponsive = (): ResponsiveState => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;

  // Only apply breakpoints on web
  const isWeb = Platform.OS === 'web';
  
  const isMobile = isWeb ? width < BREAKPOINTS.tablet : Platform.OS !== 'web';
  const isTablet = isWeb ? width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop : false;
  const isDesktop = isWeb ? width >= BREAKPOINTS.desktop && width < BREAKPOINTS.largeDesktop : false;
  const isLargeDesktop = isWeb ? width >= BREAKPOINTS.largeDesktop : false;

  let currentBreakpoint: BreakpointKey = 'mobile';
  if (isWeb) {
    if (width >= BREAKPOINTS.largeDesktop) currentBreakpoint = 'largeDesktop';
    else if (width >= BREAKPOINTS.desktop) currentBreakpoint = 'desktop';
    else if (width >= BREAKPOINTS.tablet) currentBreakpoint = 'tablet';
    else currentBreakpoint = 'mobile';
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    width,
    height,
    currentBreakpoint,
  };
};
