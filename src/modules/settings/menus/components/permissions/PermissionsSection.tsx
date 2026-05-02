import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { PlusIcon, XMarkIcon } from '@/components/icons';
import { Badge, Button, Section } from '@/components/ui';
import type { Options } from '@/types';

import type { MenusUpdateDto } from '../../validations';

const AssignPermissionModal = dynamic(() =>
  import('./AssignPermissionModal').then((mod) => mod.AssignPermissionModal),
);

type PermissionsSectionProps = {
  permissions: Options[];
  canSubmit: boolean;
};

export const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  permissions,
  canSubmit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { watch, setValue } = useFormContext<MenusUpdateDto>();

  const selectedIds = watch('permissions') || [];

  const handleAssign = (values: string[]) => {
    setValue('permissions', values, { shouldDirty: true });
  };

  const handleRemove = (index: number) => {
    const updated = selectedIds.filter((_, i) => i !== index);
    setValue('permissions', updated, { shouldDirty: true });
  };

  return (
    <Section
      title="Menu Permissions"
      headerExtra={
        canSubmit && (
          <Button
            variant="outline"
            size="sm"
            icon={<PlusIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Permissions
          </Button>
        )
      }
    >
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
        {selectedIds.length > 0 ? (
          selectedIds.map((id, index) => {
            const label = permissions.find((p) => p.id === id)?.name || '-';
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
          <div className="w-full flex items-center justify-center py-8 px-4 bg-gray-50 rounded-2xl border border-slate-100">
            <p className="text-sm text-gray-500">No permissions assigned yet.</p>
          </div>
        )}
      </div>
      <AssignPermissionModal
        key={String(isModalOpen)}
        isOpen={isModalOpen}
        selectedValues={selectedIds}
        permissions={permissions}
        onAssign={handleAssign}
        onClose={() => setIsModalOpen(false)}
      />
    </Section>
  );
};
