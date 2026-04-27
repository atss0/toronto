import routesService from '../routes';
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

describe('routesService', () => {
  describe('getAll', () => {
    it('GET /routes çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await routesService.getAll();
      expect(mockedApi.get).toHaveBeenCalledWith('/routes');
    });
  });

  describe('getDetail', () => {
    it('GET /routes/{id} çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await routesService.getDetail('route-uuid-1');
      expect(mockedApi.get).toHaveBeenCalledWith('/routes/route-uuid-1');
    });
  });

  describe('create', () => {
    it('POST /routes doğru payload ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await routesService.create({ name: 'Boğaz Turu', notes: 'Keyifli' });
      expect(mockedApi.post).toHaveBeenCalledWith('/routes', {
        name: 'Boğaz Turu',
        notes: 'Keyifli',
      });
    });
  });

  describe('update', () => {
    it('PUT /routes/{id} payload ile çağrılır', async () => {
      mockedApi.put.mockResolvedValue(ok);
      await routesService.update('route-uuid-1', { name: 'Yeni İsim', status: 'completed' });
      expect(mockedApi.put).toHaveBeenCalledWith('/routes/route-uuid-1', {
        name: 'Yeni İsim',
        status: 'completed',
      });
    });
  });

  describe('updateStop', () => {
    it('PUT /routes/{id}/stops/{stopId} status ile çağrılır', async () => {
      mockedApi.put.mockResolvedValue(ok);
      await routesService.updateStop('route-uuid-1', 'stop-uuid-1', 'active');
      expect(mockedApi.put).toHaveBeenCalledWith('/routes/route-uuid-1/stops/stop-uuid-1', {
        status: 'active',
      });
    });
  });

  describe('delete', () => {
    it('DELETE /routes/{id} çağrılır', async () => {
      mockedApi.delete.mockResolvedValue(ok);
      await routesService.delete('route-uuid-1');
      expect(mockedApi.delete).toHaveBeenCalledWith('/routes/route-uuid-1');
    });
  });

  describe('share', () => {
    it('POST /routes/{id}/share çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await routesService.share('route-uuid-1');
      expect(mockedApi.post).toHaveBeenCalledWith('/routes/route-uuid-1/share');
    });
  });

  describe('getShared', () => {
    it('GET /routes/share/{token} çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await routesService.getShared('share-token-abc');
      expect(mockedApi.get).toHaveBeenCalledWith('/routes/share/share-token-abc');
    });
  });

  describe('saveAI', () => {
    it('POST /routes/{id}/save çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await routesService.saveAI('route-uuid-1');
      expect(mockedApi.post).toHaveBeenCalledWith('/routes/route-uuid-1/save');
    });
  });

  describe('download', () => {
    it('POST /routes/{id}/download çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await routesService.download('route-uuid-1');
      expect(mockedApi.post).toHaveBeenCalledWith('/routes/route-uuid-1/download');
    });
  });
});
