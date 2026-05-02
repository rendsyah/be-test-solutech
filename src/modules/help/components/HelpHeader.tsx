import { Breadcrumb } from '@/components/ui';

import { HELP_HEADER, type HelpHeaderMode } from '../constants';

type HelpHeaderProps = {
  mode?: HelpHeaderMode;
};

export const HelpHeader: React.FC<HelpHeaderProps> = ({ mode = 'main' }) => {
  const { breadcrumb, title, description } = HELP_HEADER[mode];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-2xl font-semibold mt-2">{title}</h1>
        <p className="text-sm text-gray-400 font-medium">{description}</p>
      </div>
    </div>
  );
};
