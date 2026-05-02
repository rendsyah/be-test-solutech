import { Button } from '@/components/ui';

export const HelpSupportCard: React.FC = () => {
  return (
    <div className="bg-gray-50 border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-primary">Still need help?</h3>
      <p className="text-sm leading-relaxed">
        Can&apos;t find what you&apos;re looking for? Our support engineers are ready to help you
        with any technical issues.
      </p>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Response time</span>
          <span className="font-medium text-emerald-600">Under 2 hours</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Available</span>
          <span className="font-medium">Mon - Fri, 9am - 6pm</span>
        </div>
      </div>
      <Button className="mt-2">Open Support Ticket</Button>
    </div>
  );
};
