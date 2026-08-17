import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '../api/types';
import * as authService from './authService';
import { setTokenProvider, setUnauthorizedHandler } from '../api/client';
import { BYPASS_AUTH } from '../../config';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  setTokenProvider(() => Promise.resolve(token));

  const handleUnauthorized = useCallback(() => {
    setUser(null);
    setToken(null);
    authService.clearAuth();
  }, []);

  setUnauthorizedHandler(handleUnauthorized);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await authService.getStoredToken();
        if (storedToken) {
          setToken(storedToken);
          const storedUser = await authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }
        } else if (BYPASS_AUTH) {
          const mockUser: User = {
            id: 0,
            name: 'Dev User',
            email: 'dev@franchisepk.com',
            contact: '',
            company: 'FranchisePk',
            image: '',
            city: '',
            date: '',
          };
          setToken('dev-bypass-token');
          setUser(mockUser);
        }
      } catch {
        await authService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string, role: UserRole = 'investor') => {
    const { token: newToken, user: newUser } = await authService.login({
      email,
      password,
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
      const { token: newToken, user: newUser } = await authService.register(data, role);
      setToken(newToken);
      setUser(newUser);
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login: handleLogin,
        register: handleRegister,
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
