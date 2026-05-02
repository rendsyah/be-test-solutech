import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';

import { Input } from '@/components/forms';
import {
  Bars3CenterLeftIcon,
  Bars3Icon,
  BellIcon,
  EllipsisHorizontalIcon,
  SearchIcon,
  XMarkIcon,
} from '@/components/icons';
import { IconButton } from '@/components/ui';
import { useSidebar } from '@/contexts';
import { cn } from '@/libs/utils';

import { NavbarUser } from './NavbarUser';

type NavbarProps = {
  onOpenCmdk: () => void;
};

const emptySubscribe = () => () => {};

export const Navbar: React.FC<NavbarProps> = ({ onOpenCmdk }) => {
  // prettier-ignore
  const { isMobile, isMobileOpen, isExpanded, onToggleSidebar, onToggleMobileSidebar } = useSidebar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const onToggleMenu = useCallback(() => {
    if (isMobile) {
      onToggleMobileSidebar();
    } else {
      onToggleSidebar();
    }
  }, [isMobile, onToggleSidebar, onToggleMobileSidebar]);

  const onToggleAppMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const menuIcon = useMemo(() => {
    if (!mounted) return <Bars3Icon className="size-6" />;
    if (isMobileOpen) return <XMarkIcon className="size-6" />;
    if (isExpanded) return <Bars3CenterLeftIcon className="size-6" />;
    return <Bars3Icon className="size-6" />;
  }, [mounted, isMobileOpen, isExpanded]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenCmdk();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCmdk]);

  return (
    <header
      className={cn(
        'sticky top-0 w-full border-b border-slate-200 transition-all duration-300 ease-in-out z-50',
        isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white',
      )}
    >
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full lg:justify-normal gap-2 sm:gap-5.5 px-5 lg:px-0 py-5 lg:py-4">
          <IconButton onClick={onToggleMenu} aria-label="Toggle Sidebar">
            {menuIcon}
          </IconButton>
          <div className="flex-1 flex justify-center lg:flex-none lg:justify-start">
            <Input
              className="py-2.25 w-full max-w-sm cursor-pointer"
              placeholder="Search here..."
              onClick={onOpenCmdk}
              iconPosition="start"
              icon={<SearchIcon className="size-4" />}
              endIcon={
                <kbd className="flex items-center text-xs text-gray-500 border border-slate-200 rounded px-1.5 pt-1 pb-0.5 tracking-widest">
                  ⌘K
                </kbd>
              }
              readOnly
            />
          </div>
          <IconButton onClick={onToggleAppMenu} className="lg:hidden" aria-label="Toggle App Menu">
            <EllipsisHorizontalIcon className="size-6" />
          </IconButton>
        </div>
        <div
          className={cn(
            isMenuOpen ? 'flex' : 'hidden',
            'items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0',
          )}
        >
          <IconButton>
            <BellIcon className="size-6" />
          </IconButton>
          <NavbarUser />
        </div>
      </div>
    </header>
  );
};
