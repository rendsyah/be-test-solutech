'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { Menus, User } from '@/types';

type ResourceContextType = {
  user: User;
  menus: Menus[];
  permissions: string[];
  hasPermission: (permission: string[]) => boolean;
  onUpdateUser: (data: Partial<User>) => void;
  onLogout: () => Promise<void>;
};

type ResourceProviderProps = {
  user: User;
  menus: Menus[];
  permissions: string[];
  children: React.ReactNode;
};

const ResourceContext = createContext<ResourceContextType | null>(null);

export const ResourceProvider: React.FC<ResourceProviderProps> = ({
  user: initialUser,
  menus,
  permissions,
  children,
}) => {
  const [user, setUser] = useState<User>(initialUser);

  const onUpdateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  const onLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const hasPermission = useMemo(
    () => (permission: string[]) => permission.some((p) => permissions.includes(p)),
    [permissions],
  );

  return (
    <ResourceContext.Provider
      value={{
        user,
        menus,
        permissions,
        hasPermission,
        onUpdateUser,
        onLogout,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = () => {
  const context = useContext(ResourceContext);
  if (!context) throw new Error('useResource must be used within ResourceProvider');
  return context;
};
