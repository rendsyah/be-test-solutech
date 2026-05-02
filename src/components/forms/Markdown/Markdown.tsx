import { useRef, useState } from 'react';

import { cn } from '@/libs/utils';

import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownTabs } from './MarkdownTabs';
import { MarkdownToolbar } from './MarkdownToolbar';
import type { TOOLBAR_ITEMS } from './MarkdownToolbar';
import { mdInsertText } from './utils';

export type MarkdownProps = {
  id?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  error?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export const Markdown: React.FC<MarkdownProps> = ({
  id,
  value = '',
  placeholder,
  className,
  rows = 8,
  error,
  readOnly,
  disabled,
  onChange,
}) => {
  const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');
  const editorRef = useRef<{
    handleToolbarAction: (action: (typeof TOOLBAR_ITEMS)[number]['action']) => void;
  }>(null);

  const handleViewMode = () => {
    if (disabled) return;
    setViewMode((prev) => (prev === 'write' ? 'preview' : 'write'));
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const safeName = file.name.replace(/[\[\]]/g, '');
    const markdown = file.type.startsWith('image/')
      ? `![${safeName}](${url})`
      : `[${safeName}](${url})`;

    editorRef.current?.handleToolbarAction(mdInsertText(markdown));
  };

  return (
    <div
      className={cn(
        'w-full rounded-lg',
        'bg-white border border-slate-200 shadow-xs',
        'focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10',
        error && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      <div className="flex items-center bg-gray-50 rounded-t-lg border-b border-slate-200">
        <MarkdownTabs viewMode={viewMode} disabled={disabled} onToggle={handleViewMode} />
        <MarkdownToolbar
          onAction={(action) => editorRef.current?.handleToolbarAction(action)}
          onFileSelect={handleFileSelect}
          disabled={disabled || readOnly || viewMode === 'preview'}
        />
      </div>
      <div className="py-2.75 px-4">
        <MarkdownEditor
          ref={editorRef}
          id={id}
          value={value}
          placeholder={placeholder}
          rows={rows}
          viewMode={viewMode}
          error={error}
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
