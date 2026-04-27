import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Input from './Input';

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeTruthy();
  });

  it('renders label when provided', () => {
    render(<Input label="Email" placeholder="email" />);
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('does not render label when not provided', () => {
    render(<Input placeholder="email" />);
    expect(screen.queryByText('Email')).toBeNull();
  });

  it('renders error message when error prop given', () => {
    render(<Input placeholder="email" error="Required field" />);
    expect(screen.getByText('Required field')).toBeTruthy();
  });

  it('does not render error message without error prop', () => {
    render(<Input placeholder="email" />);
    expect(screen.queryByText('Required field')).toBeNull();
  });

  it('secureTextEntry is false by default (not a password field)', () => {
    render(<Input placeholder="text" value="hello" />);
    const input = screen.getByPlaceholderText('text');
    expect(input.props.secureTextEntry).toBeFalsy();
  });

  it('secureTextEntry is true initially for isPassword', () => {
    render(<Input placeholder="pwd" isPassword value="secret" />);
    const input = screen.getByPlaceholderText('pwd');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('toggles secureTextEntry when eye button pressed', () => {
    render(<Input placeholder="pwd" isPassword value="secret" />);
    expect(screen.getByPlaceholderText('pwd').props.secureTextEntry).toBe(true);

    // hitSlop={10} is unique to the eye-toggle Pressable in this component
    const toggleBtn = screen.UNSAFE_getByProps({ hitSlop: 10 });
    fireEvent.press(toggleBtn);

    expect(screen.getByPlaceholderText('pwd').props.secureTextEntry).toBe(false);
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    render(<Input placeholder="email" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText('email'), 'user@test.com');
    expect(onChangeText).toHaveBeenCalledWith('user@test.com');
  });

  it('is not editable when editable=false', () => {
    render(<Input placeholder="locked" editable={false} />);
    const input = screen.getByPlaceholderText('locked');
    expect(input.props.editable).toBe(false);
  });
});
