import { unwrapResponse } from '@/libs/api/server';
import { AuditDetailViewPage } from '@/modules/security/audit';
import { auditServerService } from '@/modules/security/audit/services/server';

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const response = await auditServerService.getDetail(id);
  const audit = unwrapResponse(response);

  return <AuditDetailViewPage audit={audit} />;
}
