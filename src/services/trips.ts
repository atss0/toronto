import api from './api';

const tripsService = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/trips', { params }),
  rate: (tripId: string, rating: number) =>
    api.post(`/trips/${tripId}/rating`, { rating }),
};

export default tripsService;
