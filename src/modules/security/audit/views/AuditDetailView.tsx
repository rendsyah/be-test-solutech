'use client';

import { withPermission } from '@/hocs';

import { AuditDetail, AuditHeader } from '../components';
import { AUDIT_PERMISSIONS } from '../constants';
import type { AuditDetailResponse } from '../types';

type AuditDetailProps = {
  audit: AuditDetailResponse;
};

const AuditDetailView: React.FC<AuditDetailProps> = ({ audit }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <AuditHeader mode="detail" />
      </div>
      <div className="col-span-12">
        <AuditDetail audit={audit} />
      </div>
    </div>
  );
};

export const AuditDetailViewPage = withPermission(AuditDetailView, [AUDIT_PERMISSIONS.view]);
