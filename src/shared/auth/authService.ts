import type { User, LoginRequest, RegisterRequest, LoginResponse, UserRole } from '../api/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export async function getStoredToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

async function persistAuth(token: string, user: User) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuth() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}

function buildToken(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Local-only auth: the auth backend is not available, so a session is
// created client-side without making any network request.
export async function login(credentials: LoginRequest, role: UserRole = 'investor'): Promise<LoginResponse> {
  const user: User = {
    id: Date.now(),
    name: credentials.email.split('@')[0] || 'User',
    email: credentials.email,
    contact: '',
    company: '',
    image: '',
    city: '',
    date: new Date().toISOString(),
    role,
  };
  const token = buildToken();
  await persistAuth(token, user);
  return { token, user };
}

export async function register(data: RegisterRequest, role: UserRole = 'investor'): Promise<LoginResponse> {
  const user: User = {
    id: Date.now(),
    name:
      [data.f_name, data.l_name].filter(Boolean).join(' ').trim() ||
      data.email.split('@')[0] ||
      'User',
    email: data.email,
    contact: data.contact || '',
    company: data.company || '',
    image: data.image || '',
    city: data.city || '',
    date: new Date().toISOString(),
    role,
  };
  const token = buildToken();
  await persistAuth(token, user);
  return { token, user };
}

export async function logout() {
  await clearAuth();
}
