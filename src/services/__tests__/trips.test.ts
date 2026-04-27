import tripsService from '../trips';
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

describe('tripsService', () => {
  describe('getAll', () => {
    it('GET /trips opsiyonel params ile çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await tripsService.getAll({ page: 1, limit: 10 });
      expect(mockedApi.get).toHaveBeenCalledWith('/trips', {
        params: { page: 1, limit: 10 },
      });
    });

    it('params verilmezse undefined params ile çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await tripsService.getAll();
      expect(mockedApi.get).toHaveBeenCalledWith('/trips', { params: undefined });
    });
  });

  describe('rate', () => {
    it('POST /trips/{id}/rating rating ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await tripsService.rate('trip-uuid-1', 4);
      expect(mockedApi.post).toHaveBeenCalledWith('/trips/trip-uuid-1/rating', { rating: 4 });
    });
  });
});
