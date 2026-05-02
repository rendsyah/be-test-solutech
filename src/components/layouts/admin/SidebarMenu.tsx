import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

import { ChevronDownIcon } from '@/components/icons';
import { useSidebar } from '@/contexts';
import { cn } from '@/libs/utils';
import type { Menus } from '@/types';

import { SidebarIcon } from './SidebarIcon';

type MenuButtonProps = {
  menu: Menus;
  activeLinkClass: string;
  isOpen: boolean;
  onToggle: () => void;
};

type MenuLinkProps = {
  menu: Menus;
  activeLinkClass: string;
  activeDotClass: string;
  onLinkClick?: () => void;
};

type MenuItemProps = {
  menu: Menus;
  openId: string | null;
  onSetOpenId: (id: string | null) => void;
  onLinkClick?: () => void;
};

const MenuButton: React.FC<MenuButtonProps> = ({ menu, activeLinkClass, isOpen, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn(
      'w-full flex items-center rounded-lg px-3 py-2.5',
      'transition-all duration-200 hover:text-primary hover:bg-primary/10',
      'focus-visible:ring-inset',
      activeLinkClass,
    )}
  >
    <div className="flex-1 flex items-center gap-4">
      <span className="size-5 shrink-0 flex items-center justify-center">
        <SidebarIcon name={menu.icon} />
      </span>
      <span className="text-sm">{menu.name}</span>
    </div>
    <ChevronDownIcon
      className={cn('transition-transform duration-200 size-4', isOpen && 'rotate-180')}
    />
  </button>
);

const MenuLink: React.FC<MenuLinkProps> = ({
  menu,
  activeLinkClass,
  activeDotClass,
  onLinkClick,
}) => (
  <Link
    href={menu.path}
    onClick={onLinkClick}
    className={cn(
      'w-full flex items-center gap-4 px-3 py-2.5 rounded-lg',
      'transition-all duration-200 hover:text-primary hover:bg-primary/10',
      'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
      activeLinkClass,
    )}
  >
    {menu.level === 1 ? (
      <span className="size-5 shrink-0 flex items-center justify-center">
        <SidebarIcon name={menu.icon} />
      </span>
    ) : (
      <span className="size-5 shrink-0 flex items-center justify-center">
        <span className={cn('size-1.5 rounded-full transition-all duration-200', activeDotClass)} />
      </span>
    )}
    <span className="text-sm">{menu.name}</span>
  </Link>
);

const MenuItem: React.FC<MenuItemProps> = ({ menu, openId, onSetOpenId, onLinkClick }) => {
  const pathname = usePathname();

  const hasChild = !!menu.child?.length;
  const isOpen = openId === menu.id;

  const isActive = useCallback(
    (path: string) => {
      if (!path || path === '#') return false;
      return pathname === path;
    },
    [pathname],
  );

  const isActiveChild = menu.child?.some((child) => isActive(child.path)) ?? false;
  const isDirectActive = isActive(menu.path);
  const isAnyActive = isDirectActive || isActiveChild;

  const onToggle = useCallback(() => {
    onSetOpenId(isOpen ? null : menu.id);
  }, [isOpen, menu.id, onSetOpenId]);

  const activeLinkClass = cn(
    isAnyActive
      ? menu.level === 1
        ? 'bg-primary/10 text-primary'
        : 'text-primary'
      : 'text-inherit',
  );

  const activeDotClass = isDirectActive ? 'bg-primary scale-125' : 'bg-gray-300';

  return (
    <li>
      <div className="flex items-center justify-between w-full">
        {hasChild ? (
          <MenuButton
            menu={menu}
            activeLinkClass={activeLinkClass}
            isOpen={isOpen}
            onToggle={onToggle}
          />
        ) : (
          <MenuLink
            menu={menu}
            activeLinkClass={activeLinkClass}
            activeDotClass={activeDotClass}
            onLinkClick={onLinkClick}
          />
        )}
      </div>

      {hasChild && (
        <div
          className={cn(
            'overflow-hidden transition-all duration-200 ease-in-out',
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="mt-1">
            <SidebarMenu
              menus={menu.child!}
              openId={openId}
              onSetOpenId={onSetOpenId}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      )}
    </li>
  );
};

type SidebarMenuProps = {
  menus: Menus[];
  level?: number;
  openId?: string | null;
  onSetOpenId?: (id: string | null) => void;
  onLinkClick?: () => void;
};

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  menus,
  openId: openIdProp,
  onSetOpenId: onSetOpenIdProp,
  onLinkClick,
}) => {
  const [openIdLocal, setOpenIdLocal] = useState<string | null>(null);
  const { isMobile, onToggleMobileSidebar } = useSidebar();

  const isRoot = openIdProp === undefined;
  const openId = isRoot ? openIdLocal : openIdProp;
  const onSetOpenId = isRoot ? setOpenIdLocal : onSetOpenIdProp!;

  return (
    <ul className="space-y-1 font-medium">
      {menus.map((menu) => (
        <MenuItem
          key={menu.id}
          menu={menu}
          openId={openId}
          onSetOpenId={onSetOpenId}
          onLinkClick={onLinkClick ?? (isMobile ? onToggleMobileSidebar : undefined)}
        />
      ))}
    </ul>
  );
};
