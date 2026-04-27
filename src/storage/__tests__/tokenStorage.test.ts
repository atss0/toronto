import * as Keychain from 'react-native-keychain';
import { tokenStorage } from '../tokenStorage';

// react-native-keychain is mocked globally in jest.setup.js
const mockedGetGenericPassword = Keychain.getGenericPassword as jest.Mock;
const mockedSetGenericPassword = Keychain.setGenericPassword as jest.Mock;
const mockedResetGenericPassword = Keychain.resetGenericPassword as jest.Mock;

beforeEach(async () => {
  jest.clearAllMocks();
  // Reset in-memory state between tests by clearing
  mockedGetGenericPassword.mockResolvedValue(false);
  await tokenStorage.clear();
});

describe('tokenStorage', () => {
  describe('init', () => {
    it('Keychain token varsa accessToken ve refreshToken set edilir', async () => {
      mockedGetGenericPassword.mockResolvedValueOnce({
        password: JSON.stringify({ accessToken: 'acc-123', refreshToken: 'ref-456' }),
      });

      const result = await tokenStorage.init();

      expect(result.accessToken).toBe('acc-123');
      expect(result.refreshToken).toBe('ref-456');
      expect(tokenStorage.getAccessToken()).toBe('acc-123');
      expect(tokenStorage.getRefreshToken()).toBe('ref-456');
    });

    it('Keychain boşsa null döndürür', async () => {
      mockedGetGenericPassword.mockResolvedValueOnce(false);

      const result = await tokenStorage.init();

      expect(result.accessToken).toBeNull();
      expect(result.refreshToken).toBeNull();
    });

    it('Keychain hata fırlatırsa null döndürür', async () => {
      mockedGetGenericPassword.mockRejectedValueOnce(new Error('Keychain error'));

      const result = await tokenStorage.init();

      expect(result.accessToken).toBeNull();
      expect(result.refreshToken).toBeNull();
    });
  });

  describe('save', () => {
    it('Keychain setGenericPassword çağrılır ve in-memory token güncellenir', async () => {
      await tokenStorage.save('new-access', 'new-refresh');

      expect(mockedSetGenericPassword).toHaveBeenCalledWith(
        'tokens',
        JSON.stringify({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
        expect.objectContaining({ service: expect.any(String) }),
      );
      expect(tokenStorage.getAccessToken()).toBe('new-access');
      expect(tokenStorage.getRefreshToken()).toBe('new-refresh');
    });
  });

  describe('clear', () => {
    it('Keychain resetGenericPassword çağrılır ve token null olur', async () => {
      await tokenStorage.save('acc', 'ref');
      await tokenStorage.clear();

      expect(mockedResetGenericPassword).toHaveBeenCalled();
      expect(tokenStorage.getAccessToken()).toBeNull();
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });
  });

  describe('hasTokens', () => {
    it('accessToken yokken false döndürür', () => {
      expect(tokenStorage.hasTokens()).toBe(false);
    });

    it('accessToken varken true döndürür', async () => {
      await tokenStorage.save('acc', 'ref');
      expect(tokenStorage.hasTokens()).toBe(true);
    });
  });
});
