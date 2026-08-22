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
  const res = await apiClient.post<{ status: boolean; message: string; data: LoginResponse }>(
    '/auth/login',
    credentials,
  );
  const { token, user: rawUser } = res.data.data;
  const user = toUser(rawUser, role);
  await persistAuth(token, user);
  return { token, user };
}

export async function register(data: RegisterRequest, role: UserRole = 'investor'): Promise<AuthSession> {
  const res = await apiClient.post<{ status: boolean; message: string; data: LoginResponse }>(
    '/auth/register',
    data,
  );
  const { token, user: rawUser } = res.data.data;
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