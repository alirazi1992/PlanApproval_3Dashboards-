import React, { useEffect, useState, createContext, useContext } from 'react';

export type UserRole = 'admin' | 'technician' | 'client';

export const roleHomePath: Record<UserRole, string> = {
  admin: '/dashboard',
  technician: '/dashboard/technician',
  client: '/dashboard/client'
};

export const getHomePathForRole = (role?: UserRole | null) => role ? roleHomePath[role] : roleHomePath.admin;

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const roleProfiles: Record<UserRole, { name: string; avatar: string; defaultEmail: string }> = {
  admin: {
    name: 'سارا احمدی',
    avatar: 'https://i.pravatar.cc/150?img=5',
    defaultEmail: 'admin@navalhub.ir'
  },
  technician: {
    name: 'مهدی رضوی',
    avatar: 'https://i.pravatar.cc/150?img=15',
    defaultEmail: 'tech@navalhub.ir'
  },
  client: {
    name: 'لیلا جعفری',
    avatar: 'https://i.pravatar.cc/150?img=32',
    defaultEmail: 'client@navalhub.ir'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    const storedRole = localStorage.getItem('authRole') as UserRole | null;
    const storedEmail = localStorage.getItem('authEmail');
    if (auth === 'true') {
      const role = storedRole ?? 'admin';
      if (!storedRole) {
        localStorage.setItem('authRole', role);
      }
      const profile = roleProfiles[role];
      setIsAuthenticated(true);
      setUser({
        name: profile.name,
        email: storedEmail ?? profile.defaultEmail,
        avatar: profile.avatar,
        role
      });
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    // Mock authentication delay
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem('auth', 'true');
    localStorage.setItem('authRole', role);
    localStorage.setItem('authEmail', email);

    const profile = roleProfiles[role];
    setIsAuthenticated(true);
    setUser({
      name: profile.name,
      email: email || profile.defaultEmail,
      avatar: profile.avatar,
      role
    });
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('authRole');
    localStorage.removeItem('authEmail');
    setIsAuthenticated(false);
    setUser(null);
  };

  return <AuthContext.Provider value={{
    isAuthenticated,
    user,
    login,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
