import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Keychain from 'react-native-keychain';
import {
  createMockStorage,
  setupKeychainWithTokens,
  setupKeychainEmpty,
  setupImagePickerSuccess,
  setupImagePickerCancel,
  setupAlertSpy,
} from '../mockFactories';

// ─── 7.3 MMKV ────────────────────────────────────────────────────────────────
describe('createMockStorage (7.3)', () => {
  it('varsayılan olarak contains false döndürür', () => {
    const storage = createMockStorage();
    expect(storage.contains()).toBe(false);
  });

  it('getString mock configure edilebilir', () => {
    const storage = createMockStorage();
    storage.getString.mockReturnValue('tr');
    expect(storage.getString('language')).toBe('tr');
  });

  it('set çağrısı kaydedilir', () => {
    const storage = createMockStorage();
    storage.set('key', 'value');
    expect(storage.set).toHaveBeenCalledWith('key', 'value');
  });
});

// ─── 7.4 Keychain ─────────────────────────────────────────────────────────────
describe('Keychain mock helpers (7.4)', () => {
  it('setupKeychainWithTokens token objesini JSON olarak döndürür', async () => {
    setupKeychainWithTokens('access-abc', 'refresh-xyz');
    const result = (await Keychain.getGenericPassword()) as any;
    const parsed = JSON.parse(result.password);
    expect(parsed.accessToken).toBe('access-abc');
    expect(parsed.refreshToken).toBe('refresh-xyz');
  });

  it('setupKeychainEmpty false döndürür', async () => {
    setupKeychainEmpty();
    const result = await Keychain.getGenericPassword();
    expect(result).toBe(false);
  });
});

// ─── 7.6 Image Picker ────────────────────────────────────────────────────────
describe('Image Picker mock helpers (7.6)', () => {
  afterEach(() => jest.clearAllMocks());

  it('setupImagePickerSuccess asset uri ile callback çağrılır', () => {
    setupImagePickerSuccess('file:///mock/avatar.png', 'image/png', 'avatar.png');
    const callback = jest.fn();
    (launchImageLibrary as jest.Mock)({}, callback);
    expect(callback).toHaveBeenCalledWith({
      didCancel: false,
      assets: [{ uri: 'file:///mock/avatar.png', type: 'image/png', fileName: 'avatar.png' }],
    });
  });

  it('setupImagePickerCancel didCancel:true ile callback çağrılır', () => {
    setupImagePickerCancel();
    const callback = jest.fn();
    (launchImageLibrary as jest.Mock)({}, callback);
    expect(callback).toHaveBeenCalledWith({ didCancel: true });
  });
});

// ─── 7.7 Alert ────────────────────────────────────────────────────────────────
describe('setupAlertSpy (7.7)', () => {
  afterEach(() => jest.restoreAllMocks());

  it('Alert.alert çağrısını yakalar', () => {
    const spy = setupAlertSpy();
    Alert.alert('Başlık', 'Mesaj', []);
    expect(spy).toHaveBeenCalledWith('Başlık', 'Mesaj', []);
  });

  it('Alert title ve message ile çağrıldığını doğrular', () => {
    setupAlertSpy();
    Alert.alert('Success', 'Password updated successfully.', [{ text: 'OK' }]);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Success',
      'Password updated successfully.',
      expect.any(Array),
    );
  });
});
