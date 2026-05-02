import dayjs from 'dayjs';

import { EyeIcon } from '@/components/icons';
import { IconButton, type ColumnDef } from '@/components/ui';
import { cn } from '@/libs/utils';

import type { PermissionsListResponse } from '../types';

type PermissionsColumnsOptions = {
  onDetail: (id: string) => void;
  canDetail: boolean;
};

export const permissionsColumns = ({
  onDetail,
  canDetail,
}: PermissionsColumnsOptions): ColumnDef<PermissionsListResponse>[] => [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    render: (value) => value.name,
  },
  {
    key: 'key',
    label: 'Key',
    sortable: true,
    render: (value) => value.key,
  },
  {
    key: 'description',
    label: 'Description',
    sortable: true,
    render: (value) => value.description,
  },
  {
    key: 'created_at',
    label: 'Created At',
    className: 'w-10',
    sortable: true,
    render: (value) => dayjs(value.created_at).format('MMM DD, YYYY'),
  },
  {
    key: 'action',
    label: 'Action',
    align: 'center',
    className: 'w-10',
    render: (value) => (
      <IconButton
        className={cn(!canDetail && 'opacity-50')}
        onClick={() => onDetail(value.id)}
        disabled={!canDetail}
      >
        <EyeIcon className="size-5" />
      </IconButton>
    ),
  },
];
