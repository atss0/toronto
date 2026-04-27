import reducer, {
  setUser,
  clearUser,
  setPreferences,
  setLocationName,
  UserState,
} from '../UserSlice';

jest.mock('../../storage', () => ({
  set: jest.fn(),
  remove: jest.fn(),
  getString: jest.fn(),
  contains: jest.fn(() => false),
}));

const mockStorage = () => require('../../storage') as { set: jest.Mock; remove: jest.Mock };

describe('UserSlice', () => {
  const initialState: UserState = {
    user: null,
    token: null,
    refreshToken: null,
    location: { latitude: null, longitude: null },
    locationName: '',
  };

  const baseUser = {
    id: '1',
    name: 'Ali',
    surname: 'Veli',
    username: 'aliv',
    email: 'a@b.com',
    photo: '',
    is_email_verified: true,
    is_premium: false,
  };

  it('returns initial state on unknown action', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setUser', () => {
    it('user, token ve refreshToken günceller', () => {
      const state = reducer(
        initialState,
        setUser({ user: baseUser, token: 'access123', refreshToken: 'refresh456' }),
      );
      expect(state.user?.name).toBe('Ali');
      expect(state.token).toBe('access123');
      expect(state.refreshToken).toBe('refresh456');
    });

    it('token payload yoksa mevcut token korunur', () => {
      const withToken: UserState = { ...initialState, token: 'existing-token' };
      const state = reducer(withToken, setUser({ user: baseUser }));
      expect(state.token).toBe('existing-token');
    });

    it('refreshToken payload yoksa mevcut refreshToken korunur', () => {
      const withRefresh: UserState = { ...initialState, refreshToken: 'existing-refresh' };
      const state = reducer(withRefresh, setUser({ user: baseUser }));
      expect(state.refreshToken).toBe('existing-refresh');
    });
  });

  describe('clearUser', () => {
    it('user, token ve refreshToken sıfırlar', () => {
      const loggedIn: UserState = {
        ...initialState,
        user: baseUser,
        token: 'xxx',
        refreshToken: 'yyy',
      };
      const state = reducer(loggedIn, clearUser());
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });

  describe('setPreferences', () => {
    it('user varsa preference merge eder', () => {
      const withUser: UserState = { ...initialState, user: baseUser };
      const state = reducer(
        withUser,
        setPreferences({ travel_style: 'solo', budget_level: 'luxury' }),
      );
      expect(state.user?.travel_style).toBe('solo');
      expect(state.user?.budget_level).toBe('luxury');
      expect(state.user?.name).toBe('Ali');
    });

    it('mevcut user alanlarını silmez', () => {
      const withUser: UserState = { ...initialState, user: { ...baseUser, is_premium: true } };
      const state = reducer(withUser, setPreferences({ travel_style: 'family' }));
      expect(state.user?.is_premium).toBe(true);
    });

    it('user null iken state değişmez', () => {
      const state = reducer(initialState, setPreferences({ travel_style: 'solo' }));
      expect(state.user).toBeNull();
    });
  });

  describe('setLocationName', () => {
    it('locationName günceller', () => {
      const state = reducer(initialState, setLocationName('Toronto, Canada'));
      expect(state.locationName).toBe('Toronto, Canada');
    });

    it('boş string kabul eder', () => {
      const withLocation: UserState = { ...initialState, locationName: 'Istanbul' };
      const state = reducer(withLocation, setLocationName(''));
      expect(state.locationName).toBe('');
    });
  });
});

// ─── Storage Interaction (9.3) ────────────────────────────────────────────────
describe('UserSlice — MMKV Storage etkileşimleri', () => {
  const initialState: UserState = {
    user: null, token: null, refreshToken: null,
    location: { latitude: null, longitude: null }, locationName: '',
  };
  const baseUser = {
    id: '1', name: 'Test', surname: 'User', username: 'testuser',
    email: 'test@example.com', photo: '', is_email_verified: true, is_premium: false,
  };

  beforeEach(() => jest.clearAllMocks());

  it('setUser → storage.set user JSON ile çağrılır', () => {
    reducer(initialState, setUser({ user: baseUser }));
    expect(mockStorage().set).toHaveBeenCalledWith('user', JSON.stringify(baseUser));
  });

  it('setPreferences → güncellenmiş user JSON ile storage.set çağrılır', () => {
    const withUser: UserState = { ...initialState, user: baseUser };
    reducer(withUser, setPreferences({ travel_style: 'solo' }));
    expect(mockStorage().set).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ ...baseUser, travel_style: 'solo' }),
    );
  });

  it('clearUser → storage.remove("user") çağrılır', () => {
    const withUser: UserState = { ...initialState, user: baseUser };
    reducer(withUser, clearUser());
    expect(mockStorage().remove).toHaveBeenCalledWith('user');
  });
});
