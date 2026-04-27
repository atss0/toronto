import userService from '../user';
import api from '../api';

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;
const ok = { data: { success: true, data: {} } };

afterEach(() => jest.clearAllMocks());

describe('userService', () => {
  describe('getMe', () => {
    it('GET /users/me çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await userService.getMe();
      expect(mockedApi.get).toHaveBeenCalledWith('/users/me');
    });
  });

  describe('updateMe', () => {
    it('PUT /users/me doğru payload ile çağrılır', async () => {
      mockedApi.put.mockResolvedValue(ok);
      await userService.updateMe({ name: 'Ali', surname: 'Veli' });
      expect(mockedApi.put).toHaveBeenCalledWith('/users/me', { name: 'Ali', surname: 'Veli' });
    });
  });

  describe('uploadPhoto', () => {
    it('PUT /users/me/photo multipart/form-data ile çağrılır', async () => {
      mockedApi.put.mockResolvedValue(ok);
      await userService.uploadPhoto('file:///photo.jpg', 'image/jpeg', 'photo.jpg');
      const [url, body, config] = (mockedApi.put as jest.Mock).mock.calls[0];
      expect(url).toBe('/users/me/photo');
      expect(body).toBeInstanceOf(FormData);
      expect(config.headers['Content-Type']).toBe('multipart/form-data');
    });
  });

  describe('updatePreferences', () => {
    it('PUT /users/me/preferences doğru payload ile çağrılır', async () => {
      mockedApi.put.mockResolvedValue(ok);
      await userService.updatePreferences({ language: 'tr', budget_level: 'mid' });
      expect(mockedApi.put).toHaveBeenCalledWith('/users/me/preferences', {
        language: 'tr',
        budget_level: 'mid',
      });
    });
  });

  describe('registerPushToken', () => {
    it('PUT /users/me/push-token platform ve token ile çağrılır', async () => {
      mockedApi.put.mockResolvedValue(ok);
      await userService.registerPushToken('fcm-token-xyz', 'android');
      expect(mockedApi.put).toHaveBeenCalledWith('/users/me/push-token', {
        push_token: 'fcm-token-xyz',
        platform: 'android',
      });
    });
  });
});
