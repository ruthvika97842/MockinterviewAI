import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Profile, ResumeData } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  resume: ResumeData | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data.profile);
      setResume(data.resume || null);
    } catch (err) {
      console.warn('Could not refresh profile:', err);
    }
  };

  useEffect(() => {
    async function initAuth() {
      try {
        const token = api.getToken();
        if (token) {
          const res = await api.getCurrentUser();
          setUser(res.user);
          await refreshProfile();
        } else {
          // Initialize demo session for immediate testability
          api.setToken('usr-demo-101');
          const res = await api.getCurrentUser();
          setUser(res.user);
          await refreshProfile();
        }
      } catch (err) {
        console.warn('Initial session check error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    api.setToken(res.token);
    setUser(res.user);
    await refreshProfile();
  };

  const register = async (fullName: string, email: string, password: string) => {
    const res = await api.register({ fullName, email, password });
    api.setToken(res.token);
    setUser(res.user);
    await refreshProfile();
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    api.removeToken();
    setUser(null);
    setProfile(null);
    setResume(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        resume,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
