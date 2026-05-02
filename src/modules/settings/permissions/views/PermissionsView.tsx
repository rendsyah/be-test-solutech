'use client';

import dynamic from 'next/dynamic';

import { withPermission } from '@/hocs';
import { useDebounce } from '@/hooks';

import { PermissionsHeader, PermissionsTable } from '../components';
import { PERMISSIONS } from '../constants';
import { usePermissions, usePermissionsFilter } from '../hooks';

const PermissionsFilterModal = dynamic(() =>
  import('../components/PermissionsFilterModal').then((mod) => mod.PermissionsFilterModal),
);

const PermissionsView = () => {
  const permissionsFilter = usePermissionsFilter();
  const debouncedSearch = useDebounce(permissionsFilter.filter.search, 500);
  const permissions = usePermissions({ ...permissionsFilter.filter, search: debouncedSearch });

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <PermissionsHeader />
      </div>
      <div className="col-span-12">
        <PermissionsTable
          data={permissions.data?.items ?? []}
          meta={permissions.data?.meta}
          isLoading={permissions.isLoading}
          isError={permissions.isError}
          filter={permissionsFilter.filter}
          onOpenFilter={permissionsFilter.onOpenFilter}
          onSearch={permissionsFilter.onSearch}
          onPageChange={permissionsFilter.onPageChange}
          onLimitChange={permissionsFilter.onLimitChange}
          onSortChange={permissionsFilter.onSortChange}
          onRetry={permissions.refetch}
        />
      </div>
      <PermissionsFilterModal
        isOpen={permissionsFilter.isFilterOpen}
        filter={permissionsFilter.filter}
        onClose={permissionsFilter.onCloseFilter}
        onApply={permissionsFilter.onApplyFilter}
        onReset={permissionsFilter.onResetFilter}
      />
    </div>
  );
};

export const PermissionsViewPage = withPermission(PermissionsView, [PERMISSIONS.view]);
