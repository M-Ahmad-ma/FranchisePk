import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, UserRole } from '../api/types';
import * as authService from './authService';
import { setTokenProvider, setUnauthorizedHandler } from '../api/client';
import { BYPASS_AUTH } from '../../config';

const USER_KEY = 'auth_user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  enterAsGuest: () => void;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (data: {
    f_name: string;
    l_name: string;
    email: string;
    password: string;
    contact: string;
    company: string;
    city?: string;
  }, role?: UserRole) => Promise<void>;
  mockLoginAsBrand: (email: string) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  setTokenProvider(() => Promise.resolve({ token, role: user?.role ?? null }));

  const handleUnauthorized = useCallback(() => {
    console.log('[AuthContext] handleUnauthorized called — clearing auth');
    setUser(null);
    setToken(null);
    authService.clearAuth();
  }, []);

  setUnauthorizedHandler(handleUnauthorized);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await authService.getStoredToken();
        console.log('[AuthContext][useEffect] storedToken:', storedToken ? storedToken.substring(0, 20) + '...' : null);
        if (storedToken !== null) {
          setToken(storedToken);
          const storedUser = await authService.getStoredUser();
          console.log('[AuthContext][useEffect] storedUser:', storedUser ? { name: storedUser.name, role: storedUser.role, email: storedUser.email } : null);
          if (storedUser) {
            setUser(storedUser);
          }
          // Brand tokens are issued by /userpanel/auth/login and are not
          // recognized by GET /auth/profile, so skip the refresh for brand users.
          if (storedUser?.role !== 'brand') {
            console.log('[AuthContext][useEffect] non-brand user, refreshing profile from API');
            try {
              const fresh = await authService.getProfile();
              console.log('[AuthContext][useEffect] profile refreshed:', fresh?.name);
              setUser(fresh);
            } catch (e: any) {
              console.log('[AuthContext][useEffect] getProfile FAILED:', e?.response?.status, e?.message);
              // keep stored user
            }
          } else {
            console.log('[AuthContext][useEffect] brand user, skipping getProfile');
          }
        } else if (BYPASS_AUTH) {
          console.log('[AuthContext][useEffect] no stored token, using BYPASS_AUTH');
          const mockUser: User = {
            id: 0,
            name: 'Dev User',
            email: 'dev@franchisepk.com',
            contact: '',
            company: 'Franchise Pakistan',
            image: '',
            city: '',
            date: '',
          };
          setToken('dev-bypass-token');
          setUser(mockUser);
        } else {
          console.log('[AuthContext][useEffect] no stored token, checking guest');
          const storedGuest = await authService.getStoredGuest();
          console.log('[AuthContext][useEffect] storedGuest:', storedGuest);
          if (storedGuest) {
            setIsGuest(true);
          }
        }
      } catch (e: any) {
        console.log('[AuthContext][useEffect] OUTER CATCH:', e?.message);
        await authService.clearAuth();
      } finally {
        setIsLoading(false);
        console.log('[AuthContext][useEffect] done, isLoading=false');
      }
    })();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string, role: UserRole = 'investor') => {
    const { token: newToken, user: newUser } = await authService.login({
      email,
      pass: password,
    }, role);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const handleRegister = useCallback(
    async (data: {
      f_name: string;
      l_name: string;
      email: string;
      password: string;
      contact: string;
      company: string;
      city?: string;
    }, role: UserRole = 'investor') => {
      console.log('[AuthContext][handleRegister] calling authService.register, role:', role);
      const { token: newToken, user: newUser } = await authService.register(data, role);
      console.log('[AuthContext][handleRegister] got token:', newToken ? 'yes' : 'no', 'user.role:', newUser?.role);
      setToken(newToken);
      setUser(newUser);
      console.log('[AuthContext][handleRegister] state updated');
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    setIsGuest(true);
    await authService.setStoredGuest(true);
  }, []);

  const handleMockLoginAsBrand = useCallback((email: string) => {
    const mockUser: User = {
      id: 0,
      name: email.split('@')[0] || 'Brand Owner',
      email,
      contact: '',
      company: 'My Brand',
      image: '',
      city: '',
      date: '',
      role: 'brand',
    };
    setToken('dev-mock-token');
    setUser(mockUser);
  }, []);

  const handleEnterAsGuest = useCallback(async () => {
    setIsGuest(true);
    await authService.setStoredGuest(true);
  }, []);

  const handleUpdateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isGuest,
        enterAsGuest: handleEnterAsGuest,
        login: handleLogin,
        register: handleRegister,
        mockLoginAsBrand: handleMockLoginAsBrand,
        updateUser: handleUpdateUser,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
