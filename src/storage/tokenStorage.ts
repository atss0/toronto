import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.toronto.auth.tokens';

let _accessToken: string | null = null;
let _refreshToken: string | null = null;

export const tokenStorage = {
  async init(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    try {
      const result = await Keychain.getGenericPassword({ service: SERVICE });
      if (result) {
        const parsed: { accessToken: string; refreshToken: string } = JSON.parse(result.password);
        _accessToken = parsed.accessToken ?? null;
        _refreshToken = parsed.refreshToken ?? null;
      }
    } catch {
      _accessToken = null;
      _refreshToken = null;
    }
    return { accessToken: _accessToken, refreshToken: _refreshToken };
  },

  async save(accessToken: string, refreshToken: string): Promise<void> {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
    await Keychain.setGenericPassword(
      'tokens',
      JSON.stringify({ accessToken, refreshToken }),
      {
        service: SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      },
    );
  },

  async clear(): Promise<void> {
    _accessToken = null;
    _refreshToken = null;
    await Keychain.resetGenericPassword({ service: SERVICE });
  },

  getAccessToken(): string | null {
    return _accessToken;
  },

  getRefreshToken(): string | null {
    return _refreshToken;
  },

  hasTokens(): boolean {
    return _accessToken !== null;
  },
};
