import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { createTestStore } from '../../__test_utils__/renderWithProviders';
import { ThemeProvider, useColors } from '../ThemeContext';
import { lightColors, darkColors } from '../../styles/theme';

const ColorDisplay = () => {
  const colors = useColors();
  return (
    <>
      <Text testID="bg">{colors.background}</Text>
      <Text testID="primary">{colors.primary}</Text>
    </>
  );
};

const renderWithTheme = (theme: 'light' | 'dark') => {
  const store = createTestStore({ Theme: { theme } });
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <ColorDisplay />
      </ThemeProvider>
    </Provider>,
  );
};

describe('useColors', () => {
  it('light tema — doğru background rengini döndürür', () => {
    renderWithTheme('light');
    expect(screen.getByTestId('bg').props.children).toBe(lightColors.background);
  });

  it('light tema — doğru primary rengini döndürür', () => {
    renderWithTheme('light');
    expect(screen.getByTestId('primary').props.children).toBe(lightColors.primary);
  });

  it('dark tema — doğru background rengini döndürür', () => {
    renderWithTheme('dark');
    expect(screen.getByTestId('bg').props.children).toBe(darkColors.background);
  });

  it('dark tema — light background ile farklıdır', () => {
    renderWithTheme('dark');
    expect(screen.getByTestId('bg').props.children).not.toBe(lightColors.background);
  });
});
