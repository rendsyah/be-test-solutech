import Link from 'next/link';

import { Button } from '@/components/ui';
import { cn } from '@/libs/utils';

import { HELP_CATEGORIES } from '../constants';

export const HelpCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {HELP_CATEGORIES.map((cat) => (
        <div key={cat.id} className="card p-6 flex flex-col gap-4">
          <div
            className={cn(
              'size-12 rounded-xl flex items-center justify-center border border-slate-200',
              cat.id === 'status' && 'bg-green-50 border-green-200',
            )}
          >
            {cat.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{cat.title}</h3>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{cat.description}</p>
          </div>
          <Button variant="ghost" className="w-fit text-primary font-semibold p-0">
            <Link href={cat.href || '#'}>{cat.actionText} →</Link>
          </Button>
        </div>
      ))}
    </div>
  );
};
