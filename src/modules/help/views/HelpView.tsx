'use client';

import { HelpCards, HelpFaq, HelpHeader, HelpSupportCard } from '../components';

export const HelpView = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <HelpHeader />
      </div>

      <div className="col-span-12">
        <HelpCards />
      </div>

      <div className="col-span-12 lg:col-span-8">
        <HelpFaq />
      </div>

      <div className="col-span-12 lg:col-span-4">
        <HelpSupportCard />
      </div>
    </div>
  );
};
