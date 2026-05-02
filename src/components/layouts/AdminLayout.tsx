'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';

import { SidebarProvider, useSidebar } from '@/contexts';
import { useNetworkAlert } from '@/hooks';
import { cn } from '@/libs/utils';

import { Backdrop, CommandMenu, Navbar, Sidebar } from './admin';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const emptySubscribe = () => () => {};

const AdminLayoutInner: React.FC<AdminLayoutProps> = ({ children }) => {
  useNetworkAlert();
  const { isExpanded, isMobileOpen } = useSidebar();
  const [isCmdkOpen, setIsCmdkOpen] = useState(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const mainContentMargin = useMemo(() => {
    if (!mounted) return 'lg:ml-[260px] ml-0';
    if (isMobileOpen) return 'ml-0';
    return isExpanded ? 'lg:ml-[260px]' : 'lg:ml-0';
  }, [isExpanded, isMobileOpen, mounted]);

  return (
    <div className="min-h-dvh xl:flex" suppressHydrationWarning>
      <Sidebar />
      <Backdrop />
      <div className={cn('flex-1 transition-[margin] duration-300 ease-in-out', mainContentMargin)}>
        <Navbar onOpenCmdk={() => setIsCmdkOpen(true)} />
        <main className="p-4 md:p-6 mx-auto max-w-(--breakpoint-2xl)">{children}</main>
      </div>
      <CommandMenu isOpen={isCmdkOpen} onClose={() => setIsCmdkOpen(false)} />
    </div>
  );
};

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SidebarProvider>
  );
};
