'use client';

import dynamic from 'next/dynamic';

import { withPermission } from '@/hocs';
import { useDebounce } from '@/hooks';

import { RolesHeader, RolesTable } from '../components';
import { ROLES_PERMISSIONS } from '../constants';
import { useRoles, useRolesFilter } from '../hooks';

const RolesFilterModal = dynamic(() =>
  import('../components/RolesFilterModal').then((mod) => mod.RolesFilterModal),
);

const RolesView = () => {
  const rolesFilter = useRolesFilter();
  const debouncedSearch = useDebounce(rolesFilter.filter.search, 500);
  const roles = useRoles({ ...rolesFilter.filter, search: debouncedSearch });

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <RolesHeader />
      </div>
      <div className="col-span-12">
        <RolesTable
          data={roles.data?.items ?? []}
          meta={roles.data?.meta}
          isLoading={roles.isLoading}
          isError={roles.isError}
          filter={rolesFilter.filter}
          onOpenFilter={rolesFilter.onOpenFilter}
          onSearch={rolesFilter.onSearch}
          onPageChange={rolesFilter.onPageChange}
          onLimitChange={rolesFilter.onLimitChange}
          onSortChange={rolesFilter.onSortChange}
          onRetry={roles.refetch}
        />
      </div>
      <RolesFilterModal
        isOpen={rolesFilter.isFilterOpen}
        filter={rolesFilter.filter}
        onClose={rolesFilter.onCloseFilter}
        onApply={rolesFilter.onApplyFilter}
        onReset={rolesFilter.onResetFilter}
      />
    </div>
  );
};

export const RolesViewPage = withPermission(RolesView, [ROLES_PERMISSIONS.view]);
