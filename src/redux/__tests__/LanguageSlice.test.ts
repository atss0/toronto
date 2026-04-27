import reducer, { setLanguage } from '../LanguageSlice';

describe('LanguageSlice', () => {
  it('initial state lang değeri "en" döndürür', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.lang).toBe('en');
  });

  describe('setLanguage', () => {
    it('en → tr değiştirir', () => {
      const state = reducer({ lang: 'en' }, setLanguage('tr'));
      expect(state.lang).toBe('tr');
    });

    it('tr → en değiştirir', () => {
      const state = reducer({ lang: 'tr' }, setLanguage('en'));
      expect(state.lang).toBe('en');
    });

    it('aynı dil tekrar set edilebilir', () => {
      const state = reducer({ lang: 'en' }, setLanguage('en'));
      expect(state.lang).toBe('en');
    });
  });
});
