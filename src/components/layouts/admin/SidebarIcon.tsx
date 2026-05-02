import { LockClosedIcon, SettingIcon, Square2x2Icon } from '@/components/icons';

type IconComponent = React.FC<{ className?: string }>;

const ICON_MAP: Record<string, IconComponent> = {
  Dashboard: Square2x2Icon,
  Settings: SettingIcon,
  Security: LockClosedIcon,
};

const DEFAULT_ICON = Square2x2Icon;

type SidebarIconProps = {
  name?: string;
  className?: string;
};

export const SidebarIcon: React.FC<SidebarIconProps> = ({ name, className = 'size-5' }) => {
  const Icon = (name && ICON_MAP[name]) || DEFAULT_ICON;
  return <Icon className={className} />;
};
