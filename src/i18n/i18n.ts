import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import tr from './locales/tr.json';

// Desteklenen dillerin kısa kodları
const SUPPORTED = ['en', 'tr'] as const;
type AppLang = (typeof SUPPORTED)[number];

// languageTag -> 'en' | 'tr' normalizasyonu
const normalize = (tag?: string): AppLang => {
  if (!tag) return 'en';
  const lower = tag.toLowerCase();      // ör: 'en-us' / 'tr-tr'
  if (lower.startsWith('tr')) return 'tr';
  return 'en';
};

// RNLocalize yeni API:
const best = RNLocalize.findBestLanguageTag
  ? RNLocalize.findBestLanguageTag(SUPPORTED as unknown as string[])
  : null;

// Eğer findBestLanguageTag yoksa (çok eski sürüm) getLocales fallback'i
const deviceTag =
  best?.languageTag ||
  RNLocalize.getLocales?.()[0]?.languageTag ||
  'en';

const initialLng = normalize(deviceTag);

i18n
  .use(initReactI18next)
  .init({
    lng: initialLng, // <- doğru
    fallbackLng: 'en',
    compatibilityJSON: 'v4', // 'v3' yerine 'v4'
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;