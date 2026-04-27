import assistantService from '../assistant';
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

describe('assistantService', () => {
  describe('sendMessage', () => {
    it('POST /assistant/chat mesaj payload ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await assistantService.sendMessage({ message: 'Merhaba', conversation_id: 'conv-1' });
      expect(mockedApi.post).toHaveBeenCalledWith('/assistant/chat', {
        message: 'Merhaba',
        conversation_id: 'conv-1',
      });
    });

    it('context ile birlikte gönderilebilir', async () => {
      mockedApi.post.mockResolvedValue(ok);
      const payload = {
        message: 'İstanbul rotası öner',
        context: { city: 'Istanbul', travel_style: 'cultural' },
      };
      await assistantService.sendMessage(payload);
      expect(mockedApi.post).toHaveBeenCalledWith('/assistant/chat', payload);
    });
  });

  describe('getConversations', () => {
    it('GET /assistant/conversations çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await assistantService.getConversations();
      expect(mockedApi.get).toHaveBeenCalledWith('/assistant/conversations');
    });
  });

  describe('clearConversations', () => {
    it('DELETE /assistant/conversations çağrılır', async () => {
      mockedApi.delete.mockResolvedValue(ok);
      await assistantService.clearConversations();
      expect(mockedApi.delete).toHaveBeenCalledWith('/assistant/conversations');
    });
  });
});
