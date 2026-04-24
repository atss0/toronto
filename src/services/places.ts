import api from './api';

export interface NearbyParams {
  latitude: number;
  longitude: number;
  radius?: number;
  category?: string;
  limit?: number;
}

export interface SearchParams {
  query: string;
  category?: string;
  city?: string;
  min_rating?: number;
  prices?: string;
  distance?: string;
  latitude?: number;
  longitude?: number;
  page?: number;
  limit?: number;
}

export interface TrendingParams {
  city?: string;
  limit?: number;
}

export interface BookmarksParams {
  category?: string;
  page?: number;
  limit?: number;
}

const placesService = {
  getNearby: (params: NearbyParams) => api.get('/places/nearby', { params }),
  getTrending: (params?: TrendingParams) => api.get('/places/trending', { params }),
  search: (params: SearchParams) => api.get('/places/search', { params }),
  getBookmarks: (params?: BookmarksParams) => api.get('/places/bookmarks', { params }),
  getDetail: (placeId: string) => api.get(`/places/${placeId}`),
  toggleBookmark: (placeId: string) => api.post(`/places/${placeId}/bookmark`),
  getReviews: (placeId: string, params?: { sort?: string; page?: number; limit?: number }) =>
    api.get(`/places/${placeId}/reviews`, { params }),
  submitReview: (placeId: string, rating: number, text: string) =>
    api.post(`/places/${placeId}/reviews`, { rating, text }),
  markReviewHelpful: (reviewId: string) => api.post(`/reviews/${reviewId}/helpful`),
};

export default placesService;
