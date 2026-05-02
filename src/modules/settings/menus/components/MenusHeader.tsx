import { Breadcrumb } from '@/components/ui';

import { MENUS_HEADER, type MenusHeaderMode } from '../constants';

type MenusHeaderProps = {
  mode?: MenusHeaderMode;
};

export const MenusHeader: React.FC<MenusHeaderProps> = ({ mode = 'main' }) => {
  const { breadcrumb, title, description } = MENUS_HEADER[mode];

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div className="flex flex-col">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-2xl font-semibold mt-2">{title}</h1>
        <p className="text-sm text-gray-400 font-medium">{description}</p>
      </div>
    </div>
  );
};
