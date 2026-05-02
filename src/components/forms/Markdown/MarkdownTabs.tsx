import { cn } from '@/libs/utils';

type MarkdownTabsProps = {
  viewMode: 'write' | 'preview';
  disabled?: boolean;
  onToggle: () => void;
};

const TABS = [
  {
    mode: 'write' as const,
    label: 'Write',
    activeClass: 'bg-white border-r border-b border-b-transparent',
  },
  {
    mode: 'preview' as const,
    label: 'Preview',
    activeClass: 'bg-white border-l border-r border-b border-b-transparent',
  },
];

export const MarkdownTabs: React.FC<MarkdownTabsProps> = ({ viewMode, disabled, onToggle }) => {
  return (
    <nav className="flex text-sm">
      {TABS.map(({ mode, label, activeClass }) => (
        <button
          key={mode}
          type="button"
          disabled={disabled}
          className={cn(
            'py-2.75 px-4 rounded-t-lg border-slate-200',
            viewMode === mode && activeClass,
            viewMode === mode && '-mb-px relative z-10',
            disabled && 'cursor-not-allowed',
          )}
          onClick={onToggle}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};
