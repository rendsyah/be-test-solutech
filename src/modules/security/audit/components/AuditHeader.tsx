import { useRouter } from 'next/navigation';

import { ChevronLeftIcon } from '@/components/icons';
import { Breadcrumb, Button } from '@/components/ui';

import { AUDIT_HEADER, AUDIT_ROUTES, type AuditHeaderMode } from '../constants';

type AuditHeaderProps = {
  mode?: AuditHeaderMode;
};

export const AuditHeader: React.FC<AuditHeaderProps> = ({ mode = 'list' }) => {
  const router = useRouter();

  const { breadcrumb, title, description } = AUDIT_HEADER[mode];

  const handleBack = () => {
    router.push(AUDIT_ROUTES.root);
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div className="flex flex-col">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-2xl font-semibold mt-2">{title}</h1>
        <p className="text-sm text-gray-400 font-medium">{description}</p>
      </div>
      {mode === 'detail' && (
        <Button
          variant="ghost"
          className="text-primary p-0 hidden xl:flex"
          icon={<ChevronLeftIcon />}
          onClick={handleBack}
        >
          Back to Audit
        </Button>
      )}
    </div>
  );
};
