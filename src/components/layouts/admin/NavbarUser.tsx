import { useState } from 'react';

import { LockClosedIcon, UserIcon, LogoutIcon } from '@/components/icons';
import { Avatar, PopoverContent, PopoverItem, PopoverRoot, PopoverTrigger } from '@/components/ui';
import { useResource } from '@/contexts';

export const NavbarUser: React.FC = () => {
  const { user, onLogout } = useResource();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <PopoverRoot open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center rounded-lg">
          <span className="mr-4 rounded-full">
            <Avatar src={user.image || '/images/avatar.svg'} alt="Avatar" status="online" />
          </span>
          <div className="text-left">
            <span className="block text-sm">{user.name}</span>
            <span className="block text-xs text-gray-400">{user.email}</span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent matchTriggerWidth={false} className="w-65 bg-white/80 backdrop-blur-md mt-4">
        <div className="border-b border-slate-200 p-3">
          <span className="block text-md">{user.name}</span>
          <span className="mt-0.5 block text-xs text-gray-400">{user.email}</span>
        </div>
        <PopoverItem
          tag="a"
          href="/account"
          className="flex items-center gap-3 text-sm"
          onClick={handleClose}
        >
          <UserIcon className="size-5" />
          Account Setting
        </PopoverItem>
        <PopoverItem
          tag="a"
          href="/change-password"
          className="flex items-center gap-3 text-sm"
          onClick={handleClose}
        >
          <LockClosedIcon className="size-5" />
          Change Password
        </PopoverItem>
        <PopoverItem className="flex items-center gap-3 text-sm" onClick={onLogout}>
          <LogoutIcon className="size-5" />
          Sign Out
        </PopoverItem>
      </PopoverContent>
    </PopoverRoot>
  );
};
