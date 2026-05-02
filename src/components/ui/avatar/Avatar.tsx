import type { StaticImageData } from 'next/image';
import Image from 'next/image';

import { cn } from '@/libs/utils';

type AvatarStatus = 'online' | 'offline' | 'busy' | 'none';

type AvatarProps = {
  src: string | StaticImageData;
  alt?: string;
  size?: keyof typeof AVATAR_SIZE_CLASSES;
  status?: AvatarStatus;
};

const AVATAR_SIZE_CLASSES = {
  xsmall: 'size-6 max-w-6',
  small: 'size-8 max-w-8',
  medium: 'size-10 max-w-10',
  large: 'size-12 max-w-12',
  xlarge: 'size-14 max-w-14',
  xxlarge: 'size-16 max-w-16',
};

const AVATAR_STATUS_SIZE_CLASSES = {
  xsmall: 'size-1.5 max-w-1.5',
  small: 'size-2 max-w-2',
  medium: 'size-2.5 max-w-2.5',
  large: 'size-3 max-w-3',
  xlarge: 'size-3.5 max-w-3.5',
  xxlarge: 'size-4 max-w-4',
};

const AVATAR_STATUS_COLOR_CLASSES = {
  online: 'bg-emerald-500',
  offline: 'bg-red-600',
  busy: 'bg-amber-600',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'medium',
  status = 'none',
}) => {
  return (
    <div className={cn('relative rounded-full', AVATAR_SIZE_CLASSES[size])}>
      <div className="relative h-full w-full rounded-full border border-slate-200 shadow-xs overflow-hidden">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
      {status !== 'none' && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            AVATAR_STATUS_SIZE_CLASSES[size],
            AVATAR_STATUS_COLOR_CLASSES[status],
          )}
        ></span>
      )}
    </div>
  );
};
