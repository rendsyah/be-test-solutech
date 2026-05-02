import { useState } from 'react';

import { Combobox } from '@/components/forms';
import { Button, Modal } from '@/components/ui';
import type { Options } from '@/types';

type AssignPermissionModalProps = {
  isOpen: boolean;
  selectedValues: string[];
  permissions: Options[];
  onAssign: (values: string[]) => void;
  onClose: () => void;
};

export const AssignPermissionModal: React.FC<AssignPermissionModalProps> = ({
  isOpen,
  selectedValues,
  permissions,
  onAssign,
  onClose,
}) => {
  const [localValues, setLocalValues] = useState<string[]>(selectedValues);

  const handleApply = () => {
    onAssign(localValues);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Assign Permissions"
      onClose={onClose}
      action={
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Assign
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-400">
          Select permissions you want to assign to this menu item.
        </p>
        <Combobox
          placeholder="Choose permissions"
          options={permissions}
          value={localValues}
          onChange={setLocalValues}
        />
      </div>
    </Modal>
  );
};
