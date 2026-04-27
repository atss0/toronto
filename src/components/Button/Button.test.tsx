import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Button from './Button';

describe('Button', () => {
  it('renders the title', () => {
    render(<Button title="Save" onPress={jest.fn()} />);
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Login" onPress={onPress} />);
    fireEvent.press(screen.getByText('Login'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows ActivityIndicator and hides title when isLoading', () => {
    render(<Button title="Submit" onPress={jest.fn()} isLoading />);
    expect(screen.queryByText('Submit')).toBeNull();
  });

  it('is disabled when isDisabled is true', () => {
    const onPress = jest.fn();
    render(<Button title="Go" onPress={onPress} isDisabled />);
    const btn = screen.getByRole('button');
    expect(btn.props.accessibilityState.disabled).toBe(true);
  });

  it('is disabled when isLoading is true', () => {
    render(<Button title="Go" onPress={jest.fn()} isLoading />);
    const btn = screen.getByRole('button');
    expect(btn.props.accessibilityState.disabled).toBe(true);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Go" onPress={onPress} isDisabled />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders leftIcon when provided', () => {
    const Icon = () => <></>;
    const { UNSAFE_getByType } = render(
      <Button title="Go" onPress={jest.fn()} leftIcon={<Icon />} />,
    );
    expect(UNSAFE_getByType(Icon)).toBeTruthy();
  });

  it('renders rightIcon when provided', () => {
    const Icon = () => <></>;
    const { UNSAFE_getByType } = render(
      <Button title="Go" onPress={jest.fn()} rightIcon={<Icon />} />,
    );
    expect(UNSAFE_getByType(Icon)).toBeTruthy();
  });

  it('sets accessibilityState.busy when isLoading', () => {
    render(<Button title="Go" onPress={jest.fn()} isLoading />);
    const btn = screen.getByRole('button');
    expect(btn.props.accessibilityState.busy).toBe(true);
  });
});
