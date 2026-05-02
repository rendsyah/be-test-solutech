import { useState } from 'react';

import { Combobox } from '@/components/forms';
import { Button, Modal } from '@/components/ui';
import type { Options } from '@/types';

type AssignRoleModalProps = {
  isOpen: boolean;
  selectedValues: string[];
  roles: Options[];
  onAssign: (values: string[]) => void;
  onClose: () => void;
};

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  selectedValues,
  roles,
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
      title="Assign Roles"
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
        <p className="text-sm text-gray-400">Select roles you want to assign to this user.</p>
        <Combobox
          placeholder="Choose roles"
          options={roles}
          value={localValues}
          onChange={setLocalValues}
        />
      </div>
    </Modal>
  );
};
