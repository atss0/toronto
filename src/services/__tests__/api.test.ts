import api from '../api';
import axios from 'axios';
import { tokenStorage } from '../../storage/tokenStorage';
import store from '../../redux/store';
import { clearUser } from '../../redux/UserSlice';

jest.mock('../../storage/tokenStorage', () => ({
  tokenStorage: {
    getAccessToken: jest.fn(() => null),
    getRefreshToken: jest.fn(() => null),
    save: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    init: jest.fn(() => Promise.resolve({ accessToken: null, refreshToken: null })),
    hasTokens: jest.fn(() => false),
  },
}));

jest.mock('../../redux/store', () => ({
  __esModule: true,
  default: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({ User: { user: null, token: null } })),
    subscribe: jest.fn(),
  },
}));

// Helpers to grab interceptor handlers without making real HTTP calls
const getReqHandler = () =>
  (api.interceptors.request as any).handlers.find(Boolean)?.fulfilled;

const getResErrorHandler = () =>
  (api.interceptors.response as any).handlers.find(Boolean)?.rejected;

const make401Error = () => ({
  response: { status: 401 },
  config: { headers: {} as Record<string, string>, _retry: false, url: '/test' },
});

// ─────────────────────────────────────────────
// Request Interceptor
// ─────────────────────────────────────────────
describe('Request Interceptor', () => {
  beforeEach(() => jest.clearAllMocks());

  it('token varsa Authorization header ekler', () => {
    (tokenStorage.getAccessToken as jest.Mock).mockReturnValue('abc123');
    const result = getReqHandler()({ headers: {} });
    expect(result.headers.Authorization).toBe('Bearer abc123');
  });

  it('token yoksa Authorization header eklenmez', () => {
    (tokenStorage.getAccessToken as jest.Mock).mockReturnValue(null);
    const result = getReqHandler()({ headers: {} });
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('config nesnesini değiştirmeden döndürür', () => {
    (tokenStorage.getAccessToken as jest.Mock).mockReturnValue('tok');
    const config = { headers: { 'Content-Type': 'application/json' } as any };
    const result = getReqHandler()(config);
    expect(result.headers['Content-Type']).toBe('application/json');
  });
});

// ─────────────────────────────────────────────
// Response Interceptor — 401 / Refresh
// ─────────────────────────────────────────────
describe('Response Interceptor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Intercept the retry call so no real network request fires
    (api.defaults as any).adapter = jest.fn().mockResolvedValue({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (api.defaults as any).adapter;
  });

  it('401 → refresh endpoint çağrılır ve yeni tokenlar kaydedilir', async () => {
    (tokenStorage.getRefreshToken as jest.Mock).mockReturnValue('old-refresh');
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: { data: { accessToken: 'new-access', refreshToken: 'new-refresh' } },
    });

    await getResErrorHandler()(make401Error());

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      { refreshToken: 'old-refresh' },
    );
    expect(tokenStorage.save).toHaveBeenCalledWith('new-access', 'new-refresh');
  });

  it('401 → retry gerçekleşir ve config yeni token ile güncellenir', async () => {
    (tokenStorage.getRefreshToken as jest.Mock).mockReturnValue('old-refresh');
    // Ensure request interceptor does NOT overwrite the header we're about to verify
    (tokenStorage.getAccessToken as jest.Mock).mockReturnValue(null);
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: { data: { accessToken: 'fresh-token', refreshToken: 'fresh-refresh' } },
    });

    const error = make401Error();
    await getResErrorHandler()(error);

    // The retry happened
    expect((api.defaults as any).adapter).toHaveBeenCalled();
    // The handler set the new Authorization on the original config before retrying
    expect(error.config.headers.Authorization).toBe('Bearer fresh-token');
  });

  it('refresh başarısız → tokenStorage.clear ve clearUser dispatch edilir', async () => {
    (tokenStorage.getRefreshToken as jest.Mock).mockReturnValue('expired-refresh');
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Token expired'));

    await expect(getResErrorHandler()(make401Error())).rejects.toThrow('Token expired');

    expect(tokenStorage.clear).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(clearUser());
  });

  it('401 olmayan hata olduğu gibi reject edilir', async () => {
    const err = { response: { status: 500 }, config: {} };
    await expect(getResErrorHandler()(err)).rejects.toEqual(err);
    expect(tokenStorage.getRefreshToken).not.toHaveBeenCalled();
  });

  it('_retry:true olan 401 tekrar refresh denemez', async () => {
    const err = { response: { status: 401 }, config: { headers: {}, _retry: true } };
    await expect(getResErrorHandler()(err)).rejects.toEqual(err);
    expect(tokenStorage.getRefreshToken).not.toHaveBeenCalled();
  });
});
