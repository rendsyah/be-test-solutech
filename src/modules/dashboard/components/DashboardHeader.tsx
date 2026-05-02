import { ArrowDownIcon } from '@/components/icons';
import { Breadcrumb, Button } from '@/components/ui';

import { DASHBOARD_HEADER, type DashboardHeaderMode } from '../constants';

type DashboardHeaderProps = {
  mode?: DashboardHeaderMode;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ mode = 'main' }) => {
  const { breadcrumb, title, description } = DASHBOARD_HEADER[mode];

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div className="flex flex-col">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-2xl font-semibold mt-2">{title}</h1>
        <p className="text-sm text-gray-400 font-medium">{description}</p>
      </div>
      <Button icon={<ArrowDownIcon />} iconPosition="start">
        Download
      </Button>
    </div>
  );
};
