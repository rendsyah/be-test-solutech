'use client';

import dynamic from 'next/dynamic';

import { withPermission } from '@/hocs';
import { useDebounce } from '@/hooks';

import { AuditHeader, AuditTable } from '../components';
import { AUDIT_PERMISSIONS } from '../constants';
import { useAudit, useAuditExport, useAuditFilter } from '../hooks';

const AuditFilterModal = dynamic(() =>
  import('../components/AuditFilterModal').then((mod) => mod.AuditFilterModal),
);

const AuditView = () => {
  const auditFilter = useAuditFilter();
  const debouncedSearch = useDebounce(auditFilter.filter.search, 500);
  const auditExport = useAuditExport(auditFilter.filter);
  const audit = useAudit({ ...auditFilter.filter, search: debouncedSearch });

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <AuditHeader />
      </div>
      <div className="col-span-12">
        <AuditTable
          data={audit.data?.items ?? []}
          meta={audit.data?.meta}
          isLoading={audit.isLoading}
          isError={audit.isError}
          isExport={auditExport.isExport}
          filter={auditFilter.filter}
          onOpenFilter={auditFilter.onOpenFilter}
          onExport={auditExport.onExport}
          onSearch={auditFilter.onSearch}
          onPageChange={auditFilter.onPageChange}
          onLimitChange={auditFilter.onLimitChange}
          onSortChange={auditFilter.onSortChange}
          onRetry={audit.refetch}
        />
      </div>
      <AuditFilterModal
        isOpen={auditFilter.isFilterOpen}
        filter={auditFilter.filter}
        onClose={auditFilter.onCloseFilter}
        onApply={auditFilter.onApplyFilter}
        onReset={auditFilter.onResetFilter}
      />
    </div>
  );
};

export const AuditViewPage = withPermission(AuditView, [AUDIT_PERMISSIONS.view]);
