import dayjs from 'dayjs';

import { EyeIcon, PencilSquareIcon } from '@/components/icons';
import { Badge, IconButton, type ColumnDef } from '@/components/ui';
import { cn } from '@/libs/utils';

import type { RolesListResponse } from '../types';

type RolesColumnsOptions = {
  onDetail: (id: string) => void;
  onEdit: (id: string) => void;
  canDetail: boolean;
  canEdit: boolean;
};

export const rolesColumns = ({
  onDetail,
  onEdit,
  canDetail,
  canEdit,
}: RolesColumnsOptions): ColumnDef<RolesListResponse>[] => [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    render: (value) => value.name,
  },
  {
    key: 'description',
    label: 'Description',
    sortable: true,
    render: (value) => value.description,
  },
  {
    key: 'status',
    label: 'Status',
    className: 'w-10 uppercase',
    sortable: true,
    render: (value) => (
      <Badge size="sm" color={Number(value.status) === 1 ? 'success' : 'error'}>
        {value.status_text}
      </Badge>
    ),
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
      <div>
        <IconButton
          className={cn(!canDetail && 'opacity-50')}
          onClick={() => onDetail(value.id)}
          disabled={!canDetail}
        >
          <EyeIcon className="size-5 translate-y-px" />
        </IconButton>
        <IconButton
          className={cn(!canEdit && 'opacity-50')}
          onClick={() => onEdit(value.id)}
          disabled={!canEdit}
        >
          <PencilSquareIcon className="size-5" />
        </IconButton>
      </div>
    ),
  },
];
