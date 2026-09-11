import type { User, UserRole, LoginRequest, RegisterRequest, LoginResponse, ApiLoginUser } from '../api/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const GUEST_KEY = 'auth_guest';

export interface AuthSession {
  token: string;
  user: User;
}

export async function getStoredToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function getStoredGuest(): Promise<boolean> {
  return (await AsyncStorage.getItem(GUEST_KEY)) === 'true';
}

export async function setStoredGuest(isGuest: boolean) {
  if (isGuest) {
    await AsyncStorage.setItem(GUEST_KEY, 'true');
  } else {
    await AsyncStorage.removeItem(GUEST_KEY);
  }
}

async function persistAuth(token: string, user: User) {
  console.log('[AuthService][persistAuth] token:', token ? token.substring(0, 20) + '...' : token, 'user.role:', user?.role);
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuth() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
  await AsyncStorage.removeItem(GUEST_KEY);
}

function toUser(api: ApiLoginUser, role: UserRole): User {
  const fullName =
    api.name ||
    [api.firstname, api.lastname].filter(Boolean).join(' ').trim() ||
    api.email.split('@')[0] ||
    'User';
  return {
    id: api.id ?? api.user_id ?? 0,
    name: fullName,
    email: api.email,
    contact: api.contact ?? '',
    company: api.company ?? '',
    image: api.image ?? '',
    city: api.city ?? '',
    date: api.date ?? '',
    role,
  };
}

export async function login(credentials: LoginRequest, role: UserRole = 'investor'): Promise<AuthSession> {
  // Brand owners authenticate against the userpanel login (password field, not `pass`).
  const res =
    role === 'brand'
      ? await apiClient.post<{ status: boolean; message: string; data: LoginResponse }>(
          '/userpanel/auth/login',
          { email: credentials.email, password: credentials.pass },
        )
      : await apiClient.post<{ status: boolean; message: string; data: LoginResponse }>(
          '/auth/login',
          credentials,
        );
  const { token, user: rawUser } = res.data.data;
  const user = toUser(rawUser, role);
  await persistAuth(token, user);
  return { token, user };
}

export async function register(data: RegisterRequest, role: UserRole = 'investor'): Promise<AuthSession> {
  console.log('[AuthService][register] POST /auth/register, role:', role, 'email:', data.email);
  const res = await apiClient.post<{ status: boolean; message: string; data: LoginResponse }>(
    '/auth/register',
    data,
  );
  console.log('[AuthService][register] Response status:', res.status, 'data keys:', Object.keys(res.data.data ?? {}));
  const { token, user: rawUser } = res.data.data;
  console.log('[AuthService][register] rawUser:', JSON.stringify(rawUser));
  const user: User = {
    id: rawUser.id ?? 0,
    name: rawUser.name || [data.f_name, data.l_name].filter(Boolean).join(' ').trim() || 'User',
    email: rawUser.email || data.email,
    contact: rawUser.contact ?? data.contact ?? '',
    company: rawUser.company ?? data.company ?? '',
    image: data.image ?? '',
    city: data.city ?? '',
    date: '',
    role,
  };
  console.log('[AuthService][register] constructed user:', JSON.stringify(user));
  await persistAuth(token, user);
  return { token, user };
}

export async function getProfile(): Promise<User> {
  const res = await apiClient.get<{ status: boolean; message: string; data: ApiLoginUser }>(
    '/auth/profile',
  );
  const role = (await getStoredUser())?.role ?? 'investor';
  const user = toUser(res.data.data, role);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function logout() {
  try {
    await apiClient.post<{ status: boolean; message: string; data: boolean }>('/auth/logout');
  } catch {
    // best-effort: clear local session even if the remote call fails
  } finally {
    await clearAuth();
  }
}

/**
 * Map a login/register failure to a user-friendly message.
 * The API may return JSON ({ status, message }) or, on a 500, an HTML error page
 * with no useful message, so we fall back to status-based messages.
 */
export function getAuthErrorMessage(e: any, action: 'login' | 'register'): string {
  const status = e?.response?.status;
  const data = e?.response?.data;

  let message = '';
  if (data && typeof data === 'object' && typeof data.message === 'string') {
    message = data.message.trim();
  } else if (typeof data === 'string') {
    message = data.trim();
  }

  // Only surface a server message when it's genuinely readable (not an HTML page
  // or a generic "Internal Server Error").
  if (message && !/<\w+/.test(message) && !/internal server error/i.test(message)) {
    return message;
  }

  if (!e?.response) {
    return 'Unable to reach the server. Please check your internet connection and try again.';
  }

  switch (status) {
    case 409:
      return 'This email is already registered. Please log in instead.';
    case 400:
      return 'Please check your details and fill in all required fields.';
    case 401:
      return 'Invalid email or password. Please try again.';
    case 422:
      return 'Please check your details and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Something went wrong on our end. Please try again in a moment.';
    default:
      return action === 'login'
        ? 'Login failed. Please try again.'
        : 'Registration failed. Please try again.';
  }
}