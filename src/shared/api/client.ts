import axios from 'axios';
import { API_BASE_URL } from '../../config';

// No default Content-Type here. Setting one instance-wide leaks into every
// request, and a hand-set `multipart/form-data` arrives at the server without
// a boundary, so PHP never populates $_POST/$_FILES. Axios applies
// `application/json` itself for plain-object bodies, so JSON calls are
// unaffected by leaving it off.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
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
  // Belt-and-braces: if anything upstream re-adds a Content-Type to a
  // multipart body, the boundary is lost and every field arrives empty
  // instead of erroring. Strip it and let the platform build the part.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers) delete config.headers['Content-Type'];
  }
  if (getToken) {
    const auth = await getToken();
    if (auth?.token) {
      if (auth.role === 'brand') {
        // Brand sessions are a CI session cookie. The `brand-session-*`
        // pseudo-token means login never returned a real cookie, so sending
        // nothing is better than sending a cookie the server cannot verify.
        if (!auth.token.startsWith('brand-session-')) {
          config.headers.Cookie = `ci_session=${auth.token}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const auth = getToken ? await getToken() : null;
      // Brand logins are a separate session; a 401 there must not wipe the
      // investor session.
      if (auth?.role !== 'brand' && onUnauthorized) {
        onUnauthorized();
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
