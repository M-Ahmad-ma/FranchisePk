import axios from 'axios';
import { API_BASE_URL } from '../../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 15000,
});

let getToken: (() => Promise<{ token: string | null; role: string | null } | null>) | null = null;
let onUnauthorized: (() => void) | null = null;

export function setTokenProvider(fn: () => Promise<{ token: string | null; role: string | null } | null>) {
  getToken = fn;
}

export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

apiClient.interceptors.request.use(async (config) => {
  console.log('[API][Request]', config.method?.toUpperCase(), config.baseURL + (config.url ?? ''));
  if (getToken) {
    const auth = await getToken();
    if (auth?.token) {
      if (auth.role === 'brand') {
        if (!auth.token.startsWith('brand-session-')) {
          config.headers.Cookie = `ci_session=${auth.token}`;
          console.log('[API][Request] Cookie header set');
        } else {
          console.log('[API][Request] Brand pseudo-token, no cookie sent');
        }
      } else {
        config.headers.Authorization = `Bearer ${auth.token}`;
        console.log('[API][Request] Bearer token set');
      }
    } else {
      console.log('[API][Request] No token available');
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('[API][Response]', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.log('[API][Error]', error.response?.status, error.config?.url, error.message);
    if (error.code) console.log('[API][Error] code:', error.code);
    if (error.cause) console.log('[API][Error] cause:', String(error.cause));
    if (!error.response) {
      console.log('[API][Error] No response received — network/SSL/DNS issue');
      console.log('[API][Error] Full error:', JSON.stringify(Object.keys(error)));
    }
    if (error.response) {
      console.log('[API][Error] Response data:', typeof error.response.data === 'string' ? error.response.data.substring(0, 200) : JSON.stringify(error.response.data).substring(0, 200));
    }
    if (error.response?.status === 401) {
      const auth = getToken ? await getToken() : null;
      if (auth?.role !== 'brand') {
        console.log('[API] 401 received on', error.config?.url, '— triggering onUnauthorized');
        if (onUnauthorized) onUnauthorized();
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
