import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import renderWithProviders from '../../__test_utils__/renderWithProviders';
import ErrorScreen from './ErrorScreen';

describe('ErrorScreen', () => {
  it('renders custom message when provided', () => {
    renderWithProviders(<ErrorScreen message="No internet connection" />);
    expect(screen.getByText('No internet connection')).toBeTruthy();
  });

  it('renders default message (i18n key) when no message prop', () => {
    renderWithProviders(<ErrorScreen />);
    // i18n mock returns key as-is → 'common.error'
    expect(screen.getByText('common.error')).toBeTruthy();
  });

  it('shows retry button when onRetry provided', () => {
    renderWithProviders(<ErrorScreen onRetry={jest.fn()} />);
    // i18n mock returns key → 'common.retry'
    expect(screen.getByText('common.retry')).toBeTruthy();
  });

  it('hides retry button when onRetry is not provided', () => {
    renderWithProviders(<ErrorScreen />);
    expect(screen.queryByText('common.retry')).toBeNull();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    renderWithProviders(<ErrorScreen onRetry={onRetry} />);
    fireEvent.press(screen.getByText('common.retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
