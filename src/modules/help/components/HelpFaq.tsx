import { useState } from 'react';

import { ChevronDownIcon } from '@/components/icons';
import { Section } from '@/components/ui';
import { cn } from '@/libs/utils';

import { HELP_FAQS } from '../constants';

export const HelpFaq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <Section title="Frequently Asked Questions">
      <div className="divide-y divide-slate-200 -mx-6 -my-6">
        {HELP_FAQS.map((faq) => (
          <div key={faq.id} className="flex flex-col">
            <button
              onClick={() => toggle(faq.id)}
              className="flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors group"
            >
              <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                {faq.question}
              </span>
              <ChevronDownIcon
                className={cn(
                  'size-5 text-gray-500 transition-transform duration-200',
                  openId === faq.id && 'rotate-180 text-primary',
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
