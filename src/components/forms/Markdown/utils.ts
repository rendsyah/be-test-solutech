const mdLineRange = (value: string, start: number, end: number) => {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = value.indexOf('\n', end);
  return {
    start: lineStart,
    end: lineEnd === -1 ? value.length : lineEnd,
  };
};

export const mdApplyToLines = (
  value: string,
  start: number,
  end: number,
  transform: (line: string, index: number) => string,
) => {
  const { start: lineStart, end: lineEnd } = mdLineRange(value, start, end);
  const selected = value.slice(lineStart, lineEnd);

  const lines = selected.split('\n');
  const newLines = lines.map(transform).join('\n');

  const text = value.slice(0, lineStart) + newLines + value.slice(lineEnd);

  return {
    text,
    cursorStart: lineStart,
    cursorEnd: lineStart + newLines.length,
  };
};

export const mdToggleWrap = (
  value: string,
  start: number,
  end: number,
  wrapper: string,
  placeholder: string,
) => {
  const selected = value.slice(start, end) || placeholder;

  const isWrapped =
    value.slice(start - wrapper.length, start) === wrapper &&
    value.slice(end, end + wrapper.length) === wrapper;

  if (isWrapped) {
    return {
      text: value.slice(0, start - wrapper.length) + selected + value.slice(end + wrapper.length),
      cursorStart: start - wrapper.length,
      cursorEnd: end - wrapper.length,
    };
  }

  return {
    text: value.slice(0, start) + wrapper + selected + wrapper + value.slice(end),
    cursorStart: start + wrapper.length,
    cursorEnd: start + wrapper.length + selected.length,
  };
};

export const mdInsertText = (insert: string) => {
  return (value: string, start: number, end: number) => {
    const text = value.slice(0, start) + insert + value.slice(end);

    return {
      text,
      cursorStart: start + insert.length,
      cursorEnd: start + insert.length,
    };
  };
};
