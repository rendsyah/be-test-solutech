'use client';

import { useState, useEffect, useCallback } from 'react';
import { createContext, useContext } from 'react';

type SidebarContextType = {
  isExpanded: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  onToggleSubmenu: (item: string) => void;
  setActiveItem: (item: string | null) => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });

  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onToggleSidebar = useCallback(() => setIsExpanded((prev) => !prev), []);
  const onToggleMobileSidebar = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const onToggleSubmenu = useCallback((item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobile,
        isMobileOpen,
        activeItem,
        openSubmenu,
        onToggleSidebar,
        onToggleMobileSidebar,
        onToggleSubmenu,
        setActiveItem,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within SidebarProvider');
  return context;
};
