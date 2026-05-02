import { useState } from 'react';

import { FormField, DatePicker } from '@/components/forms';
import { Button, Modal } from '@/components/ui';

import type { AuditListDto } from '../types';

type AuditFilterModalProps = {
  isOpen: boolean;
  filter: Pick<AuditListDto, 'startDate' | 'endDate'>;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  onReset: () => void;
};

export const AuditFilterModal: React.FC<AuditFilterModalProps> = ({
  isOpen,
  filter,
  onClose,
  onApply,
  onReset,
}) => {
  const [localFilter, setLocalFilter] = useState({
    startDate: filter.startDate,
    endDate: filter.endDate,
  });

  const handleApply = () => {
    onApply(localFilter.startDate, localFilter.endDate);
    onClose();
  };

  const handleReset = () => {
    setLocalFilter({ startDate: '', endDate: '' });
    onReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Filter Audit"
      onClose={onClose}
      action={
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6">
          <FormField id="startDate" label="Start Date">
            <DatePicker
              id="startDate"
              value={localFilter.startDate}
              placeholder="Choose Start Date"
              onChange={(value) => setLocalFilter((prev) => ({ ...prev, startDate: value }))}
            />
          </FormField>
        </div>
        <div className="col-span-12 sm:col-span-6">
          <FormField id="endDate" label="End Date">
            <DatePicker
              id="endDate"
              value={localFilter.endDate}
              placeholder="Choose End Date"
              minDate={localFilter.startDate}
              onChange={(value) => setLocalFilter((prev) => ({ ...prev, endDate: value }))}
            />
          </FormField>
        </div>
      </div>
    </Modal>
  );
};
