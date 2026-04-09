import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage from '../storage';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
}

const initialState: ThemeState = {
  theme: (storage.getString('theme') as ThemeMode) ?? 'light',
};

const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      storage.set('theme', action.payload);
    },
    toggleTheme: state => {
      const next: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
      state.theme = next;
      storage.set('theme', next);
    },
  },
});

export const { setTheme, toggleTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;
