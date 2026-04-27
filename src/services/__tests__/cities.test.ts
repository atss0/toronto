import citiesService from '../cities';
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

describe('citiesService', () => {
  describe('get', () => {
    it('GET /cities params olmadan çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await citiesService.get();
      expect(mockedApi.get).toHaveBeenCalledWith('/cities', { params: undefined });
    });

    it('GET /cities query parametresiyle çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await citiesService.get({ query: 'Istanbul' });
      expect(mockedApi.get).toHaveBeenCalledWith('/cities', { params: { query: 'Istanbul' } });
    });
  });
});
