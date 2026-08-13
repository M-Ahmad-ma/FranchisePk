import axios from 'axios';
import { API_BASE_URL } from '../../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

let getToken: (() => Promise<string | null>) | null = null;
let onUnauthorized: (() => void) | null = null;

export function setTokenProvider(fn: () => Promise<string | null>) {
  getToken = fn;
}

export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

apiClient.interceptors.request.use(async (config) => {
  if (getToken) {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
