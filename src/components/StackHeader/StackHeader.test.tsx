import React from 'react';
import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import renderWithProviders from '../../__test_utils__/renderWithProviders';
import StackHeader from './StackHeader';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useNavigation as jest.Mock).mockReturnValue({
    goBack: mockGoBack,
    navigate: mockNavigate,
  });
});

describe('StackHeader', () => {
  it('renders the title', () => {
    renderWithProviders(<StackHeader title="Profile" />);
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('calls navigation.goBack when back button pressed', () => {
    renderWithProviders(<StackHeader title="Profile" />);
    fireEvent.press(screen.getByLabelText('Go back'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('renders rightComponent when provided', () => {
    renderWithProviders(
      <StackHeader title="Edit" rightComponent={<Text>Save</Text>} />,
    );
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it('renders rightIcon button when rightIcon and onRightPress are provided', () => {
    const onRightPress = jest.fn();
    renderWithProviders(
      <StackHeader
        title="Settings"
        rightIcon="solar:settings-bold"
        onRightPress={onRightPress}
      />,
    );
    const btn = screen.getByLabelText('Settings action');
    fireEvent.press(btn);
    expect(onRightPress).toHaveBeenCalledTimes(1);
  });

  it('does not render right action area when no rightComponent or rightIcon given', () => {
    renderWithProviders(<StackHeader title="Home" />);
    expect(screen.queryByLabelText('Home action')).toBeNull();
  });
});
