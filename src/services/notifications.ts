import api from './api';

const notificationsService = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/notifications', { params }),
  markRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read`),
  markAllRead: () =>
    api.put('/notifications/read-all'),
};

export default notificationsService;
