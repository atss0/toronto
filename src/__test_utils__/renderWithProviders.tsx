import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import UserSlice from '../redux/UserSlice';
import ThemeSlice from '../redux/ThemeSlice';
import LanguageSlice from '../redux/LanguageSlice';
import i18n from '../i18n/i18n';
import { ThemeProvider } from '../context/ThemeContext';

export const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Test',
  surname: 'User',
  username: 'testuser',
  email: 'test@example.com',
  photo: '',
  is_email_verified: true,
  is_premium: false,
};

export const createMockState = (overrides: any = {}) => ({
  User: {
    user: null,
    token: null,
    refreshToken: null,
    location: { latitude: null, longitude: null },
    locationName: '',
    ...overrides.User,
  },
  Theme: { theme: 'light' as const, ...overrides.Theme },
  Language: { lang: 'en' as const, ...overrides.Language },
});

export const createTestStore = (preloadedState?: any) => {
  const rootReducer = combineReducers({
    User: UserSlice,
    Theme: ThemeSlice,
    Language: LanguageSlice,
  });
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState ?? createMockState(),
  });
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
  withNavigation?: boolean;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    withNavigation = false,
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const content = (
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Provider>
      </I18nextProvider>
    );
    return withNavigation ? (
      <NavigationContainer>{content}</NavigationContainer>
    ) : content;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export default renderWithProviders;
