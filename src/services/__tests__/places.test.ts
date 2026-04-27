import placesService from '../places';
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

describe('placesService', () => {
  describe('getNearby', () => {
    it('GET /places/nearby parametrelerle çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await placesService.getNearby({ latitude: 41.0, longitude: 28.9, radius: 500 });
      expect(mockedApi.get).toHaveBeenCalledWith('/places/nearby', {
        params: { latitude: 41.0, longitude: 28.9, radius: 500 },
      });
    });
  });

  describe('getTrending', () => {
    it('GET /places/trending opsiyonel params ile çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await placesService.getTrending({ city: 'Istanbul', limit: 10 });
      expect(mockedApi.get).toHaveBeenCalledWith('/places/trending', {
        params: { city: 'Istanbul', limit: 10 },
      });
    });

    it('params verilmezse params undefined olarak geçilir', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await placesService.getTrending();
      expect(mockedApi.get).toHaveBeenCalledWith('/places/trending', { params: undefined });
    });
  });

  describe('search', () => {
    it('GET /places/search query parametresiyle çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await placesService.search({ query: 'kafe', city: 'Istanbul' });
      expect(mockedApi.get).toHaveBeenCalledWith('/places/search', {
        params: { query: 'kafe', city: 'Istanbul' },
      });
    });
  });

  describe('getBookmarks', () => {
    it('GET /places/bookmarks opsiyonel params ile çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await placesService.getBookmarks({ page: 2, limit: 20 });
      expect(mockedApi.get).toHaveBeenCalledWith('/places/bookmarks', {
        params: { page: 2, limit: 20 },
      });
    });
  });

  describe('getDetail', () => {
    it('GET /places/{id} çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await placesService.getDetail('place-uuid-1');
      expect(mockedApi.get).toHaveBeenCalledWith('/places/place-uuid-1');
    });
  });

  describe('toggleBookmark', () => {
    it('POST /places/{id}/bookmark çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await placesService.toggleBookmark('place-uuid-1');
      expect(mockedApi.post).toHaveBeenCalledWith('/places/place-uuid-1/bookmark');
    });
  });

  describe('getReviews', () => {
    it('GET /places/{id}/reviews opsiyonel params ile çağrılır', async () => {
      mockedApi.get.mockResolvedValue(ok);
      await placesService.getReviews('place-uuid-1', { sort: 'recent', page: 1, limit: 15 });
      expect(mockedApi.get).toHaveBeenCalledWith('/places/place-uuid-1/reviews', {
        params: { sort: 'recent', page: 1, limit: 15 },
      });
    });
  });

  describe('submitReview', () => {
    it('POST /places/{id}/reviews rating ve text ile çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await placesService.submitReview('place-uuid-1', 5, 'Harika bir yer!');
      expect(mockedApi.post).toHaveBeenCalledWith('/places/place-uuid-1/reviews', {
        rating: 5,
        text: 'Harika bir yer!',
      });
    });
  });

  describe('markReviewHelpful', () => {
    it('POST /reviews/{id}/helpful çağrılır', async () => {
      mockedApi.post.mockResolvedValue(ok);
      await placesService.markReviewHelpful('review-uuid-1');
      expect(mockedApi.post).toHaveBeenCalledWith('/reviews/review-uuid-1/helpful');
    });
  });
});
