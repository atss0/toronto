import api from './api';

export interface CreateRoutePayload {
  name: string;
  stops: string[];
  notes?: string;
}

const routesService = {
  getAll: () => api.get('/routes'),
  getDetail: (routeId: string) => api.get(`/routes/${routeId}`),
  create: (payload: CreateRoutePayload) => api.post('/routes', payload),
  update: (routeId: string, payload: Partial<CreateRoutePayload>) => api.put(`/routes/${routeId}`, payload),
  delete: (routeId: string) => api.delete(`/routes/${routeId}`),
  share: (routeId: string) => api.post(`/routes/${routeId}/share`),
  getSaved: () => api.get('/routes/saved'),
  getTripHistory: () => api.get('/routes/history'),
};

export default routesService;
