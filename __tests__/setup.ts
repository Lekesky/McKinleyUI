// Mock expo-router
jest.mock('expo-router', () => {
  // Import React for createElement
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  
  // Create proper mock components
  function MockStack({ children }: any) { return children; }
  MockStack.Screen = function MockStackScreen() { return null; };
  
  function MockTabs({ children }: any) { return children; }
  MockTabs.Screen = function MockTabsScreen() { return null; };
  
  function MockLink({ children }: any) { return children; }
  function MockRedirect(props: any) { 
    // Return a simple element with the props so tests can access them
    return React.createElement('Redirect', props);
  }
  
  return {
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
    },
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
    useSegments: () => [],
    usePathname: () => '/',
    Stack: MockStack,
    Tabs: MockTabs,
    Link: MockLink,
    Redirect: MockRedirect,
  };
});

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');

  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children, ...props }: any) => React.createElement('View', props, children),
    useSafeAreaInsets: jest.fn(() => ({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    })),
  };
});

// Mock axios
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })),
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Mock react-native-auth0
jest.mock('react-native-auth0', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');

  return {
    Auth0Provider: ({ children }: any) => React.createElement(React.Fragment, null, children),
    useAuth0: jest.fn(() => ({
      authorize: jest.fn(() => Promise.resolve(null)),
      clearSession: jest.fn(() => Promise.resolve()),
      getCredentials: jest.fn(() => Promise.resolve({
        accessToken: 'test-access-token',
        idToken: 'test-id-token',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
        tokenType: 'Bearer',
      })),
      hasValidCredentials: jest.fn(() => Promise.resolve(false)),
      isLoading: false,
      user: null,
      error: null,
    })),
  };
});

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  function MockDialog({ children, visible }: any) {
    return visible ? children : null;
  }
  MockDialog.Title = function MockDialogTitle({ children, ...props }: any) {
    return React.createElement('Text', props, children);
  };
  MockDialog.Content = function MockDialogContent({ children, ...props }: any) {
    return React.createElement('View', props, children);
  };
  MockDialog.Actions = function MockDialogActions({ children, ...props }: any) {
    return React.createElement('View', props, children);
  };
  
  return {
    Button: ({ children, onPress, ...props }: any) => 
      React.createElement('Button', { accessible: true, onPress, ...props }, 
        React.createElement('Text', null, children)
      ),
    Text: ({ children, style, ...props }: any) => 
      React.createElement('Text', { style, ...props }, children),
    TextInput: 'TextInput',
    ActivityIndicator: ({ animating, ...props }: any) => 
      React.createElement('View', props, 'ActivityIndicator'),
    Card: ({ children, style, ...props }: any) => 
      React.createElement('View', { style, ...props }, children),
    Icon: ({ source, size, color, ...props }: any) => 
      React.createElement('View', { ...props }, source),
    IconButton: 'IconButton',
    Portal: ({ children }: any) => children,
    Dialog: MockDialog,
    Menu: 'Menu',
    Provider: ({ children }: any) => children,
    Snackbar: ({ children, visible, ...props }: any) => 
      visible ? React.createElement('View', props, children) : null,
  };
});
jest.mock('jose', () => ({
  decodeJwt: jest.fn(() => ({
    sub: 'test-user',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  })),
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  __esModule: true,
  default: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock @react-native-google-signin/google-signin
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({ user: { id: '123', email: 'test@example.com' } })),
    signInSilently: jest.fn(() => Promise.resolve({ user: { id: '123', email: 'test@example.com' } })),
    signOut: jest.fn(() => Promise.resolve()),
    revokeAccess: jest.fn(() => Promise.resolve()),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: '0',
    IN_PROGRESS: '1',
    PLAY_SERVICES_NOT_AVAILABLE: '2',
  },
}));

// Mock @stripe/stripe-react-native
jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: ({ children }: any) => children,
  CardField: 'CardField',
  useStripe: () => ({
    confirmPayment: jest.fn(() => Promise.resolve({ paymentIntent: { id: 'pi_123' } })),
    createPaymentMethod: jest.fn(() => Promise.resolve({ paymentMethod: { id: 'pm_123' } })),
  }),
  initPaymentSheet: jest.fn(() => Promise.resolve({ error: null })),
  presentPaymentSheet: jest.fn(() => Promise.resolve({ error: null })),
}));

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  default: 'BottomSheet',
  BottomSheetView: 'BottomSheetView',
  BottomSheetScrollView: 'BottomSheetScrollView',
}));

// Mock toastify-react-native
jest.mock('toastify-react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => React.createElement('View', props, children),
    Toast: {
      show: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'GestureHandlerRootView',
  PanGestureHandler: 'PanGestureHandler',
  TapGestureHandler: 'TapGestureHandler',
  State: {},
  Directions: {},
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    call: jest.fn(),
  },
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((value) => value),
  withSpring: jest.fn((value) => value),
}));

// Silence console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
