import weatherService from '../weather';
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

describe('weatherService', () => {
  describe('get', () => {
    it('city parametresi ile GET /weather çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await weatherService.get({ city: 'Istanbul' });
      expect(mockedApi.get).toHaveBeenCalledWith('/weather', {
        params: { city: 'Istanbul' },
      });
    });

    it('lat/lng parametreleriyle GET /weather çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await weatherService.get({ latitude: 41.01, longitude: 28.97 });
      expect(mockedApi.get).toHaveBeenCalledWith('/weather', {
        params: { latitude: 41.01, longitude: 28.97 },
      });
    });
  });
});
