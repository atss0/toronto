/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { createTestStore } from '../src/__test_utils__/renderWithProviders';

jest.mock('../src/config/google', () => ({ configureGoogleSignin: jest.fn() }));
jest.mock('../src/storage/tokenStorage', () => ({
  tokenStorage: {
    init: jest.fn(() => Promise.resolve({ accessToken: null, refreshToken: null })),
    save: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    getAccessToken: jest.fn(() => null),
    getRefreshToken: jest.fn(() => null),
    hasTokens: jest.fn(() => false),
  },
}));
jest.mock('../src/services/user', () => ({
  default: { getMe: jest.fn(() => Promise.resolve({ data: { data: {} } })) },
}));
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    NavigationContainer: ({ children }: any) => children,
  };
});
jest.mock('../src/navigators/RootStackNavigator', () => () => null);
jest.mock('../src/navigators/AuthStackNavigator', () => () => null);
jest.mock('../src/screens/SplashScreen', () => () => null);

import App from '../App';

test('renders without crashing', async () => {
  const store = createTestStore();
  const { unmount } = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  unmount();
});
