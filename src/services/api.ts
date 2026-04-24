import axios from 'axios';
import { tokenStorage } from '../storage/tokenStorage';
import store from '../redux/store';
import { clearUser } from '../redux/UserSlice';

const BASE_URL = 'http://10.220.230.134:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (v: any) => void; reject: (e: any) => void }[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject })).then(
          token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          },
        );
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = tokenStorage.getRefreshToken();
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const newAccessToken: string = data.data.accessToken;
        const newRefreshToken: string = data.data.refreshToken;
        await tokenStorage.save(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await tokenStorage.clear();
        store.dispatch(clearUser());
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  },
);

export default api;
