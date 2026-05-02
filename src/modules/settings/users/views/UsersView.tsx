'use client';

import dynamic from 'next/dynamic';

import { withPermission } from '@/hocs';
import { useDebounce } from '@/hooks';

import { UsersHeader, UsersTable } from '../components';
import { USERS_PERMISSIONS } from '../constants';
import { useUsers, useUsersExport, useUsersFilter } from '../hooks';

const UsersFilterModal = dynamic(() =>
  import('../components/UsersFilterModal').then((mod) => mod.UsersFilterModal),
);

const UsersView = () => {
  const usersFilter = useUsersFilter();
  const debouncedSearch = useDebounce(usersFilter.filter.search, 500);
  const usersExport = useUsersExport(usersFilter.filter);
  const users = useUsers({ ...usersFilter.filter, search: debouncedSearch });

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <UsersHeader />
      </div>
      <div className="col-span-12">
        <UsersTable
          data={users.data?.items ?? []}
          meta={users.data?.meta}
          isLoading={users.isLoading}
          isError={users.isError}
          isExport={usersExport.isExport}
          filter={usersFilter.filter}
          onOpenFilter={usersFilter.onOpenFilter}
          onExport={usersExport.onExport}
          onSearch={usersFilter.onSearch}
          onPageChange={usersFilter.onPageChange}
          onLimitChange={usersFilter.onLimitChange}
          onSortChange={usersFilter.onSortChange}
          onRetry={users.refetch}
        />
      </div>
      <UsersFilterModal
        isOpen={usersFilter.isFilterOpen}
        filter={usersFilter.filter}
        onClose={usersFilter.onCloseFilter}
        onApply={usersFilter.onApplyFilter}
        onReset={usersFilter.onResetFilter}
      />
    </div>
  );
};

export const UsersViewPage = withPermission(UsersView, [USERS_PERMISSIONS.view]);
