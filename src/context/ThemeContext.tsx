import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { lightColors, darkColors, AppColors } from '../styles/theme';

const ThemeContext = createContext<AppColors>(lightColors);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useSelector((s: RootState) => s.Theme.theme);
  const colors = theme === 'dark' ? darkColors : lightColors;
  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>;
};

export const useColors = (): AppColors => useContext(ThemeContext);
