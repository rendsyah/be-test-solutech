import dayjs from 'dayjs';

import { EyeIcon } from '@/components/icons';
import { Badge, IconButton, type ColumnDef } from '@/components/ui';
import { cn } from '@/libs/utils';

import type { AuditListResponse } from '../types';
import { ACTION_COLOR_MAP } from './commons';

type AuditColumnsOptions = {
  onDetail: (id: string) => void;
  canDetail: boolean;
};

export const auditColumns = ({
  onDetail,
  canDetail,
}: AuditColumnsOptions): ColumnDef<AuditListResponse>[] => [
  {
    key: 'user',
    label: 'User',
    sortable: true,
    render: (value) => value.user,
  },
  {
    key: 'object',
    label: 'Object',
    sortable: true,
    render: (value) => value.object,
  },
  {
    key: 'object_id',
    label: 'Object ID',
    sortable: true,
    render: (value) => value.object_id,
  },
  {
    key: 'action',
    label: 'Activity',
    className: 'w-10 uppercase',
    sortable: true,
    render: (value) => (
      <Badge size="sm" color={ACTION_COLOR_MAP[value.action]}>
        {value.action} {value.object}
      </Badge>
    ),
  },
  {
    key: 'created_at',
    label: 'Created At',
    className: 'w-10',
    sortable: true,
    render: (value) => dayjs(value.created_at).format('DD/MM/YYYY HH:mm:ss'),
  },
  {
    key: 'action_view',
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
