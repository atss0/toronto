import authService from '../auth';
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

describe('authService', () => {
  afterEach(() => jest.clearAllMocks());

  const ok = { data: { success: true, data: {} } };

  describe('login', () => {
    it('POST /auth/login doğru payload ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.login({ email: 'a@b.com', password: 'Pass123!' });
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'a@b.com',
        password: 'Pass123!',
      });
    });

    it('yanıtı olduğu gibi döndürür', async () => {
      mockedApi.post.mockResolvedValue(ok);
      const res = await authService.login({ email: 'a@b.com', password: 'p' });
      expect(res).toEqual(ok);
    });
  });

  describe('register', () => {
    it('POST /auth/register doğru payload ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.register({
        name: 'Ali',
        surname: 'Veli',
        username: 'aliv',
        email: 'a@b.com',
        password: 'Secure123!',
      });
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Ali',
        surname: 'Veli',
        username: 'aliv',
        email: 'a@b.com',
        password: 'Secure123!',
      });
    });
  });

  describe('social', () => {
    it('google provider ve id_token gönderilir', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.social('google', 'id-token-xyz');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/social', {
        provider: 'google',
        id_token: 'id-token-xyz',
      });
    });

    it('apple provider ile de çalışır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.social('apple', 'apple-token');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/social', {
        provider: 'apple',
        id_token: 'apple-token',
      });
    });
  });

  describe('forgotPassword', () => {
    it('POST /auth/forgot-password email ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.forgotPassword('test@example.com');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'test@example.com',
      });
    });
  });

  describe('resetPassword', () => {
    it('POST /auth/reset-password doğru payload ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.resetPassword('user@test.com', '123456', 'NewPass1!');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/reset-password', {
        email: 'user@test.com',
        code: '123456',
        new_password: 'NewPass1!',
      });
    });
  });

  describe('verifyEmail', () => {
    it('POST /auth/verify-email email ve code ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.verifyEmail('user@test.com', '654321');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/verify-email', {
        email: 'user@test.com',
        code: '654321',
      });
    });
  });

  describe('resendCode', () => {
    it('POST /auth/resend-code email ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.resendCode('user@test.com');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/resend-code', {
        email: 'user@test.com',
      });
    });
  });

  describe('logout', () => {
    it('refreshToken ile POST /auth/logout çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.logout('refresh-token-abc');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/logout', {
        refreshToken: 'refresh-token-abc',
      });
    });

    it('refreshToken verilmezse boş body ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.logout();
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/logout', {});
    });
  });

  describe('changePassword', () => {
    it('POST /auth/change-password doğru payload ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await authService.changePassword('oldPass', 'newPass');
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/change-password', {
        current_password: 'oldPass',
        new_password: 'newPass',
      });
    });
  });

  describe('Reject (9.4)', () => {
    it('API hatası fırlatılınca login reject olur', async () => {
      mockedApi.post.mockRejectedValue(new Error('Network Error'));
      await expect(authService.login({ email: 'a@b.com', password: 'p' })).rejects.toThrow('Network Error');
    });
  });
});
