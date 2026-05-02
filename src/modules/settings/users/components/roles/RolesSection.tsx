import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { PlusIcon, XMarkIcon } from '@/components/icons';
import { Badge, Button, Section } from '@/components/ui';
import { cn } from '@/libs/utils';
import type { Options } from '@/types';

import type { UsersFormDto } from '../../validations';

const AssignRoleModal = dynamic(() =>
  import('./AssignRoleModal').then((mod) => mod.AssignRoleModal),
);

type RolesSectionProps = {
  roles: Options[];
  canSubmit: boolean;
};

export const RolesSection: React.FC<RolesSectionProps> = ({ roles, canSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext<UsersFormDto>();

  const selectedIds = watch('roles') || [];

  const handleAssign = (values: string[]) => {
    setValue('roles', values, { shouldDirty: true });
    trigger('roles');
  };

  const handleRemove = (index: number) => {
    const updated = selectedIds.filter((_, i) => i !== index);
    setValue('roles', updated, { shouldDirty: true });
    trigger('roles');
  };

  return (
    <Section
      title="User Roles"
      headerExtra={
        canSubmit && (
          <Button
            variant="outline"
            size="sm"
            icon={<PlusIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            Assign Roles
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
          {selectedIds.length > 0 ? (
            selectedIds.map((id, index) => {
              const label = roles.find((r) => r.id === id)?.name || '-';
              return (
                <Badge
                  key={id}
                  color="info"
                  size="sm"
                  customClass="uppercase h-8"
                  endIcon={
                    canSubmit && (
                      <XMarkIcon
                        className="size-3 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(index);
                        }}
                      />
                    )
                  }
                >
                  {label}
                </Badge>
              );
            })
          ) : (
            <div
              className={cn(
                'w-full flex items-center justify-center py-8 px-4 bg-gray-50 rounded-2xl border  border-slate-100',
                errors.roles && 'border-red-500',
              )}
            >
              <p className="text-sm text-gray-500">No roles assigned yet.</p>
            </div>
          )}
        </div>
        {errors.roles && <p className="input-text-error">{errors.roles.message}</p>}
      </div>
      <AssignRoleModal
        key={String(isModalOpen)}
        isOpen={isModalOpen}
        selectedValues={selectedIds}
        roles={roles}
        onAssign={handleAssign}
        onClose={() => setIsModalOpen(false)}
      />
    </Section>
  );
};
