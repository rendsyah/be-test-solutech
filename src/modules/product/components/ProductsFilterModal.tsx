'use client';

import { useState } from 'react';

import { DatePicker } from '@/components/forms';
import { Select } from '@/components/forms';
import { Button, Modal } from '@/components/ui';
import type { ProductListDto } from '@/types';

import { PRODUCT_STATUS_OPTIONS } from '../constants';

type FilterValues = Pick<ProductListDto, 'startDate' | 'endDate' | 'status'>;

type ProductsFilterModalProps = {
  isOpen: boolean;
  filter: FilterValues;
  onClose: () => void;
  onApply: (values: FilterValues) => void;
  onReset: () => void;
};

export const ProductsFilterModal: React.FC<ProductsFilterModalProps> = ({
  isOpen,
  filter,
  onClose,
  onApply,
  onReset,
}) => {
  const [startDate, setStartDate] = useState(filter.startDate);
  const [endDate, setEndDate] = useState(filter.endDate);
  const [status, setStatus] = useState<FilterValues['status']>(filter.status);

  const handleApply = () => {
    onApply({ startDate, endDate, status });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setStatus('');
    onReset();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Filter Products"
      onClose={onClose}
      action={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filter</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Date</span>
          <div className="flex items-center gap-2">
            <DatePicker
              placeholder="Start Date"
              value={startDate}
              onChange={setStartDate}
              maxDate={endDate || undefined}
            />
            <DatePicker
              placeholder="End Date"
              value={endDate}
              onChange={setEndDate}
              minDate={startDate || undefined}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Status</span>
            <Select
              placeholder="All Status"
              options={PRODUCT_STATUS_OPTIONS}
              value={status}
              onChange={(value) => setStatus(value as FilterValues['status'])}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
