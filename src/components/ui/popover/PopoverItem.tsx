import Link from 'next/link';

import { cn } from '@/libs/utils';

type PopoverItemProps = {
  tag?: 'a' | 'button';
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export const PopoverItem: React.FC<PopoverItemProps> = ({
  tag = 'button',
  href,
  onClick,
  className,
  children,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (tag === 'button') e.preventDefault();
    onClick?.();
  };

  const baseClasses = cn(
    'block w-full text-left px-3 py-2 text-sm rounded-2xl hover:text-primary transition-colors',
    'outline-none focus-visible:ring-2 focus-visible:ring-primary',
    className,
  );

  if (tag === 'a' && href) {
    return (
      <Link href={href} className={baseClasses} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={baseClasses} onClick={handleClick}>
      {children}
    </button>
  );
};
