import premiumService from '../premium';
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

describe('premiumService', () => {
  describe('getStatus', () => {
    it('GET /premium/status çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await premiumService.getStatus();
      expect(mockedApi.get).toHaveBeenCalledWith('/premium/status');
    });
  });

  describe('subscribe', () => {
    it('POST /premium/subscribe aylık plan ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await premiumService.subscribe({ plan: 'monthly', provider: 'apple', receipt: 'receipt-abc' });
      expect(mockedApi.post).toHaveBeenCalledWith('/premium/subscribe', {
        plan: 'monthly',
        provider: 'apple',
        receipt: 'receipt-abc',
      });
    });

    it('POST /premium/subscribe yıllık plan ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await premiumService.subscribe({ plan: 'annual', provider: 'google' });
      expect(mockedApi.post).toHaveBeenCalledWith('/premium/subscribe', {
        plan: 'annual',
        provider: 'google',
      });
    });
  });
});
