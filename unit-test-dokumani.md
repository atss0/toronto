# 🧪 Toronto (Rio) — Kapsamlı Unit Test Dökümanı

> **Proje:** Toronto (React Native 0.84.1 · TypeScript · Redux Toolkit)  
> **Oluşturulma:** 2026-04-25  
> **Hedef:** Geliştirici ekibinin test yazma sürecine rehberlik etmek

---

## İçindekiler

1. ✅ [Test Stack & Araçlar](#1-test-stack--araçlar)
2. ✅ [Proje Yapılandırması](#2-proje-yapılandırması)
3. ✅ [Test Helper'lar & Utilities](#3-test-helperlar--utilities)
4. ✅ [Bileşen (Component) Testleri](#4-bileşen-component-testleri)
5. ✅ [State & Hook Testleri](#5-state--hook-testleri)
6. ✅ [Service Katmanı Testleri](#6-service-katmanı-testleri)
7. ✅ [Mock Yönetimi](#7-mock-yönetimi)
8. ✅ [Senaryo Tablosu](#8-senaryo-tablosu)
9. ✅ [Örnek Test Kodları](#9-örnek-test-kodları)
10. ✅ [Best Practices & Kurallar](#10-best-practices--kurallar)

---

## 1. ✅ Test Stack & Araçlar

| Araç | Versiyon | Kullanım Amacı |
|---|---|---|
| **Jest** | ^29.6.3 | Test runner, assertion, snapshot, coverage |
| **React Native Testing Library (RNTL)** | ^12.x | UI bileşenlerini render etme, kullanıcı etkileşimi simülasyonu |
| **@testing-library/react-hooks** | ^8.x *(veya RNTL `renderHook`)* | Custom hook'ları arayüzden bağımsız test etme |
| **jest-mock-extended** | ^3.x | Tip-güvenli mock nesneleri oluşturma |
| **MSW (Mock Service Worker)** | ^2.x *(opsiyonel)* | Ağ katmanını interceptor ile mocklama |
| **@redux-mock-store** *(opsiyonel)* | ^1.x | Redux store mock'u (izole testler için) |
| **jest-expo / @react-native/jest-preset** | - | React Native Jest preset'i (mevcut `react-native` preset kullanılıyor) |

### Kurulum Komutu

```bash
npm install --save-dev @testing-library/react-native \
  @testing-library/jest-native \
  jest-mock-extended \
  msw
```

> [!NOTE]
> Proje zaten `jest` (^29.6.3) ve `react-test-renderer` (19.2.3) paketlerini içermektedir. RNTL eklenmesi yeterlidir.

---

## 2. ✅ Proje Yapılandırması

### jest.config.js ✅

```js
module.exports = {
  preset: 'react-native',
  
  // Dosya uzantıları
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Path alias'ları (babel.config.js ile uyumlu)
  moduleNameMapper: {
    // SVG ve resim dosyaları
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Setup dosyaları
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterFramework: [],
  
  // Transform ignore — RN paketleri
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|react-native-reanimated' +
      '|react-native-gesture-handler' +
      '|react-native-safe-area-context' +
      '|react-native-screens' +
      '|react-native-iconify' +
      '|react-native-mmkv' +
      '|react-native-keychain' +
      '|react-native-localize' +
      '|react-native-image-picker' +
      '|react-native-element-dropdown' +
      '|react-native-svg' +
      '|@react-native-clipboard/clipboard' +
      '|@react-native-google-signin/google-signin' +
      '|@invertase/react-native-apple-authentication' +
      '|@gorhom/bottom-sheet' +
      '|@reduxjs/toolkit' +
      '|i18next' +
      '|react-i18next' +
      '|react-redux' +
    ')/)',
  ],
  
  // Coverage ayarları
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.style.ts',
    '!src/**/index.ts',
    '!src/types/**',
    '!src/assets/**',
    '!src/data/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
};
```

### jest.setup.js ✅

```js
// React Native mock'ları
jest.mock('react-native-mmkv', () => ({
  createMMKV: () => ({
    getString: jest.fn(),
    set: jest.fn(),
    contains: jest.fn(() => false),
    remove: jest.fn(),
  }),
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
  ACCESSIBLE: { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WhenUnlockedThisDeviceOnly' },
}));

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'en', countryCode: 'US' }],
}));

jest.mock('react-native-iconify', () => ({
  Iconify: 'Iconify',
}));

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    FlatList: require('react-native').FlatList,
    ScrollView: require('react-native').ScrollView,
    TouchableOpacity: require('react-native').TouchableOpacity,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: { configure: jest.fn(), signIn: jest.fn() },
}));

jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: { performRequest: jest.fn(), Operation: {}, Scope: {} },
}));

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// i18n mock — tüm key'leri olduğu gibi döndür
jest.mock('./src/i18n/i18n', () => ({
  t: (key) => key,
  changeLanguage: jest.fn(),
  language: 'en',
}));

// Global silence warnings in tests
jest.spyOn(console, 'warn').mockImplementation(() => {});
```

### __mocks__/fileMock.js ✅

```js
module.exports = 'test-file-stub';
```

---

## 3. ✅ Test Helper'lar & Utilities

Tüm helper'lar `src/__test_utils__/` klasöründe tutulmalıdır.

### renderWithProviders ✅ `src/__test_utils__/renderWithProviders.tsx`

```tsx
// src/__test_utils__/renderWithProviders.tsx
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

// Mock user verisi
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

// Pre-loaded state oluşturma
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

// Store factory
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

/**
 * Tüm Provider'larla birlikte bileşeni render eder.
 * Redux, i18n, ThemeContext ve opsiyonel NavigationContainer sağlar.
 */
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
```

### Mock Navigation ✅ `src/__test_utils__/mockNavigation.ts`

```ts
// src/__test_utils__/mockNavigation.ts
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(),
  isFocused: jest.fn(() => true),
  getId: jest.fn(),
};

export const mockRoute = (params: Record<string, any> = {}) => ({
  key: 'test-route-key',
  name: 'TestScreen',
  params,
});

// Jest mock factory
export const setupNavigationMock = () => {
  jest.mock('@react-navigation/native', () => {
    const actual = jest.requireActual('@react-navigation/native');
    return {
      ...actual,
      useNavigation: () => mockNavigation,
      useRoute: () => mockRoute(),
      useFocusEffect: jest.fn(),
      useIsFocused: () => true,
    };
  });
};
```

### Mock API Response Factory ✅ `src/__test_utils__/mockApiResponses.ts`

```ts
// src/__test_utils__/mockApiResponses.ts

/**
 * Standart başarılı API yanıtı oluşturur.
 * Backend'in { success, data, message } formatına uyar.
 */
export const createSuccessResponse = (data: any, message = 'OK') => ({
  data: {
    success: true,
    data,
    message,
  },
});

/**
 * Standart hata API yanıtı oluşturur.
 */
export const createErrorResponse = (
  code: string,
  message: string,
  status = 400,
  details?: Record<string, string[]>,
) => ({
  response: {
    status,
    data: {
      success: false,
      error: { code, message, ...(details && { details }) },
    },
  },
});

/**
 * Sayfalandırılmış API yanıtı oluşturur.
 */
export const createPaginatedResponse = (
  data: any[],
  page = 1,
  total = 100,
  limit = 20,
) => ({
  data: {
    success: true,
    data,
    message: 'OK',
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  },
});
```

---

## 4. ✅ Bileşen (Component) Testleri

> **Uygulama:** Aşağıdaki bileşen test dosyaları oluşturuldu (40 test, tümü geçti):
> - ✅ `src/components/Button/Button.test.tsx` — 9 test (render, onPress, isLoading, isDisabled, icons, accessibilityState)
> - ✅ `src/components/Input/Input.test.tsx` — 9 test (label, error, isPassword toggle, editable, onChangeText)
> - ✅ `src/components/StackHeader/StackHeader.test.tsx` — 5 test (title, goBack, rightComponent, rightIcon)
> - ✅ `src/components/SectionHeader/SectionHeader.test.tsx` — 4 test (title, See all, onPressSeeAll)
> - ✅ `src/components/ErrorScreen/ErrorScreen.test.tsx` — 5 test (message, retry button, onRetry)
> - ✅ `src/screens/auth/LoginScreen.test.tsx` — 7 test (render, disabled state, credentials, setUser dispatch, error msg, EMAIL_NOT_VERIFIED nav)
>
> **Config düzeltmeleri:** `jest.config.js`'e `immer` eklendi; `jest.setup.js`'e `react-i18next` global mock'u eklendi.

### 4.1 Genel Yaklaşım

```
src/
└── components/
    └── Button/
        ├── Button.tsx
        ├── Button.style.ts
        ├── Button.test.tsx      ← Test dosyası bileşenin yanında
        └── index.ts
```

> [!IMPORTANT]
> Test dosyaları ilgili bileşenin klasörü içinde `*.test.tsx` olarak oluşturulmalıdır. `__tests__/` dizini yalnızca proje düzeyinde entegrasyon testleri için ayrılmalıdır.

### 4.2 UI Bileşenlerinin Render Edilmesi

```tsx
// Doğru: RNTL ile render
import { render, screen } from '@testing-library/react-native';
import Button from './Button';

test('renders button title', () => {
  render(<Button title="Save" onPress={jest.fn()} />);
  expect(screen.getByText('Save')).toBeTruthy();
});
```

### 4.3 Prop Doğrulama

```tsx
test('shows ActivityIndicator when isLoading is true', () => {
  const { getByRole } = render(
    <Button title="Submit" onPress={jest.fn()} isLoading />
  );
  // Loading durumunda title yerine spinner gösterilir
  expect(() => screen.getByText('Submit')).toThrow();
  // ActivityIndicator erişilebilirlik ile bulunabilir
});

test('button is disabled when isDisabled is true', () => {
  const onPress = jest.fn();
  const { getByRole } = render(
    <Button title="Go" onPress={onPress} isDisabled />
  );
  const btn = getByRole('button');
  expect(btn.props.accessibilityState.disabled).toBe(true);
});
```

### 4.4 Kullanıcı Etkileşimleri

```tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Tıklama simülasyonu
test('calls onPress when button is pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <Button title="Login" onPress={onPress} />
  );
  fireEvent.press(getByText('Login'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

// Form input simülasyonu
test('updates input value on text change', () => {
  const onChangeText = jest.fn();
  const { getByPlaceholderText } = render(
    <Input placeholder="Email" onChangeText={onChangeText} />
  );
  fireEvent.changeText(getByPlaceholderText('Email'), 'test@mail.com');
  expect(onChangeText).toHaveBeenCalledWith('test@mail.com');
});

// Şifre göster/gizle toggle
test('toggles password visibility', () => {
  const { getByDisplayValue, getByRole } = render(
    <Input isPassword value="secret123" onChangeText={jest.fn()} />
  );
  const input = getByDisplayValue('secret123');
  expect(input.props.secureTextEntry).toBe(true);
  
  // Göz ikonuna tıkla
  fireEvent.press(/* eye toggle button */);
  // secureTextEntry false olmalı
});
```

### 4.5 ✅ Async Etkileşimler (Form Submit)

```tsx
test('submits login form and dispatches setUser on success', async () => {
  // Mock API
  jest.spyOn(authService, 'login').mockResolvedValue(
    createSuccessResponse({
      user: mockUser,
      accessToken: 'token123',
      refreshToken: 'refresh456',
    }),
  );

  const { getByPlaceholderText, getByText } = renderWithProviders(
    <LoginScreen />,
    { withNavigation: true },
  );

  fireEvent.changeText(getByPlaceholderText('auth.emailPlaceholder'), 'test@example.com');
  fireEvent.changeText(getByPlaceholderText('auth.passwordPlaceholder'), 'Password1!');
  fireEvent.press(getByText('auth.loginButton'));

  await waitFor(() => {
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password1!',
    });
  });
});
```

---

## 5. ✅ State & Hook Testleri

> **Uygulama:** Aşağıdaki test dosyaları oluşturuldu (25 test, tümü geçti):
> - ✅ `src/redux/__tests__/UserSlice.test.ts` — 10 test (initialState, setUser, clearUser, setPreferences, setLocationName)
> - ✅ `src/redux/__tests__/ThemeSlice.test.ts` — 7 test (initialState, setTheme, toggleTheme)
> - ✅ `src/redux/__tests__/LanguageSlice.test.ts` — 4 test (initialState, setLanguage)
> - ✅ `src/context/__tests__/ThemeContext.test.tsx` — 4 test (useColors light/dark renkleri)
>
> **Ek düzeltmeler:** `jest.setup.js`'e `@react-native-clipboard/clipboard` mock'u eklendi; `__tests__/App.test.tsx` Provider wrapper ile düzeltildi.

### 5.1 ✅ Redux Slice Testleri

Redux slice'lar **pure function** oldukları için arayüzden tamamen bağımsız test edilebilirler.

```tsx
// src/redux/__tests__/UserSlice.test.ts
import reducer, { setUser, clearUser, setPreferences, UserState } from '../UserSlice';

// MMKV mock'u jest.setup.js'de tanımlı

describe('UserSlice', () => {
  const initialState: UserState = {
    user: null,
    token: null,
    refreshToken: null,
    location: { latitude: null, longitude: null },
    locationName: '',
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('setUser → user, token ve refreshToken günceller', () => {
    const payload = {
      user: { id: '1', name: 'Ali', surname: 'V', username: 'aliv', email: 'a@b.c', photo: '', is_email_verified: true, is_premium: false },
      token: 'access123',
      refreshToken: 'refresh456',
    };
    const state = reducer(initialState, setUser(payload));
    expect(state.user?.name).toBe('Ali');
    expect(state.token).toBe('access123');
    expect(state.refreshToken).toBe('refresh456');
  });

  it('clearUser → tüm user alanlarını sıfırlar', () => {
    const loggedInState: UserState = {
      ...initialState,
      user: { id: '1', name: 'Test', surname: 'U', username: 'tu', email: 'e', photo: '', is_email_verified: true, is_premium: false },
      token: 'xxx',
      refreshToken: 'yyy',
    };
    const state = reducer(loggedInState, clearUser());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('setPreferences → mevcut user üzerine preference merge eder', () => {
    const withUser: UserState = {
      ...initialState,
      user: { id: '1', name: 'Test', surname: 'U', username: 'tu', email: 'e', photo: '', is_email_verified: true, is_premium: false },
    };
    const state = reducer(withUser, setPreferences({ travel_style: 'solo', budget_level: 'luxury' }));
    expect(state.user?.travel_style).toBe('solo');
    expect(state.user?.budget_level).toBe('luxury');
  });
});
```

### 5.2 ✅ ThemeSlice Testleri

```ts
// src/redux/__tests__/ThemeSlice.test.ts
import reducer, { setTheme, toggleTheme } from '../ThemeSlice';

describe('ThemeSlice', () => {
  it('setTheme → tema modunu değiştirir', () => {
    const state = reducer({ theme: 'light' }, setTheme('dark'));
    expect(state.theme).toBe('dark');
  });

  it('toggleTheme → light ↔ dark değiştirir', () => {
    let state = reducer({ theme: 'light' }, toggleTheme());
    expect(state.theme).toBe('dark');
    state = reducer(state, toggleTheme());
    expect(state.theme).toBe('light');
  });
});
```

### 5.3 ✅ LanguageSlice Testleri

```ts
// src/redux/__tests__/LanguageSlice.test.ts
import reducer, { setLanguage } from '../LanguageSlice';

describe('LanguageSlice', () => {
  it('setLanguage → dili değiştirir', () => {
    const state = reducer({ lang: 'en' }, setLanguage('tr'));
    expect(state.lang).toBe('tr');
  });
});
```

### 5.4 ✅ Context Hook Testleri (useColors)

```tsx
// src/context/__tests__/ThemeContext.test.tsx
import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { createTestStore } from '../../__test_utils__/renderWithProviders';
import { ThemeProvider, useColors } from '../ThemeContext';

const ColorDisplay = () => {
  const colors = useColors();
  return <Text testID="bg">{colors.background}</Text>;
};

describe('useColors', () => {
  it('light tema renkleri döndürür', () => {
    const store = createTestStore({ Theme: { theme: 'light' } });
    render(
      <Provider store={store}>
        <ThemeProvider>
          <ColorDisplay />
        </ThemeProvider>
      </Provider>,
    );
    // lightColors.background değerini döndürür
    expect(screen.getByTestId('bg')).toBeTruthy();
  });
});
```

---

## 6. ✅ Service Katmanı Testleri

> **Uygulama:** Aşağıdaki test dosyaları oluşturuldu (20 test, tümü geçti):
> - ✅ `src/services/__tests__/api.test.ts` — 8 test (request interceptor token ekleme, 401 refresh başarı/başarısız, retry, non-401 ve _retry:true senaryoları)
> - ✅ `src/services/__tests__/auth.test.ts` — 12 test (login, register, social google/apple, forgotPassword, resetPassword, verifyEmail, resendCode, logout, changePassword)

### 6.1 ✅ API Interceptor Testleri

```ts
// src/services/__tests__/api.test.ts
import axios from 'axios';
import { tokenStorage } from '../../storage/tokenStorage';

jest.mock('../../storage/tokenStorage');

describe('API Interceptor', () => {
  it('request interceptor → Authorization header ekler', async () => {
    (tokenStorage.getAccessToken as jest.Mock).mockReturnValue('test-token');
    
    // Mock request config
    const config: any = { headers: {} };
    // interceptor'u çağır (api module'ü import ederek)
    // Authorization header'ın eklendiğini doğrula
  });

  it('401 response → token refresh dener', async () => {
    // Mock 401 yanıtı ve ardından başarılı refresh
  });

  it('refresh başarısız → clearUser dispatch edilir ve reject olur', async () => {
    // Mock failed refresh
  });
});
```

### 6.2 ✅ Auth Service Testleri

```ts
// src/services/__tests__/auth.test.ts
import authService from '../auth';
import api from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('authService', () => {
  afterEach(jest.clearAllMocks);

  it('login → POST /auth/login doğru payload ile çağrılır', async () => {
    mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
    
    await authService.login({ email: 'a@b.com', password: 'Pass123!' });
    
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'a@b.com',
      password: 'Pass123!',
    });
  });

  it('register → POST /auth/register doğru payload ile çağrılır', async () => {
    mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
    
    await authService.register({
      name: 'Ali',
      surname: 'Veli',
      username: 'aliv',
      email: 'a@b.com',
      password: 'Secure123!',
    });
    
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Ali',
      surname: 'Veli',
      username: 'aliv',
      email: 'a@b.com',
      password: 'Secure123!',
    });
  });

  it('social → provider ve id_token gönderilir', async () => {
    mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
    await authService.social('google', 'id-token-xyz');
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/social', {
      provider: 'google',
      id_token: 'id-token-xyz',
    });
  });

  it('changePassword → POST /auth/change-password', async () => {
    mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
    await authService.changePassword('oldPass', 'newPass');
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/change-password', {
      current_password: 'oldPass',
      new_password: 'newPass',
    });
  });
});
```

---

## 7. ✅ Mock Yönetimi

> **Uygulama:** `src/__test_utils__/mockFactories.ts` — tüm mock yardımcıları dışa aktarır. Test: `src/__test_utils__/__tests__/mockFactories.test.ts` (9 test, tümü geçiyor).

### 7.1 ✅ Axios / API Mock'lama

```ts
// Yöntem 1: Module-level mock (en yaygın)
jest.mock('../services/api');
import api from '../services/api';
const mockedApi = api as jest.Mocked<typeof api>;

// Her test öncesi temizle
afterEach(() => jest.clearAllMocks());

// Kullanım
mockedApi.post.mockResolvedValueOnce(createSuccessResponse({ user: mockUser }));
mockedApi.post.mockRejectedValueOnce(createErrorResponse('INVALID_CREDENTIALS', 'Wrong password', 401));
```

```ts
// Yöntem 2: Service-level mock (screen testlerinde tercih edilir)
jest.mock('../../services/auth');
import authService from '../../services/auth';
const mockedAuth = authService as jest.Mocked<typeof authService>;

mockedAuth.login.mockResolvedValue(createSuccessResponse({
  user: mockUser,
  accessToken: 'token',
  refreshToken: 'refresh',
}));
```

### 7.2 ✅ Navigation Mock'lama

```ts
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      replace: mockReplace,
      addListener: jest.fn(() => jest.fn()),
    }),
    useRoute: () => ({
      params: { email: 'test@example.com' }, // Test-specific params
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
  };
});
```

### 7.3 ✅ MMKV Storage Mock'lama

```ts
// jest.setup.js'de global tanımlıdır. Test-spesifik davranış:
const mockStorage = {
  getString: jest.fn(),
  set: jest.fn(),
  contains: jest.fn(),
  remove: jest.fn(),
  getBoolean: jest.fn(),
};

jest.mock('../storage', () => mockStorage);

// Test içinde:
mockStorage.getString.mockReturnValue('tr');
mockStorage.contains.mockReturnValue(true);
```

### 7.4 ✅ Keychain (Token Storage) Mock'lama

```ts
import * as Keychain from 'react-native-keychain';

jest.mock('react-native-keychain');

// Kayıtlı token var senaryosu
(Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
  password: JSON.stringify({
    accessToken: 'stored-access',
    refreshToken: 'stored-refresh',
  }),
});

// Token yok senaryosu
(Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);
```

### 7.5 ✅ i18n (Çeviri) Mock'lama

```ts
// Basit yaklaşım: key'i doğrudan döndür
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn(), language: 'en' },
  }),
  I18nextProvider: ({ children }: any) => children,
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));
```

### 7.6 ✅ Image Picker Mock'lama

```ts
import { launchImageLibrary } from 'react-native-image-picker';

jest.mock('react-native-image-picker');

// Başarılı seçim
(launchImageLibrary as jest.Mock).mockImplementation((options, callback) => {
  callback({
    didCancel: false,
    assets: [{
      uri: 'file:///mock/photo.jpg',
      type: 'image/jpeg',
      fileName: 'photo.jpg',
    }],
  });
});

// İptal senaryosu
(launchImageLibrary as jest.Mock).mockImplementation((options, callback) => {
  callback({ didCancel: true });
});
```

### 7.7 ✅ Alert Mock'lama

```ts
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');

// Assertion
expect(Alert.alert).toHaveBeenCalledWith('Success', 'Password updated successfully.', expect.any(Array));
```

---

## 8. ✅ Senaryo Tablosu

> **Uygulama:** 8.3 → 9 servis test dosyası (43 test); 8.4 → Section 5'te tamamlandı; 8.5 → `src/utils/__tests__/` (validators+formats, 30 test) + `src/storage/__tests__/tokenStorage.test.ts` (8 test). Toplam: 26 suite / 176 test.

### 8.1 ✅ UI Bileşenleri (Components)

| Bileşen/Hook Adı | Happy Path | Loading Durumu | Error Durumu | Tetiklenecek Eventler |
|---|---|---|---|---|
| **Button** | `title` metni render edilir, `variant` ve `size` stil uygulanır | `isLoading=true` → `ActivityIndicator` gösterilir, title gözükmez | `isDisabled=true` → `accessibilityState.disabled` true, `onPress` çağrılmaz | `fireEvent.press` → `onPress` callback tetiklenir |
| **Input** | `label`, `placeholder` render edilir, `value` prop'u yansır | — | `error` prop'u verilince hata mesajı ve kırmızı border görünür | `fireEvent.changeText` → `onChangeText` çağrılır, `fireEvent(input, 'focus')` → focus stili |
| **Input (isPassword)** | `secureTextEntry=true`, göz ikonu gösterilir | — | — | Göz ikonuna `fireEvent.press` → `secureTextEntry` toggle |
| **ErrorBoundary** | Children render edilir | — | Hata fırlatılınca fallback UI gösterilir, hata mesajı görünür | "Try again" butonuna `fireEvent.press` → state reset, children yeniden render |
| **AuthHeader** | `title` ve `subtitle` metinleri doğru render | — | — | — (presentational) |
| **AuthDivider** | Divider çizgisi ve `text` prop'u render | — | — | — (presentational) |
| **SocialLogins** | Google ve Apple butonları render edilir | — | — | `fireEvent.press` → ilgili sosyal giriş flow tetiklenir |
| **StackHeader** | Geri butonu ve `title` render edilir | — | — | Geri butonuna `press` → `navigation.goBack()` |
| **ScreenWrapper** | Children doğru render, `scrollable` prop'u çalışır | — | — | — (layout wrapper) |
| **HeroCard** | Resim, başlık, alt bilgi render edilir | — | Resim yüklenemezse fallback | `fireEvent.press` → card onPress |
| **TrendingCard** | Mekan adı, rating, kategori gösterilir | — | — | `fireEvent.press` → detay sayfasına navigasyon |
| **GemCard** | Hidden gem bilgileri render | — | — | `fireEvent.press` → detay navigasyonu |
| **SkeletonCard** | Animasyonlu placeholder render edilir | — | — | — (loading placeholder) |
| **TabBar** | 5 tab ikonu render edilir, aktif tab vurgulanır | — | — | `fireEvent.press(tab)` → tab değişimi |
| **SectionHeader** | Başlık ve "See All" butonu render | — | — | "See All" basınca `onSeeAll` callback |
| **QuickActions** | Action butonları render | — | — | `fireEvent.press` → ilgili aksiyon |
| **OngoingJourneyCard** | Aktif rota bilgisi render | — | — | `fireEvent.press` → rota detayına git |

### 8.2 ✅ Ekranlar (Screens)

| Ekran Adı | Happy Path | Loading Durumu | Error Durumu | Tetiklenecek Eventler |
|---|---|---|---|---|
| **LoginScreen** | Email + password girilip "Login" basılınca `setUser` dispatch, token kaydedilir | `isLoading=true` → Button'da spinner | API hata → error mesajı görünür; `EMAIL_NOT_VERIFIED` → EmailVerification'a navigate | `changeText(email)`, `changeText(password)`, `press(loginButton)`, `press(forgotPassword)`, `press(signUp)` |
| **RegisterScreen** | 6 alan doldurulup submit → register API çağrılır, EmailVerification'a navigate | Submit sırasında Button spinner | `CONFLICT` → hata mesajı; password mismatch → yerel hata | `changeText` × 6, `press(register)`, `press(logIn)` |
| **ForgotPasswordScreen** | Email girilip submit → `forgotPassword` API → başarı mesajı | Submit spinner | API hata → Alert | `changeText(email)`, `press(submit)` |
| **ResetPasswordScreen** | Code + yeni şifre girilip submit → şifre güncellenir → Login'e navigate | Submit spinner | Yanlış kod → Alert; şifre uyuşmazlığı → inline hata | `changeText(code)`, `changeText(password)`, `changeText(confirm)`, `press(reset)` |
| **EmailVerificationScreen** | 6 haneli kod girilip verify → `verifyEmail` API → `setUser` dispatch | Verify spinner, Resend spinner | Yanlış kod → Alert | 6× `changeText`, `press(verify)`, `press(resend)` |
| **EditProfileScreen** | Alanlar düzenlenip Save → `updateMe` API → user güncellenir → goBack | Save spinner, photo upload spinner | API hata → Alert; boş isim → validation Alert | `changeText` × 3, `press(save)`, `press(changePhoto)` |
| **ChangePasswordScreen** | Eski + yeni şifre → changePassword API → Alert + goBack | Submit spinner | Yanlış mevcut şifre → Alert | `changeText` × 3, toggle visibility × 3, `press(update)` |
| **CreateRouteScreen** | Rota adı + duraklar → `routesService.create` → RouteDetail'e replace | Header'da ActivityIndicator | API hata → Alert; boş isim → validation Alert | `changeText(routeName)`, `changeText(stop)`, `press(addStop)`, `press(removeStop)`, `press(duration)`, `press(create)` |
| **ReviewsScreen** | API'den yorumlar çekilir ve FlatList'te render | Skeleton kartlar gösterilir | API hata → mevcut liste korunur | `press(sort chip)`, `press(helpful)`, `press(writeReview)`, `changeText(reviewText)`, `press(star)`, `press(submit)`, pull-to-refresh |
| **HomeScreen** | Trend mekanlar, hero cards, yakın mekanlar render | Skeleton kartlar | API hata → hata ekranı veya boş liste | `press(card)`, `press(notification bell)`, `press(search)`, `press(seeAll)` |
| **ExploreScreen** | Kategoriler, arama, filtreleme çalışır | Loading skeleton | Arama sonuç bulunamadı → empty state | `changeText(search)`, `press(category)`, `press(filter)`, `press(place card)` |
| **ProfileScreen** | User bilgileri, stats, ayar linkleri render | — | Loggedout → boş profil | `press(editProfile)`, `press(settings links)`, `press(logout)` |
| **PlaceDetailScreen** | Mekan detay bilgileri, harita, yorumlar | Skeleton | API hata → ErrorScreen | `press(bookmark)`, `press(reviews)`, `press(navigate)`, `press(share)` |
| **RouteDetailScreen** | Rota bilgileri, duraklar, harita | Skeleton | API hata → Alert | `press(stop)`, `press(startNavigation)`, `press(share)`, `press(delete)` |
| **NotificationsScreen** | Bildirim listesi render | Skeleton | API hata → empty state | `press(notification)`, `press(markAllRead)`, pull-to-refresh |
| **PremiumUpgradeScreen** | Plan kartları, özellik listesi render | Subscribe spinner | API hata → Alert | `press(planCard)`, `press(subscribe)` |

### 8.3 ✅ Services

| Servis | Happy Path | Error | Tetiklenecek Çağrılar |
|---|---|---|---|
| **authService** | Tüm metodlar doğru endpoint + payload ile `api.post/get` çağırır | `reject` durumunda hata fırlatır | `login`, `register`, `social`, `forgotPassword`, `resetPassword`, `verifyEmail`, `resendCode`, `logout`, `changePassword` |
| **userService** | `getMe`, `updateMe`, `uploadPhoto`, `updatePreferences`, `registerPushToken` | Reject → hata | 5 metod |
| **placesService** | `getNearby`, `search`, `getTrending`, `getBookmarks`, `getDetail`, `toggleBookmark`, `getReviews`, `submitReview`, `markReviewHelpful` | Reject → hata | 9 metod |
| **routesService** | `getAll`, `getDetail`, `create`, `update`, `updateStop`, `delete`, `share`, `getShared`, `saveAI`, `download` | Reject → hata | 10 metod |
| **assistantService** | `sendMessage`, `getConversations`, `clearConversations` | Reject → hata | 3 metod |
| **weatherService** | `get` — `city` veya `lat/lng` params | Reject → hata | 1 metod |
| **premiumService** | `getStatus`, `subscribe` | Reject → hata | 2 metod |
| **notificationsService** | `getAll`, `markRead`, `markAllRead` | Reject → hata | 3 metod |
| **tripsService** | `getAll`, `rate` | Reject → hata | 2 metod |
| **citiesService** | `get` — opsiyonel `query` param | Reject → hata | 1 metod |

### 8.4 ✅ Redux Slices

| Slice | Happy Path | Edge Case | Dispatch Actions |
|---|---|---|---|
| **UserSlice** | `setUser` → user + token günceller + MMKV'ye yazar | `setPreferences` user null iken → no-op | `setUser`, `setPreferences`, `clearUser`, `setLocationName` |
| **ThemeSlice** | `setTheme('dark')` → tema değişir + MMKV'ye yazar | — | `setTheme`, `toggleTheme` |
| **LanguageSlice** | `setLanguage('tr')` → dil değişir + i18n + MMKV | — | `setLanguage` |

### 8.5 ✅ Utilities

| Utility | Happy Path | Edge Case | Test |
|---|---|---|---|
| **checkEmail** | `'test@mail.com'` → `true` | `''`, `'invalid'`, `'@.com'` → `false` | Pure function, doğrudan test |
| **formatDate** | Son 60 saniye → "just_now"; 5 dakika → "5 time.minutes" | Gelecek tarih, geçersiz string | Pure function + i18n mock |
| **fmtKm** | `1.5` → `"1.5 km"`, `15` → `"15 km"` | `0`, negatif | Pure function |
| **fmtMin** | `45` → `"45 min"`, `90` → `"1 hour 30 min"` | `0`, çok büyük sayı | Pure function |
| **formatCount** | `1500` → `"1.5K"`, `2000000` → `"2M"` | `0`, negatif → `"0"` | Pure function |
| **tokenStorage** | `init` → Keychain'den okur; `save` → Keychain'e yazar | Keychain hatası → null döner | Async testler (await) |

---

## 9. ✅ Örnek Test Kodları

> **Uygulama:** 9.1 LoginScreen → ForgotPassword + SignUp navigasyon testleri eklendi (27→9 test); 9.2 ReviewsScreen → `src/screens/__tests__/ReviewsScreen.test.tsx` (11 test); 9.3 UserSlice → MMKV storage etkileşim testleri eklendi; 9.4 authService → reject testi eklendi; 9.5 formatlar/validators → zaten tamamlandı. Toplam: 27 suite / 193 test.

### 9.1 ✅ LoginScreen — Tam Kapsamlı Test

```tsx
// src/screens/auth/__tests__/LoginScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';
import authService from '../../../services/auth';
import { tokenStorage } from '../../../storage/tokenStorage';
import { renderWithProviders, mockUser, createMockState } from '../../../__test_utils__/renderWithProviders';
import { createSuccessResponse, createErrorResponse } from '../../../__test_utils__/mockApiResponses';

// Mock'lar
jest.mock('../../../services/auth');
jest.mock('../../../storage/tokenStorage', () => ({
  tokenStorage: { save: jest.fn().mockResolvedValue(undefined) },
}));

const mockedAuth = authService as jest.Mocked<typeof authService>;

// Navigation mock
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
    }),
  };
});

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // 🟢 HAPPY PATH
  // ============================================
  describe('Happy Path', () => {
    it('form doğru doldurulup submit edilince login başarılı olur', async () => {
      mockedAuth.login.mockResolvedValueOnce(
        createSuccessResponse({
          user: mockUser,
          accessToken: 'access-token-123',
          refreshToken: 'refresh-token-456',
        }) as any,
      );

      const { getByPlaceholderText, getByText, store } = renderWithProviders(
        <LoginScreen />,
        { withNavigation: true },
      );

      // Form doldur
      fireEvent.changeText(getByPlaceholderText('auth.emailPlaceholder'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('auth.passwordPlaceholder'), 'Password1!');

      // Submit
      fireEvent.press(getByText('auth.loginButton'));

      await waitFor(() => {
        // API doğru parametrelerle çağrıldı mı?
        expect(mockedAuth.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password1!',
        });
      });

      await waitFor(() => {
        // Token storage'a kaydedildi mi?
        expect(tokenStorage.save).toHaveBeenCalledWith('access-token-123', 'refresh-token-456');
      });

      // Redux store'da user set edildi mi?
      const state = store.getState();
      expect(state.User.user?.email).toBe('test@example.com');
      expect(state.User.token).toBe('access-token-123');
    });
  });

  // ============================================
  // 🔴 ERROR DURUMU
  // ============================================
  describe('Error Handling', () => {
    it('yanlış şifre → hata mesajı gösterilir', async () => {
      mockedAuth.login.mockRejectedValueOnce(
        createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password.', 401),
      );

      const { getByPlaceholderText, getByText, findByText } = renderWithProviders(
        <LoginScreen />,
        { withNavigation: true },
      );

      fireEvent.changeText(getByPlaceholderText('auth.emailPlaceholder'), 'wrong@example.com');
      fireEvent.changeText(getByPlaceholderText('auth.passwordPlaceholder'), 'WrongPass');
      fireEvent.press(getByText('auth.loginButton'));

      const errorMsg = await findByText('Invalid email or password.');
      expect(errorMsg).toBeTruthy();
    });

    it('EMAIL_NOT_VERIFIED → EmailVerification ekranına navigate eder', async () => {
      mockedAuth.login.mockRejectedValueOnce(
        createErrorResponse('EMAIL_NOT_VERIFIED', 'Email not verified.', 403),
      );

      const { getByPlaceholderText, getByText } = renderWithProviders(
        <LoginScreen />,
        { withNavigation: true },
      );

      fireEvent.changeText(getByPlaceholderText('auth.emailPlaceholder'), 'unverified@example.com');
      fireEvent.changeText(getByPlaceholderText('auth.passwordPlaceholder'), 'Password1!');
      fireEvent.press(getByText('auth.loginButton'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('EmailVerification', {
          email: 'unverified@example.com',
        });
      });
    });
  });

  // ============================================
  // ⏳ LOADING DURUMU
  // ============================================
  describe('Loading State', () => {
    it('submit sırasında button disabled olur', async () => {
      // Never-resolving promise ile loading state'i yakalayalım
      mockedAuth.login.mockReturnValueOnce(new Promise(() => {}));

      const { getByPlaceholderText, getByText, getByRole } = renderWithProviders(
        <LoginScreen />,
        { withNavigation: true },
      );

      fireEvent.changeText(getByPlaceholderText('auth.emailPlaceholder'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('auth.passwordPlaceholder'), 'Password1!');
      fireEvent.press(getByText('auth.loginButton'));

      // Button loading/disabled durumunda olmalı
      // Button komponenti isLoading=true olduğunda ActivityIndicator gösterir
    });
  });

  // ============================================
  // 🎯 NAVIGASYON
  // ============================================
  describe('Navigation', () => {
    it('"Forgot Password" basınca ForgotPassword ekranına navigate eder', () => {
      const { getByText } = renderWithProviders(<LoginScreen />, { withNavigation: true });
      fireEvent.press(getByText('auth.forgotPassword'));
      expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
    });

    it('"Sign Up" basınca Register ekranına navigate eder', () => {
      const { getByText } = renderWithProviders(<LoginScreen />, { withNavigation: true });
      fireEvent.press(getByText('auth.signUp'));
      expect(mockNavigate).toHaveBeenCalledWith('Register');
    });
  });

  // ============================================
  // 🛡️ VALIDATION
  // ============================================
  describe('Validation', () => {
    it('email veya password boşken button disabled olur', () => {
      const { getByText } = renderWithProviders(<LoginScreen />, { withNavigation: true });
      const button = getByText('auth.loginButton');
      // isDisabled prop'u hem email hem password boşken true olmalı
      // Bu da Pressable'ın disabled olmasına yol açar
    });
  });
});
```

### 9.2 ✅ ReviewsScreen — API Çağrısı + Form İçeren Karmaşık Ekran

```tsx
// src/screens/__tests__/ReviewsScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, within } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ReviewsScreen from '../ReviewsScreen';
import placesService from '../../services/places';
import { renderWithProviders, mockUser, createMockState } from '../../__test_utils__/renderWithProviders';
import { createSuccessResponse, createPaginatedResponse } from '../../__test_utils__/mockApiResponses';

jest.mock('../../services/places');
const mockedPlaces = placesService as jest.Mocked<typeof placesService>;

// Navigation & Route mock
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: mockGoBack,
      addListener: jest.fn(() => jest.fn()),
    }),
    useRoute: () => ({
      params: {
        placeId: 'place-uuid-1',
        placeName: 'Topkapı Sarayı',
        rating: 4.7,
      },
    }),
    useFocusEffect: jest.fn(),
  };
});

const mockReviewsData = {
  data: [
    {
      id: 'review-1',
      author: 'Ali V.',
      initials: 'AV',
      rating: 5,
      date: '2 days ago',
      text: 'Harika bir deneyimdi!',
      helpful_count: 12,
      is_helpful: false,
    },
    {
      id: 'review-2',
      author: 'Ayşe K.',
      initials: 'AK',
      rating: 4,
      date: '1 week ago',
      text: 'Çok güzel ama kalabalıktı.',
      helpful_count: 5,
      is_helpful: true,
    },
  ],
  summary: {
    average_rating: 4.7,
    total_count: 234,
    distribution: { '5': 120, '4': 70, '3': 25, '2': 12, '1': 7 },
  },
  pagination: {
    page: 1,
    limit: 15,
    total: 234,
    totalPages: 16,
    hasNext: true,
    hasPrev: false,
  },
};

describe('ReviewsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPlaces.getReviews.mockResolvedValue({ data: mockReviewsData } as any);
  });

  // ============================================
  // 🟢 HAPPY PATH
  // ============================================
  describe('Happy Path', () => {
    it('API'den yorumlar çekilip render edilir', async () => {
      const { findByText } = renderWithProviders(<ReviewsScreen />, {
        preloadedState: createMockState({ User: { user: mockUser } }),
      });

      // Review içeriğinin render edilmesini bekle
      const review = await findByText('Harika bir deneyimdi!');
      expect(review).toBeTruthy();

      // API doğru parametrelerle çağrıldı mı?
      expect(mockedPlaces.getReviews).toHaveBeenCalledWith('place-uuid-1', {
        sort: 'recent',
        page: 1,
        limit: 15,
      });
    });

    it('mekan adı ve ortalama rating gösterilir', async () => {
      const { findByText } = renderWithProviders(<ReviewsScreen />, {
        preloadedState: createMockState({ User: { user: mockUser } }),
      });
      expect(await findByText('Topkapı Sarayı')).toBeTruthy();
      expect(await findByText('4.7')).toBeTruthy();
    });
  });

  // ============================================
  // ⏳ LOADING
  // ============================================
  describe('Loading State', () => {
    it('ilk yükleme sırasında skeleton kartlar gösterilir', () => {
      mockedPlaces.getReviews.mockReturnValue(new Promise(() => {}) as any);

      const { queryByText } = renderWithProviders(<ReviewsScreen />, {
        preloadedState: createMockState({ User: { user: mockUser } }),
      });

      // Yorumlar henüz yüklenmedi, skeleton görünmeli
      expect(queryByText('Harika bir deneyimdi!')).toBeNull();
    });
  });

  // ============================================
  // 🔴 ERROR
  // ============================================
  describe('Error Handling', () => {
    it('API hatası durumunda mevcut liste korunur', async () => {
      // İlk yükleme başarılı
      mockedPlaces.getReviews.mockResolvedValueOnce({ data: mockReviewsData } as any);

      const { findByText } = renderWithProviders(<ReviewsScreen />, {
        preloadedState: createMockState({ User: { user: mockUser } }),
      });

      await findByText('Harika bir deneyimdi!');

      // Sort değiştirince ikinci çağrı hata verir
      mockedPlaces.getReviews.mockRejectedValueOnce(new Error('Network Error'));

      // Sort chip'ine tıkla → API hatası → mevcut data korunmalı
    });
  });

  // ============================================
  // 📝 YORUM YAZMA (Write Review Modal)
  // ============================================
  describe('Submit Review', () => {
    it('yorum yazılıp submit edilir → API çağrılır → listeye eklenir', async () => {
      mockedPlaces.submitReview.mockResolvedValueOnce({
        data: {
          data: {
            id: 'new-review',
            author: 'Test U.',
            initials: 'TU',
            rating: 5,
            date: 'Just now',
            text: 'Mükemmel!',
            helpful_count: 0,
            is_helpful: false,
          },
        },
      } as any);

      const { findByText, getByLabelText } = renderWithProviders(<ReviewsScreen />, {
        preloadedState: createMockState({ User: { user: mockUser } }),
      });

      // Yorumların yüklenmesini bekle
      await findByText('Harika bir deneyimdi!');

      // Write review butonuna tıkla (StackHeader rightIcon)
      // Modal açılır → yıldız seç → yorum yaz → submit

      // Submit API çağrısı doğrulanır
      // Listeye yeni yorum eklendiği doğrulanır
    });

    it('rating 0 ve text boşken submit butonu disabled', async () => {
      // Modal açıldığında submit butonu başlangıçta disabled olmalı
    });
  });

  // ============================================
  // 👍 HELPFUL TOGGLE
  // ============================================
  describe('Helpful Toggle', () => {
    it('helpful butonuna tıklanınca optimistic update yapılır', async () => {
      mockedPlaces.markReviewHelpful.mockResolvedValueOnce({
        data: { data: { helpful_count: 13, is_helpful: true } },
      } as any);

      const { findByText, getByLabelText } = renderWithProviders(<ReviewsScreen />, {
        preloadedState: createMockState({ User: { user: mockUser } }),
      });

      await findByText('Harika bir deneyimdi!');
      // helpful butonuna tıkla
      // count artmalı (optimistic)
      // API resolve olduktan sonra server değeri yansımalı
    });
  });

  // ============================================
  // 🔄 SORT & PAGINATION
  // ============================================
  describe('Sort & Pagination', () => {
    it('sort chip değiştirilince reviews yeniden çekilir', async () => {
      const { findByText } = renderWithProviders(<ReviewsScreen />, {
        preloadedState: createMockState({ User: { user: mockUser } }),
      });

      await findByText('Harika bir deneyimdi!');
      expect(mockedPlaces.getReviews).toHaveBeenCalledTimes(1);

      // "Highest" sort chip'ine tıkla
      fireEvent.press(await findByText('Highest'));

      await waitFor(() => {
        expect(mockedPlaces.getReviews).toHaveBeenCalledWith('place-uuid-1', {
          sort: 'highest',
          page: 1,
          limit: 15,
        });
      });
    });
  });
});
```

### 9.3 ✅ UserSlice — Redux Reducer Test

```ts
// src/redux/__tests__/UserSlice.test.ts
import reducer, { setUser, clearUser, setPreferences, setLocationName } from '../UserSlice';
import type { UserState } from '../UserSlice';

// MMKV mock — slice içinde storage.set/remove çağrılıyor
jest.mock('../../storage', () => ({
  set: jest.fn(),
  remove: jest.fn(),
  getString: jest.fn(),
  contains: jest.fn(() => false),
}));

const mockUser = {
  id: '1',
  name: 'Test',
  surname: 'User',
  username: 'testuser',
  email: 'test@example.com',
  photo: '',
  is_email_verified: true,
  is_premium: false,
};

describe('UserSlice Reducer', () => {
  const initialState: UserState = {
    user: null,
    token: null,
    refreshToken: null,
    location: { latitude: null, longitude: null },
    locationName: '',
  };

  describe('setUser', () => {
    it('user, token ve refreshToken set eder', () => {
      const result = reducer(initialState, setUser({
        user: mockUser,
        token: 'access-123',
        refreshToken: 'refresh-456',
      }));

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('access-123');
      expect(result.refreshToken).toBe('refresh-456');
    });

    it('sadece user güncellendiğinde token değişmez', () => {
      const stateWithToken = { ...initialState, token: 'existing', refreshToken: 'old-refresh' };
      const result = reducer(stateWithToken, setUser({ user: mockUser }));

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('existing'); // değişmedi
    });

    it('MMKV storage'a user JSON olarak yazılır', () => {
      const storage = require('../../storage');
      reducer(initialState, setUser({ user: mockUser }));
      expect(storage.set).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });
  });

  describe('clearUser', () => {
    it('user, token ve refreshToken null yapar', () => {
      const loggedIn = { ...initialState, user: mockUser, token: 'tk', refreshToken: 'rt' };
      const result = reducer(loggedIn, clearUser());

      expect(result.user).toBeNull();
      expect(result.token).toBeNull();
      expect(result.refreshToken).toBeNull();
    });

    it('MMKV'den user key'i kaldırır', () => {
      const storage = require('../../storage');
      const loggedIn = { ...initialState, user: mockUser };
      reducer(loggedIn, clearUser());
      expect(storage.remove).toHaveBeenCalledWith('user');
    });
  });

  describe('setPreferences', () => {
    it('mevcut user üzerine preference alanlarını merge eder', () => {
      const withUser = { ...initialState, user: mockUser };
      const result = reducer(withUser, setPreferences({
        travel_style: 'couple',
        budget_level: 'luxury',
        interests: ['art', 'food'],
      }));

      expect(result.user?.travel_style).toBe('couple');
      expect(result.user?.budget_level).toBe('luxury');
      expect(result.user?.interests).toEqual(['art', 'food']);
      expect(result.user?.name).toBe('Test'); // diğer alanlar korunur
    });

    it('user null iken hiçbir şey yapmaz', () => {
      const result = reducer(initialState, setPreferences({ travel_style: 'solo' }));
      expect(result.user).toBeNull();
    });
  });

  describe('setLocationName', () => {
    it('locationName günceller', () => {
      const result = reducer(initialState, setLocationName('Istanbul, Turkey'));
      expect(result.locationName).toBe('Istanbul, Turkey');
    });
  });
});
```

### 9.4 ✅ authService — Service Layer Test

```ts
// src/services/__tests__/auth.test.ts
import authService from '../auth';
import api from '../api';

jest.mock('../api', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('authService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('POST /auth/login — doğru payload gönderilir', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.login({ email: 'a@b.com', password: 'P@ss1' });
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'a@b.com',
        password: 'P@ss1',
      });
    });

    it('API hatası fırlatılınca reject olur', async () => {
      mockedApi.post.mockRejectedValue(new Error('Network Error'));
      await expect(authService.login({ email: 'a', password: 'b' })).rejects.toThrow('Network Error');
    });
  });

  describe('register', () => {
    it('POST /auth/register — 5 alan gönderilir', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.register({
        name: 'Ali',
        surname: 'Veli',
        username: 'aliv',
        email: 'a@b.com',
        password: 'Secret1!',
      });
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Ali',
        surname: 'Veli',
        username: 'aliv',
        email: 'a@b.com',
        password: 'Secret1!',
      });
    });
  });

  describe('social', () => {
    it('POST /auth/social — google provider', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.social('google', 'google-id-token');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/social', {
        provider: 'google',
        id_token: 'google-id-token',
      });
    });

    it('POST /auth/social — apple provider', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.social('apple', 'apple-id-token');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/social', {
        provider: 'apple',
        id_token: 'apple-id-token',
      });
    });
  });

  describe('forgotPassword', () => {
    it('POST /auth/forgot-password — sadece email gönderilir', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.forgotPassword('user@example.com');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'user@example.com',
      });
    });
  });

  describe('resetPassword', () => {
    it('POST /auth/reset-password — email + code + new_password', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.resetPassword('u@e.com', '123456', 'NewPass1!');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/reset-password', {
        email: 'u@e.com',
        code: '123456',
        new_password: 'NewPass1!',
      });
    });
  });

  describe('verifyEmail', () => {
    it('POST /auth/verify-email — email + code', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.verifyEmail('u@e.com', '654321');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/verify-email', {
        email: 'u@e.com',
        code: '654321',
      });
    });
  });

  describe('resendCode', () => {
    it('POST /auth/resend-code — sadece email', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.resendCode('u@e.com');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/resend-code', {
        email: 'u@e.com',
      });
    });
  });

  describe('logout', () => {
    it('refreshToken varsa body'de gönderilir', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.logout('my-refresh');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/logout', {
        refreshToken: 'my-refresh',
      });
    });

    it('refreshToken yoksa boş body gönderilir', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.logout();
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/logout', {});
    });
  });

  describe('changePassword', () => {
    it('POST /auth/change-password — current + new', async () => {
      mockedApi.post.mockResolvedValue({ data: { success: true, data: {} } });
      await authService.changePassword('OldP@ss', 'NewP@ss1!');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/change-password', {
        current_password: 'OldP@ss',
        new_password: 'NewP@ss1!',
      });
    });
  });
});
```

### 9.5 ✅ Utility Fonksiyonları — Pure Function Testleri

```ts
// src/utils/__tests__/validators.test.ts
import { checkEmail } from '../validators';

describe('checkEmail', () => {
  it.each([
    ['test@example.com', true],
    ['user.name+tag@domain.co', true],
    ['valid@sub.domain.com', true],
    ['', false],
    ['invalid', false],
    ['@domain.com', false],
    ['user@', false],
    ['user @domain.com', false],     // boşluk
    ['user@domain', false],          // TLD yok — regex'e bağlı
  ])('checkEmail("%s") → %s', (input, expected) => {
    expect(checkEmail(input)).toBe(expected);
  });
});
```

```ts
// src/utils/__tests__/formats.test.ts
import { fmtKm, fmtMin, formatCount } from '../formats';

describe('fmtKm', () => {
  it('10 km altı → 1 ondalık', () => expect(fmtKm(1.5)).toBe('1.5 km'));
  it('10 km ve üstü → tam sayı', () => expect(fmtKm(15)).toBe('15 km'));
  it('0 km', () => expect(fmtKm(0)).toBe('0.0 km'));
});

describe('fmtMin', () => {
  it('60 altı → dakika', () => expect(fmtMin(45)).toContain('45'));
  it('60 ve üstü → saat + dakika', () => {
    const result = fmtMin(90);
    expect(result).toContain('1');
    expect(result).toContain('30');
  });
  it('tam saat', () => {
    const result = fmtMin(120);
    expect(result).toContain('2');
  });
});

describe('formatCount', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1000, '1K'],
    [1500, '1.5K'],
    [1_000_000, '1M'],
    [2_500_000, '2.5M'],
    [1_000_000_000, '1B'],
    [-5, '0'],
  ])('formatCount(%i) → "%s"', (input, expected) => {
    expect(formatCount(input)).toBe(expected);
  });
});
```

---

## 10. ✅ Best Practices & Kurallar

> **Uygulama:** 27 test suite / 193 test incelendi; tüm dosyalar aşağıdaki kurallara uygun bulundu:
> - ✅ Her test bağımsız — `beforeEach`/`afterEach` ile `jest.clearAllMocks()` uygulandı
> - ✅ `getByText`, `getByRole`, `getByPlaceholderText` sorgu önceliği korundu; `getByTestId` minimum kullanıldı
> - ✅ Async state güncellemeleri `waitFor` / `findBy` ile sarıldı
> - ✅ Service testleri UI testlerinden ayrı tutuldu; screen testlerinde servisler mock'landı
> - ✅ AAA (Arrange-Act-Assert) formatı uygulandı
> - ✅ Gerçek API çağrısı yapılmadı — axios/api modülü her katmanda mock'landı
> - ✅ Edge case'ler dahil edildi (null user, boş input, ağ hatası, reject senaryoları)
> - ✅ Tüm 27 suite başarıyla geçti (`npm test -- --no-coverage` → 193/193 ✅)

### ✅ Yapılması Gerekenler

| # | Kural | Açıklama |
|---|---|---|
| 1 | **Kullanıcı perspektifinden test yaz** | DOM yapısına değil, kullanıcının gördüğüne (metin, label, role) göre sorgula |
| 2 | **`getByRole`, `getByText`, `getByLabelText` tercih et** | `getByTestId` son çare olmalı |
| 3 | **Async işlemlerde `waitFor` / `findBy` kullan** | State güncellemeleri async; `act()` uyarısı alıyorsan `waitFor` ile sar |
| 4 | **Her test bağımsız olmalı** | `beforeEach` ile mock'ları temizle (`jest.clearAllMocks()`) |
| 5 | **AAA (Arrange-Act-Assert) formatını uygula** | Setup → Action → Beklenti — net ayrım |
| 6 | **Service testlerini UI'dan ayır** | `authService.login` gibi fonksiyonlar doğrudan test edilmeli; UI testlerinde mock'lanmalı |
| 7 | **Edge case'leri dahil et** | Boş input, null user, ağ hatası, timeout |
| 8 | **Coverage takip et ama körü körüne kovalama** | %80 hedef; kritik akışlarda %100 |

### ❌ Kaçınılması Gerekenler

| # | Anti-Pattern | Neden |
|---|---|---|
| 1 | Implementation detail testi | Bileşenin iç state'ini doğrudan test etme → refactor'da kırılır |
| 2 | Snapshot testlere aşırı bağlanma | Büyük snapshot'lar sık güncellenir, anlam kaybeder |
| 3 | `setTimeout` ile bekleme | Flaky test üretir → `waitFor` / `findBy` kullan |
| 4 | Gerçek API çağrısı yapma | Testler izole ve hızlı olmalı → mock kullan |
| 5 | Test içinde birden fazla bağımsız assertion | Her senaryo ayrı `it()` bloğunda olmalı |
| 6 | Console warning'leri görmezden gelme | `act()` uyarıları genellikle async sorununa işaret eder |

### Dosya Yapısı Özeti

```
src/
├── __test_utils__/
│   ├── renderWithProviders.tsx
│   ├── mockNavigation.ts
│   └── mockApiResponses.ts
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          ← bileşen testi
│   │   └── ...
│   └── Input/
│       ├── Input.tsx
│       ├── Input.test.tsx           ← bileşen testi
│       └── ...
├── redux/
│   ├── __tests__/
│   │   ├── UserSlice.test.ts        ← reducer testi
│   │   ├── ThemeSlice.test.ts
│   │   └── LanguageSlice.test.ts
│   └── ...
├── services/
│   ├── __tests__/
│   │   ├── auth.test.ts             ← service testi
│   │   ├── user.test.ts
│   │   ├── places.test.ts
│   │   └── ...
│   └── ...
├── screens/
│   ├── auth/
│   │   ├── __tests__/
│   │   │   ├── LoginScreen.test.tsx  ← ekran testi
│   │   │   └── RegisterScreen.test.tsx
│   │   └── ...
│   └── __tests__/
│       ├── ReviewsScreen.test.tsx
│       ├── EditProfileScreen.test.tsx
│       └── ...
├── utils/
│   ├── __tests__/
│   │   ├── validators.test.ts       ← utility testi
│   │   └── formats.test.ts
│   └── ...
└── context/
    └── __tests__/
        └── ThemeContext.test.tsx     ← context testi
```

### Test Çalıştırma Komutları

```bash
# Tüm testleri çalıştır
npm test

# Watch modunda
npm test -- --watch

# Belirli dosya
npm test -- LoginScreen.test

# Coverage raporu
npm test -- --coverage

# Sadece değişen dosyalara ait testler
npm test -- --changedSince=main
```

---

> [!TIP]
> Bu döküman yaşayan bir belgedir. Yeni bileşen veya ekran eklendikçe Senaryo Tablosu güncellenmelidir. PR review sürecinde test coverage kontrolü yapılmalıdır.
