import Image from 'next/image';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/libs/utils';

import type { TOOLBAR_ITEMS } from './MarkdownToolbar';

type MarkdownEditorHandle = {
  handleToolbarAction: (action: (typeof TOOLBAR_ITEMS)[number]['action']) => void;
};

type MarkdownEditorProps = {
  id?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  viewMode: 'write' | 'preview';
  onChange?: (value: string) => void;
  error?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
};

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  (
    { id, value = '', placeholder, rows = 8, viewMode, onChange, error, readOnly, disabled },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      handleToolbarAction: (action) => {
        if (!action) return;
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const { text, cursorStart, cursorEnd } = action(value, start, end);
        onChange?.(text);
        requestAnimationFrame(() => {
          textarea.focus();
          textarea.setSelectionRange(cursorStart, cursorEnd);
        });
      },
    }));

    if (viewMode === 'preview') {
      return (
        <div className="text-sm prose prose-sm wrap-break-words max-w-none min-h-41.5">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            urlTransform={(uri) => uri}
            components={{
              img: ({ ...props }) => {
                const src = props.src;
                if (!src || typeof src !== 'string') return null;
                return (
                  <Image
                    src={src}
                    alt={props.alt || 'Attachment'}
                    width={800}
                    height={600}
                    unoptimized
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      display: 'block',
                    }}
                  />
                );
              },
            }}
          >
            {value || 'Nothing to preview'}
          </ReactMarkdown>
        </div>
      );
    }

    return (
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        placeholder={placeholder}
        className={cn(
          'w-full appearance-none text-sm',
          'custom-scrollbar resize-none',
          'placeholder:text-gray-400 focus:outline-hidden',
          disabled && 'cursor-not-allowed',
        )}
        onChange={(e) => onChange?.(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={id && error ? `${id}-error` : undefined}
        rows={rows}
        readOnly={readOnly}
        disabled={disabled}
      />
    );
  },
);

MarkdownEditor.displayName = 'MarkdownEditor';
