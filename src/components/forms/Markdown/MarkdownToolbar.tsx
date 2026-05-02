import { Fragment, useRef } from 'react';

import { PaperClipIcon, StrikeThroughIcon } from '@/components/icons';
import { BoldIcon } from '@/components/icons/Bold';
import { CodeBracketIcon } from '@/components/icons/CodeBracket';
import { HeadingIcon } from '@/components/icons/Heading';
import { ItalicIcon } from '@/components/icons/Italic';
import { LinkIcon } from '@/components/icons/Link';
import { ListIcon } from '@/components/icons/List';
import { ListOrderedIcon } from '@/components/icons/ListOrdered';
import { ListTodoIcon } from '@/components/icons/ListTodo';
import { QuoteIcon } from '@/components/icons/Quote';
import { IconButton, Tooltip } from '@/components/ui';

import { mdApplyToLines, mdToggleWrap } from './utils';

type ToolbarAction = (
  value: string,
  selectionStart: number,
  selectionEnd: number,
) => {
  text: string;
  cursorStart: number;
  cursorEnd: number;
};

type ToolbarItem = {
  id: string;
  label: React.ReactNode;
  title: string;
  separator?: boolean;
  action?: ToolbarAction;
};

export const TOOLBAR_ITEMS: ToolbarItem[] = [
  {
    id: 'heading',
    label: <HeadingIcon className="size-4 stroke-2" />,
    title: 'Heading',
    action: (value, start, end) =>
      mdApplyToLines(value, start, end, (line) => {
        const match = line.match(/^(#{1,6})\s/);
        if (!match) return `# ${line}`;
        const level = match[1].length;

        if (level >= 3) {
          return line.replace(/^#{1,6}\s/, '');
        }

        return line.replace(/^#{1,6}\s/, '#'.repeat(level + 1) + ' ');
      }),
  },
  {
    id: 'bold',
    label: <BoldIcon className="size-4 stroke-2" />,
    title: 'Bold',
    action: (v, s, e) => mdToggleWrap(v, s, e, '**', 'bold text'),
  },
  {
    id: 'italic',
    label: <ItalicIcon className="size-4 stroke-2" />,
    title: 'Italic',
    action: (v, s, e) => mdToggleWrap(v, s, e, '_', 'italic text'),
  },
  {
    id: 'strike',
    label: <StrikeThroughIcon className="size-4 stroke-2" />,
    title: 'Strike',
    action: (v, s, e) => mdToggleWrap(v, s, e, '~~', 'strike text'),
  },
  {
    id: 'code',
    label: <CodeBracketIcon className="size-4 stroke-2" />,
    title: 'Code',
    action: (v, s, e) => mdToggleWrap(v, s, e, '`', 'code'),
  },
  {
    id: 'quote',
    label: <QuoteIcon className="size-4 stroke-2" />,
    title: 'Quote',
    action: (value, start, end) =>
      mdApplyToLines(value, start, end, (line) =>
        line.startsWith('> ') ? line.slice(2) : `> ${line}`,
      ),
  },
  {
    id: 'numbered_list',
    label: <ListOrderedIcon className="size-4.5 stroke-2" />,
    title: 'Numbered List',
    separator: true,
    action: (value, start, end) =>
      mdApplyToLines(value, start, end, (line, i) =>
        /^\d+\.\s/.test(line) ? line.replace(/^\d+\.\s/, '') : `${i + 1}. ${line}`,
      ),
  },
  {
    id: 'unordered_list',
    label: <ListIcon className="size-4.5 stroke-2" />,
    title: 'Unordered List',
    action: (value, start, end) =>
      mdApplyToLines(value, start, end, (line) =>
        line.startsWith('- ') ? line.slice(2) : `- ${line}`,
      ),
  },
  {
    id: 'task_list',
    label: <ListTodoIcon className="size-4.5 stroke-2" />,
    title: 'Task List',
    action: (value, start, end) =>
      mdApplyToLines(value, start, end, (line) =>
        line.startsWith('- [ ] ') ? line.slice(6) : `- [ ] ${line}`,
      ),
  },
  {
    id: 'link',
    label: <LinkIcon className="size-4 stroke-2" />,
    title: 'Link',
    action: (value, start, end) => {
      const selected = value.slice(start, end) || 'link text';
      const insert = `[${selected}](url)`;
      const text = value.slice(0, start) + insert + value.slice(end);

      return {
        text,
        cursorStart: start + selected.length + 3,
        cursorEnd: start + selected.length + 6,
      };
    },
  },
  {
    id: 'file',
    label: <PaperClipIcon className="size-4 stroke-2" />,
    title: 'Attach File',
    separator: true,
  },
];

type MarkdownToolbarProps = {
  onAction: (action: ToolbarItem['action']) => void;
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
};

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  onAction,
  onFileSelect,
  disabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect?.(file);
    e.target.value = '';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>, item: ToolbarItem) => {
    e.preventDefault();
    if (item.action) {
      onAction(item.action);
      return;
    }
    if (item.id === 'file') fileInputRef.current?.click();
  };

  return (
    <>
      <div className="justify-end flex flex-1 py-1 px-2">
        {TOOLBAR_ITEMS.map((item) => (
          <Fragment key={item.id}>
            {item.separator && <div className="w-px h-4 bg-gray-300 mx-2 self-center" />}
            <Tooltip content={item.title} position="bottom">
              <IconButton
                className="hover:bg-gray-200"
                onMouseDown={(e) => handleMouseDown(e, item)}
                disabled={disabled}
              >
                {item.label}
              </IconButton>
            </Tooltip>
          </Fragment>
        ))}
      </div>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleChangeFile} />
    </>
  );
};
