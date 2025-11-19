# Test Suite Documentation

## Overview
This test suite provides comprehensive coverage for the McKinleyUI React Native application, including tests for contexts, services, components, hooks, and screens.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests without watch
```bash
npm run test:ci
```

## Test Structure

```
__tests__/
├── setup.ts                    # Global test setup and mocks
├── utils/
│   └── testUtils.tsx          # Custom render functions and mock data
├── context/
│   ├── AuthContext.test.tsx   # Authentication context tests
│   ├── CartContext.test.tsx   # Shopping cart context tests
│   ├── TabBarContext.test.tsx # Tab bar visibility tests
│   └── TableContext.test.tsx  # Table selection tests
├── services/
│   └── api.test.tsx           # API client and interceptor tests
├── components/
│   ├── ThemedText.test.tsx    # Themed text component tests
│   ├── ThemedView.test.tsx    # Themed view component tests
│   ├── MenuItemCard.test.tsx  # Menu item card tests
│   ├── OrderCard.test.tsx     # Order card tests
│   ├── HorizontalPills.test.tsx # Category pills tests
│   └── ViewSwitcher.test.tsx  # View switcher tests
├── hooks/
│   ├── useColorScheme.test.tsx # Color scheme hook tests
│   └── useThemeColor.test.tsx  # Theme color hook tests
└── app/
    ├── Home.test.tsx          # Home screen tests
    ├── Login.test.tsx         # Login screen tests
    └── Cart.test.tsx          # Cart screen tests
```

## Test Coverage Areas

### Contexts (100% coverage)
- **AuthContext**: Token management, login/logout, refresh token flow
- **CartContext**: Add/remove items, calculate totals, persist cart data
- **TabBarContext**: Show/hide/toggle tab bar visibility
- **TableContext**: Table number selection and persistence

### Services
- **API Client**: Request/response interceptors, token refresh, error handling

### Components
- **ThemedText**: Theme-aware text with different styles
- **ThemedView**: Theme-aware container components
- **MenuItemCard**: Display menu items with images and tags
- **OrderCard**: Display order information
- **HorizontalPills**: Category selection pills
- **ViewSwitcher**: Toggle between different views

### Hooks
- **useColorScheme**: Detect light/dark mode
- **useThemeColor**: Get theme-specific colors

### Screens
- **Home**: Role-based view rendering
- **Login**: Email/password and OAuth authentication
- **Cart**: Cart management and checkout

## Key Testing Patterns

### Testing with Contexts
```typescript
import { render } from '@/tests/utils/testUtils';

// The custom render automatically wraps components with all providers
const { result } = render(<MyComponent />);
```

### Testing Hooks
```typescript
import { renderHook, act } from '@testing-library/react-native';

const { result } = renderHook(() => useCart(), {
  wrapper: CartProvider,
});
```

### Mocking Platform-Specific Code
```typescript
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));
```

### Testing Async Operations
```typescript
await act(async () => {
  await result.current.loginTokens(token, refresh, uid);
});

await waitFor(() => {
  expect(result.current.uid).toBe(uid);
});
```

## Mocked Dependencies

The test suite mocks the following external dependencies:
- `expo-router`: Navigation functions
- `expo-secure-store`: Secure storage for tokens
- `@react-native-async-storage/async-storage`: Local storage
- `axios`: HTTP client
- `expo-haptics`: Haptic feedback
- `react-native-gesture-handler`: Gesture handling
- `react-native-reanimated`: Animations
- `@react-native-google-signin/google-signin`: Google OAuth

## Coverage Thresholds

Current coverage goals:
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## Best Practices

1. **Isolate Tests**: Each test should be independent
2. **Clear Mocks**: Always clear mocks between tests with `jest.clearAllMocks()`
3. **Meaningful Assertions**: Test behavior, not implementation
4. **Use Test IDs**: Add testID props for easier element selection
5. **Handle Async**: Always wait for async operations to complete
6. **Mock External APIs**: Don't make real API calls in tests

## Troubleshooting

### Tests timing out
- Increase timeout in jest config
- Check for unresolved promises
- Ensure all async operations are properly awaited

### Module not found errors
- Check that paths are correctly aliased in tsconfig.json
- Verify mock modules exist
- Clear jest cache: `npm run test -- --clearCache`

### Type errors in tests
- Ensure @types packages are installed
- Check that mocks match the actual API
- Use `as jest.Mock` for type assertions

## Future Enhancements

- [ ] Add integration tests
- [ ] Add E2E tests with Detox
- [ ] Increase coverage to 90%+
- [ ] Add performance tests
- [ ] Add accessibility tests
- [ ] Add snapshot tests for UI components
