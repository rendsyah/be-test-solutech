import { useState } from 'react';

import { ChevronDownIcon } from '@/components/icons';
import { SidebarIcon } from '@/components/layouts/admin';
import { Section } from '@/components/ui';
import { cn } from '@/libs/utils';

import type { MenusResponse } from '../types';

type MenusHierarchyProps = {
  data: MenusResponse[];
  selected: MenusResponse | null;
  onSelect: (menu: MenusResponse) => void;
};

type MenuItemProps = {
  menu: MenusResponse;
  level?: number;
  selected: MenusResponse | null;
  onSelect: (menu: MenusResponse) => void;
};

const MenuItem = ({ menu, selected, onSelect }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = !!menu.child?.length;
  const isSelected = selected?.id === menu.id;

  return (
    <div className="flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(menu)}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(menu)}
        className={cn(
          'w-full flex items-center gap-4 px-3 py-2.5 rounded-lg cursor-pointer',
          'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
          'transition-colors hover:text-primary',
          isSelected && 'bg-primary/10 text-primary',
        )}
      >
        {menu.level === 1 ? (
          <span className="size-5 shrink-0 flex items-center justify-center">
            <SidebarIcon name={menu.icon} />
          </span>
        ) : (
          <span className="size-5 shrink-0 flex items-center justify-center">
            <span
              className={cn(
                'size-1.5 rounded-full transition-all duration-200',
                isSelected ? 'bg-primary scale-125' : 'bg-gray-300',
              )}
            />
          </span>
        )}
        <span className="text-sm flex-1">{menu.name}</span>
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className="shrink-0 rounded-full"
          >
            <ChevronDownIcon
              className={cn('transition-transform duration-200 size-4', isOpen && 'rotate-180')}
            />
          </button>
        )}
      </div>
      {hasChildren && (
        <div
          className={cn(
            'overflow-hidden transition-all duration-200 ease-in-out',
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="flex flex-col">
            {menu.child.map((child) => (
              <MenuItem
                key={child.id}
                menu={child as MenusResponse}
                selected={selected}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const MenusHierarchy: React.FC<MenusHierarchyProps> = ({ data, selected, onSelect }) => {
  return (
    <Section title="Menu Hierarchy">
      <div className="flex flex-col space-y-1">
        {data.map((menu) => (
          <MenuItem key={menu.id} menu={menu} selected={selected} onSelect={onSelect} />
        ))}
      </div>
    </Section>
  );
};
