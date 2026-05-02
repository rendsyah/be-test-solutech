import dayjs from 'dayjs';

import { Badge, Section } from '@/components/ui';

import { ACTION_COLOR_MAP } from '../constants';
import type { AuditDetailResponse } from '../types';

type AuditDetailProps = {
  audit: AuditDetailResponse;
};

const syntaxHighlight = (json: unknown) => {
  const str = JSON.stringify(json, null, 2);

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?)/g,
      (match) => {
        let cls = 'text-inherit';

        if (/^"/.test(match)) {
          cls = /:$/.test(match)
            ? 'text-slate-500 font-medium' // key
            : 'text-amber-500'; // string
        } else if (/true|false/.test(match)) {
          cls = 'text-indigo-500'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-gray-400 italic'; // null
        } else {
          cls = 'text-emerald-500'; // number
        }

        return `<span class="${cls}">${match}</span>`;
      },
    );
};

export const AuditDetail: React.FC<AuditDetailProps> = ({ audit }) => {
  const isShowDiff = audit.diff !== null;

  return (
    <div className="flex flex-col gap-6">
      <Section
        title="Audit Information"
        headerExtra={
          <Badge size="sm" color={ACTION_COLOR_MAP[audit.action]}>
            {audit.action.toUpperCase()}
          </Badge>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div className="border-b border-slate-200 pb-4">
            <p className="font-semibold mb-1">User</p>
            <p>{audit.user}</p>
          </div>
          <div className="border-b border-slate-200 pb-4">
            <p className="font-semibold mb-1">Object</p>
            <p>{audit.object}</p>
          </div>
          <div className="border-b border-slate-200 pb-4 sm:border-none sm:pb-0">
            <p className="font-semibold mb-1">Object ID</p>
            <p className="text-primary hover:underline cursor-pointer">#{audit.object_id}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Created At</p>
            <p>{dayjs(audit.created_at).format('DD/MM/YYYY HH:mm:ss')}</p>
          </div>
        </div>
      </Section>
      {isShowDiff && (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Changes Overview</h1>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Before">
              <div className="overflow-auto custom-scrollbar">
                <pre
                  className="text-sm font-mono tracking-tight leading-relaxed whitespace-pre min-w-max rounded-2xl bg-gray-50 border border-slate-100 p-5"
                  dangerouslySetInnerHTML={{
                    __html: syntaxHighlight(audit.diff?.before),
                  }}
                />
              </div>
            </Section>
            <Section title="After">
              <div className="overflow-auto custom-scrollbar">
                <pre
                  className="text-sm font-mono tracking-tight leading-relaxed whitespace-pre min-w-max rounded-2xl bg-gray-50 border border-slate-100 p-5"
                  dangerouslySetInnerHTML={{
                    __html: syntaxHighlight(audit.diff?.after),
                  }}
                />
              </div>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
};
