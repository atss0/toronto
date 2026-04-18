import api from './api';

export interface NearbyParams {
  latitude: number;
  longitude: number;
  radius?: number;
  category?: string;
}

export interface SearchParams {
  query: string;
  category?: string;
  distance?: string;
  minRating?: number;
  prices?: string[];
  page?: number;
}

const placesService = {
  getNearby: (params: NearbyParams) => api.get('/places/nearby', { params }),
  search: (params: SearchParams) => api.get('/places/search', { params }),
  getDetail: (placeId: string) => api.get(`/places/${placeId}`),
  getTrending: () => api.get('/places/trending'),
  getReviews: (placeId: string) => api.get(`/places/${placeId}/reviews`),
  submitReview: (placeId: string, rating: number, comment: string) =>
    api.post(`/places/${placeId}/reviews`, { rating, comment }),
  toggleBookmark: (placeId: string) => api.post(`/places/${placeId}/bookmark`),
  getBookmarks: () => api.get('/places/bookmarks'),
};

export default placesService;
