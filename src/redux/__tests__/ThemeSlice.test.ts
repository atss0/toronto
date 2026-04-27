import reducer, { setTheme, toggleTheme } from '../ThemeSlice';

describe('ThemeSlice', () => {
  it('returns light as initial theme', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.theme).toBe('light');
  });

  describe('setTheme', () => {
    it('light → dark değiştirir', () => {
      const state = reducer({ theme: 'light' }, setTheme('dark'));
      expect(state.theme).toBe('dark');
    });

    it('dark → light değiştirir', () => {
      const state = reducer({ theme: 'dark' }, setTheme('light'));
      expect(state.theme).toBe('light');
    });

    it('aynı tema tekrar set edilebilir', () => {
      const state = reducer({ theme: 'light' }, setTheme('light'));
      expect(state.theme).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('light → dark geçiş yapar', () => {
      const state = reducer({ theme: 'light' }, toggleTheme());
      expect(state.theme).toBe('dark');
    });

    it('dark → light geçiş yapar', () => {
      const state = reducer({ theme: 'dark' }, toggleTheme());
      expect(state.theme).toBe('light');
    });

    it('iki kez toggle → başlangıca döner', () => {
      let state = reducer({ theme: 'light' }, toggleTheme());
      state = reducer(state, toggleTheme());
      expect(state.theme).toBe('light');
    });
  });
});
