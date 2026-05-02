import { useSidebar } from '@/contexts';

export const Backdrop: React.FC = () => {
  const { isMobileOpen, onToggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md lg:hidden z-40"
      onClick={onToggleMobileSidebar}
    />
  );
};
