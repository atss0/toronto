import api from './api';

export interface CreateRoutePayload {
  name: string;
  notes?: string;
  is_ai_generated?: boolean;
  scheduled_at?: string;
  stops?: Array<{ id?: string; name: string; description?: string; duration?: number; status?: string }>;
}

const routesService = {
  getAll: () => api.get('/routes'),
  getDetail: (routeId: string) => api.get(`/routes/${routeId}`),
  create: (payload: CreateRoutePayload) => api.post('/routes', payload),
  update: (routeId: string, payload: Partial<CreateRoutePayload> & { status?: string; total_duration?: number; total_distance?: number }) =>
    api.put(`/routes/${routeId}`, payload),
  updateStop: (routeId: string, stopId: string, status: 'upcoming' | 'active' | 'completed') =>
    api.put(`/routes/${routeId}/stops/${stopId}`, { status }),
  delete: (routeId: string) => api.delete(`/routes/${routeId}`),
  share: (routeId: string) => api.post(`/routes/${routeId}/share`),
  getShared: (shareToken: string) => api.get(`/routes/share/${shareToken}`),
  saveAI: (routeId: string) => api.post(`/routes/${routeId}/save`),
  download: (routeId: string) => api.post(`/routes/${routeId}/download`),
};

export default routesService;
