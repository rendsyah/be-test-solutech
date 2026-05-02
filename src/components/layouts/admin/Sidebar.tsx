import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useSyncExternalStore } from 'react';

import { InfoCircleIcon, LogoutIcon } from '@/components/icons';
import { useResource } from '@/contexts';
import { useSidebar } from '@/contexts';
import { cn } from '@/libs/utils';

import { SidebarMenu } from './SidebarMenu';

const emptySubscribe = () => () => {};

export const Sidebar: React.FC = () => {
  const { menus, onLogout } = useResource();
  const { isExpanded, isMobileOpen } = useSidebar();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const sidebarClass = useMemo(() => {
    return cn(
      'fixed left-0 top-0 h-screen w-[260px]',
      'flex flex-col bg-white border-r border-slate-200 z-50',
      'pt-16 lg:pt-0 px-4',
      'transition-transform duration-300 ease-in-out',
      !mounted
        ? 'lg:translate-x-0 -translate-x-full'
        : cn(
            isExpanded ? 'lg:translate-x-0' : 'lg:-translate-x-full',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          ),
    );
  }, [mounted, isExpanded, isMobileOpen]);

  return (
    <aside className={sidebarClass} suppressHydrationWarning>
      <div className="flex justify-center items-center pt-10 pb-6 lg:py-8 shrink-0">
        <div className="flex items-center gap-4">
          <Image src="/images/logo.svg" alt="Logo" width={48} height={48} priority />
          <p className="text-xl font-semibold tracking-wider">NextJS</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <nav>
          <SidebarMenu menus={menus} />
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-200 py-4 font-medium shrink-0 flex flex-col gap-1">
        <Link
          href="/help"
          className={cn(
            'flex items-center gap-4 px-3 py-2.5 text-sm rounded-lg transition-colors group',
            'hover:text-primary hover:bg-primary/10',
            'outline-none focus-visible:ring-2 focus-visible:ring-primary ',
          )}
        >
          <InfoCircleIcon className="size-5 group-hover:text-primary" />
          <span>Help & Support</span>
        </Link>
        <button
          className={cn(
            'flex items-center gap-4 px-3 py-2.5 text-sm rounded-lg transition-colors group',
            'hover:text-primary hover:bg-primary/10',
            'outline-none focus-visible:ring-2 focus-visible:ring-primary ',
          )}
          onClick={onLogout}
        >
          <LogoutIcon className="size-5 group-hover:text-primary" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
