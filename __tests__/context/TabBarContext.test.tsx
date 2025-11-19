import { TabBarProvider, useMobileTabBar } from '@/context/TabBarContext';
import { act, renderHook } from '@testing-library/react-native';

describe('TabBarContext', () => {
  it('should throw error when useMobileTabBar is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      renderHook(() => useMobileTabBar());
    }).toThrow('useMobileTabBar must be used within a TabBarProvider');
    
    consoleError.mockRestore();
  });

  it('should initialize with tab bar visible', () => {
    const { result } = renderHook(() => useMobileTabBar(), {
      wrapper: TabBarProvider,
    });

    expect(result.current.isTabBarVisible).toBe(true);
  });

  it('should hide tab bar', () => {
    const { result } = renderHook(() => useMobileTabBar(), {
      wrapper: TabBarProvider,
    });

    act(() => {
      result.current.hideTabBar();
    });

    expect(result.current.isTabBarVisible).toBe(false);
  });

  it('should show tab bar', () => {
    const { result } = renderHook(() => useMobileTabBar(), {
      wrapper: TabBarProvider,
    });

    act(() => {
      result.current.hideTabBar();
    });

    act(() => {
      result.current.showTabBar();
    });

    expect(result.current.isTabBarVisible).toBe(true);
  });

  it('should toggle tab bar', () => {
    const { result } = renderHook(() => useMobileTabBar(), {
      wrapper: TabBarProvider,
    });

    const initialState = result.current.isTabBarVisible;

    act(() => {
      result.current.toggleTabBar();
    });

    expect(result.current.isTabBarVisible).toBe(!initialState);

    act(() => {
      result.current.toggleTabBar();
    });

    expect(result.current.isTabBarVisible).toBe(initialState);
  });

  it('should set tab bar visibility directly', () => {
    const { result } = renderHook(() => useMobileTabBar(), {
      wrapper: TabBarProvider,
    });

    act(() => {
      result.current.setMobileTabBarVisible(false);
    });

    expect(result.current.isTabBarVisible).toBe(false);

    act(() => {
      result.current.setMobileTabBarVisible(true);
    });

    expect(result.current.isTabBarVisible).toBe(true);
  });
});
