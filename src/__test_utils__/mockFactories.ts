import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Keychain from 'react-native-keychain';

// ─── 7.3 MMKV Storage ────────────────────────────────────────────────────────

export const createMockStorage = () => ({
  getString: jest.fn(),
  set: jest.fn(),
  contains: jest.fn(() => false),
  remove: jest.fn(),
  getBoolean: jest.fn(() => false),
  clearAll: jest.fn(),
});

// ─── 7.4 Keychain (Token Storage) ────────────────────────────────────────────

export const setupKeychainWithTokens = (
  accessToken = 'stored-access',
  refreshToken = 'stored-refresh',
) => {
  (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
    password: JSON.stringify({ accessToken, refreshToken }),
  });
};

export const setupKeychainEmpty = () => {
  (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);
};

// ─── 7.6 Image Picker ────────────────────────────────────────────────────────

export const setupImagePickerSuccess = (
  uri = 'file:///mock/photo.jpg',
  type = 'image/jpeg',
  fileName = 'photo.jpg',
) => {
  (launchImageLibrary as jest.Mock).mockImplementation((_options: any, callback: any) => {
    callback({ didCancel: false, assets: [{ uri, type, fileName }] });
  });
};

export const setupImagePickerCancel = () => {
  (launchImageLibrary as jest.Mock).mockImplementation((_options: any, callback: any) => {
    callback({ didCancel: true });
  });
};

// ─── 7.7 Alert ───────────────────────────────────────────────────────────────

export const setupAlertSpy = () => jest.spyOn(Alert, 'alert').mockImplementation(() => {});
