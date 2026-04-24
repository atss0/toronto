import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}

const authService = {
  login: (payload: LoginPayload) => api.post('/auth/login', payload),
  register: (payload: RegisterPayload) => api.post('/auth/register', payload),
  social: (provider: 'google' | 'apple', id_token: string) =>
    api.post('/auth/social', { provider, id_token }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (email: string, code: string, new_password: string) =>
    api.post('/auth/reset-password', { email, code, new_password }),
  verifyEmail: (email: string, code: string) =>
    api.post('/auth/verify-email', { email, code }),
  resendCode: (email: string) => api.post('/auth/resend-code', { email }),
  logout: (refreshToken?: string) =>
    api.post('/auth/logout', refreshToken ? { refreshToken } : {}),
  changePassword: (current_password: string, new_password: string) =>
    api.post('/auth/change-password', { current_password, new_password }),
};

export default authService;
