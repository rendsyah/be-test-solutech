import { useState } from 'react';

import { CheckIcon, ChevronDownIcon } from '@/components/icons';
import { PlusIcon } from '@/components/icons/Plus';
import { SidebarIcon } from '@/components/layouts/admin';
import { Badge, IconButton } from '@/components/ui';
import { cn } from '@/libs/utils';

import type { PermissionsResponse } from '../../../permissions';
import { collectPermissionIds } from '../../helpers';

type ModuleRowProps = {
  module: PermissionsResponse;
  selectedPermissionIds: Set<string>;
  onTogglePermission: (id: string) => void;
  onToggleAllPermissions: (ids: string[]) => void;
  readOnly: boolean;
  level?: number;
  isLast?: boolean;
};

export const ModuleRow = ({
  module,
  selectedPermissionIds,
  onTogglePermission,
  onToggleAllPermissions,
  readOnly,
  level = 0,
  isLast = false,
}: ModuleRowProps) => {
  const [open, setOpen] = useState(true);

  const permIds = module.permissions.map((p) => p.id);
  const allChildPermIds = collectPermissionIds(module);
  const ids = permIds.length ? permIds : allChildPermIds;

  const allSelected = ids.length > 0 && ids.every((id) => selectedPermissionIds.has(id));
  const hasChildren = module.child.length > 0;
  const indent = level > 0;

  return (
    <div className="border-b border-slate-200 last:border-0">
      <div
        className={cn(
          'relative flex items-start gap-3 px-6 py-4 hover:bg-gray-50 transition-colors',
          'cursor-pointer',
          indent && 'pl-18',
        )}
        onClick={() => setOpen(!open)}
      >
        {indent && (
          <>
            <span
              className="absolute left-10 top-0 w-px bg-slate-200"
              style={{ height: isLast ? '50%' : '100%' }}
            />
            <span className="absolute left-10.25 top-1/2 w-5 h-px bg-slate-200" />
          </>
        )}

        <div className="mt-0.5 size-8 rounded-lg border border-slate-200 shadow-xs flex items-center justify-center text-primary shrink-0">
          <SidebarIcon name={module.icon} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{module.name}</p>

                {hasChildren &&
                  (() => {
                    const selectedCount = allChildPermIds.filter((id) =>
                      selectedPermissionIds.has(id),
                    ).length;

                    return selectedCount > 0 ? (
                      <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                        {selectedCount}
                      </span>
                    ) : null;
                  })()}
              </div>

              <p className="text-xs text-gray-400 mt-0.5">{module.description}</p>
            </div>

            <div className="flex items-center gap-2">
              {!hasChildren && !readOnly && (
                <IconButton
                  className={cn(
                    'w-7 h-7 rounded-full border',
                    allSelected
                      ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-500'
                      : 'border-primary text-primary hover:bg-primary hover:text-white',
                  )}
                  onClick={() => onToggleAllPermissions(permIds.length ? permIds : allChildPermIds)}
                >
                  {allSelected ? (
                    <CheckIcon className="size-3 stroke-3" />
                  ) : (
                    <PlusIcon className="size-3 stroke-3" />
                  )}
                </IconButton>
              )}

              {hasChildren && (
                <IconButton>
                  <ChevronDownIcon
                    className={cn(
                      'w-5 h-5 text-gray-500 transition-transform duration-200',
                      !open && '-rotate-90',
                    )}
                  />
                </IconButton>
              )}
            </div>
          </div>

          {permIds.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mt-2.5">
              {module.permissions.map((p) => {
                const selected = selectedPermissionIds.has(p.id);
                return (
                  <Badge
                    key={p.id}
                    color="info"
                    size="sm"
                    customClass="uppercase h-8"
                    startIcon={selected ? <CheckIcon className="size-3 stroke-3" /> : null}
                    onClick={() => onTogglePermission(p.id)}
                    readOnly={readOnly}
                  >
                    {p.name}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {hasChildren && (
        <div
          className={cn(
            'overflow-hidden custom-scrollbar transition-all duration-200',
            open ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          {module.child.map((child, i) => (
            <ModuleRow
              key={child.id}
              module={child}
              selectedPermissionIds={selectedPermissionIds}
              onTogglePermission={onTogglePermission}
              onToggleAllPermissions={onToggleAllPermissions}
              readOnly={readOnly}
              level={level + 1}
              isLast={i === module.child.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
