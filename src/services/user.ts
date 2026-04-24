import api from './api';

export interface UpdateMePayload {
  name?: string;
  surname?: string;
  email?: string;
}

export interface UpdatePreferencesPayload {
  travel_style?: string;
  budget_level?: string;
  interests?: string[];
  preferred_currency?: string;
  language?: string;
}

const userService = {
  getMe: () => api.get('/users/me'),

  updateMe: (payload: UpdateMePayload) => api.put('/users/me', payload),

  uploadPhoto: (uri: string, type: string, name: string) => {
    const form = new FormData();
    form.append('photo', { uri, type, name } as any);
    return api.put('/users/me/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updatePreferences: (payload: UpdatePreferencesPayload) =>
    api.put('/users/me/preferences', payload),

  registerPushToken: (push_token: string, platform: 'ios' | 'android') =>
    api.put('/users/me/push-token', { push_token, platform }),
};

export default userService;
