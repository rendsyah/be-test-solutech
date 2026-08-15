import { Command } from 'cmdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { PlusIcon, SearchIcon } from '@/components/icons';
import { useResource } from '@/contexts';
import { useBodyScrollLock } from '@/hooks';
import { cn } from '@/libs/utils';
import type { Menus } from '@/types';

import { SidebarIcon } from './SidebarIcon';

type CommandMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FlattenedMenu = {
  id: string;
  name: string;
  path: string;
  icon?: string;
  parent?: string;
};

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose }) => {
  useBodyScrollLock(isOpen);

  const { menus } = useResource();
  const [search, setSearch] = useState('');

  const router = useRouter();

  const flattenedMenus = useMemo(() => {
    const result: FlattenedMenu[] = [];

    const traverse = (items: Menus[], parent?: string) => {
      items.forEach((item) => {
        if (item.path && item.path !== '#') {
          result.push({
            id: item.id,
            name: item.name,
            path: item.path,
            icon: item.icon,
            parent,
          });
        }
        if (item.child?.length > 0) {
          traverse(item.child, item.name);
        }
      });
    };

    traverse(menus);
    return result;
  }, [menus]);

  const accounts = useMemo(
    () => [
      {
        id: 'products',
        name: 'Products',
        path: '/products',
        icon: <PlusIcon className="size-5" />,
      },
    ],
    [],
  );

  const visibleMenus = search ? flattenedMenus : flattenedMenus.slice(0, 5);

  const onSelect = useCallback(
    (path: string) => {
      router.push(path);
      onClose();
    },
    [router, onClose],
  );

  const groupClass = cn(
    'px-2 py-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider',
  );
  const itemClass = cn(
    'flex items-center gap-3 px-3 py-2 capitalize rounded-lg cursor-pointer text-sm text-gray-600 tracking-normal',
    'aria-selected:bg-primary/10 aria-selected:text-primary transition-colors group',
  );
  const iconClass = cn(
    'size-8 flex items-center justify-center rounded-lg border border-slate-100 bg-gray-50',
    'group-aria-selected:border-slate-200 group-aria-selected:bg-white',
  );
  const badgeClass = cn('ml-auto text-[10px] text-gray-400 uppercase tracking-wider');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <Command
        className="relative card z-60 w-full max-w-xs sm:max-w-2xl overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      >
        <div className="flex items-center px-4 border-b border-slate-100">
          <SearchIcon className="size-5 text-gray-500" />
          <Command.Input
            autoFocus
            placeholder="Type a command or search..."
            className="w-full h-14 px-3 outline-none text-sm placeholder:text-gray-400"
            value={search}
            onValueChange={setSearch}
          />
          <kbd className="hidden sm:flex items-center text-[10px] text-gray-500 border border-slate-200 rounded px-1.5 py-0.5 font-sans">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-112.5 overflow-y-auto overscroll-contain custom-scrollbar p-2">
          <Command.Empty>
            <div className="flex flex-col items-center gap-4 py-12">
              <Image
                src="/images/state-search.svg"
                alt="Search"
                width={140}
                height={140}
                priority
              />
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm font-medium">No results found for &quot;{search}&quot;</p>
                <p className="text-xs text-gray-400">Try searching for something else.</p>
              </div>
            </div>
          </Command.Empty>

          {flattenedMenus.length > 0 && (
            <Command.Group heading="Navigation" className={groupClass}>
              <div className="mt-2">
                {visibleMenus.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.name}
                    onSelect={() => onSelect(item.path)}
                    className={itemClass}
                  >
                    <div className={iconClass}>
                      <SidebarIcon name={item.icon} />
                    </div>
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      {item.parent && <span className="text-xs text-gray-400">{item.parent}</span>}
                    </div>
                    <span className={badgeClass}>Menu</span>
                  </Command.Item>
                ))}
              </div>
            </Command.Group>
          )}

          <Command.Group heading="Quick" className={groupClass}>
            <div className="mt-2">
              {accounts.map((account) => (
                <Command.Item
                  key={account.id}
                  value={account.name}
                  onSelect={() => onSelect(account.path)}
                  className={itemClass}
                >
                  <div className={iconClass}>{account.icon}</div>
                  <span>{account.name}</span>
                  <span className={badgeClass}>Menu</span>
                </Command.Item>
              ))}
            </div>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
};
