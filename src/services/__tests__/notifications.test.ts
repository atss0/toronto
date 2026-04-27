import notificationsService from '../notifications';
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

describe('notificationsService', () => {
  describe('getAll', () => {
    it('GET /notifications opsiyonel params ile çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await notificationsService.getAll({ page: 1, limit: 20 });
      expect(mockedApi.get).toHaveBeenCalledWith('/notifications', {
        params: { page: 1, limit: 20 },
      });
    });

    it('params verilmezse undefined params ile çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await notificationsService.getAll();
      expect(mockedApi.get).toHaveBeenCalledWith('/notifications', { params: undefined });
    });
  });

  describe('markRead', () => {
    it('PUT /notifications/{id}/read çağrılır', async () => {
      mockedApi.put.mockResolvedValue(ok);
      await notificationsService.markRead('notif-uuid-1');
      expect(mockedApi.put).toHaveBeenCalledWith('/notifications/notif-uuid-1/read');
    });
  });

  describe('markAllRead', () => {
    it('PUT /notifications/read-all çağrılır', async () => {
      mockedApi.put.mockResolvedValue(ok);
      await notificationsService.markAllRead();
      expect(mockedApi.put).toHaveBeenCalledWith('/notifications/read-all');
    });
  });
});
