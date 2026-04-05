import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n from '../i18n/i18n';
import storage from '../storage'; // mmkv
import * as RNLocalize from 'react-native-localize';

interface LanguageState {
  lang: 'en' | 'tr';
}

// sistem dili tespiti
const getSystemLang = (): 'en' | 'tr' => {
  const locales = RNLocalize.getLocales();
  if (Array.isArray(locales) && locales.length > 0) {
    const sysLang = locales[0].languageCode;
    if (sysLang === 'tr') return 'tr';
  }
  return 'en'; // default fallback
};

const initialState: LanguageState = {
  lang: (storage.getString('lang') as 'en' | 'tr') || getSystemLang(),
};

const LanguageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'tr'>) => {
      state.lang = action.payload;
      i18n.changeLanguage(action.payload); // i18next değiştir
      storage.set('lang', action.payload); // mmkv’ye kaydet
    },
  },
});

export const { setLanguage } = LanguageSlice.actions;
export default LanguageSlice.reducer;