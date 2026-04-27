import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './LoginScreen';
import authService from '../../services/auth';
import { tokenStorage } from '../../storage/tokenStorage';
import renderWithProviders, { mockUser } from '../../__test_utils__/renderWithProviders';
import {
  createSuccessResponse,
  createErrorResponse,
} from '../../__test_utils__/mockApiResponses';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../components/SocialLogins', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../storage/tokenStorage', () => ({
  tokenStorage: {
    save: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    init: jest.fn(() => Promise.resolve({ accessToken: null, refreshToken: null })),
    getAccessToken: jest.fn(() => null),
    getRefreshToken: jest.fn(() => null),
    hasTokens: jest.fn(() => false),
  },
}));

const mockNavigate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useNavigation as jest.Mock).mockReturnValue({
    navigate: mockNavigate,
    goBack: jest.fn(),
  });
});

// Fill both inputs and press the login button
const fillAndSubmit = (
  email = 'test@example.com',
  password = 'Password1!',
) => {
  fireEvent.changeText(
    screen.getByPlaceholderText('auth.emailPlaceholder'),
    email,
  );
  fireEvent.changeText(
    screen.getByPlaceholderText('auth.passwordPlaceholder'),
    password,
  );
  fireEvent.press(screen.getByText('auth.loginButton'));
};

describe('LoginScreen', () => {
  it('renders email and password inputs', () => {
    renderWithProviders(<LoginScreen />);
    expect(screen.getByPlaceholderText('auth.emailPlaceholder')).toBeTruthy();
    expect(screen.getByPlaceholderText('auth.passwordPlaceholder')).toBeTruthy();
  });

  it('login button is disabled when both fields are empty', () => {
    renderWithProviders(<LoginScreen />);
    // Only the login Button uses accessibilityRole="button" (SocialLogins is mocked null)
    const btn = screen.UNSAFE_getByProps({
      accessibilityRole: 'button',
      disabled: true,
    });
    expect(btn.props.accessibilityState?.disabled).toBe(true);
  });

  it('login button becomes enabled when both fields are filled', () => {
    renderWithProviders(<LoginScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('auth.emailPlaceholder'),
      'a@b.com',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('auth.passwordPlaceholder'),
      'pass',
    );
    const btn = screen.UNSAFE_getByProps({
      accessibilityRole: 'button',
      disabled: false,
    });
    expect(btn.props.accessibilityState?.disabled).toBe(false);
  });

  it('calls authService.login with correct credentials on submit', async () => {
    jest.spyOn(authService, 'login').mockResolvedValue(
      createSuccessResponse({
        user: mockUser,
        accessToken: 'token123',
        refreshToken: 'refresh456',
      }) as any,
    );

    renderWithProviders(<LoginScreen />);
    fillAndSubmit('test@example.com', 'Password1!');

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1!',
      });
    });
  });

  it('saves tokens and dispatches setUser on successful login', async () => {
    jest.spyOn(authService, 'login').mockResolvedValue(
      createSuccessResponse({
        user: mockUser,
        accessToken: 'token123',
        refreshToken: 'refresh456',
      }) as any,
    );

    const { store } = renderWithProviders(<LoginScreen />);
    fillAndSubmit();

    await waitFor(() => {
      expect(tokenStorage.save).toHaveBeenCalledWith('token123', 'refresh456');
      expect(store.getState().User.user?.email).toBe(mockUser.email);
    });
  });

  it('shows error message when login fails with a server error', async () => {
    jest.spyOn(authService, 'login').mockRejectedValue(
      createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password', 401),
    );

    renderWithProviders(<LoginScreen />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeTruthy();
    });
  });

  it('navigates to EmailVerification when EMAIL_NOT_VERIFIED error', async () => {
    jest.spyOn(authService, 'login').mockRejectedValue(
      createErrorResponse('EMAIL_NOT_VERIFIED', 'Email not verified', 403),
    );

    renderWithProviders(<LoginScreen />);
    fillAndSubmit('unverified@example.com', 'Password1!');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('EmailVerification', {
        email: 'unverified@example.com',
      });
    });
  });

  it('"Forgot Password" basınca ForgotPassword ekranına navigate eder', () => {
    renderWithProviders(<LoginScreen />);
    fireEvent.press(screen.getByText('auth.forgotPassword'));
    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('"Sign Up" basınca Register ekranına navigate eder', () => {
    renderWithProviders(<LoginScreen />);
    fireEvent.press(screen.getByText('auth.signUp'));
    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });
});
