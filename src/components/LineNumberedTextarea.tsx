import React, { useRef, useEffect } from 'react';

interface LineNumberedTextareaProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  errorLine?: number | null;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  autoFocus?: boolean;
  className?: string;
}

export const LineNumberedTextarea: React.FC<LineNumberedTextareaProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  rows = 16,
  errorLine = null,
  inputRef,
  autoFocus = false,
  className = '',
}) => {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef || localRef;
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = value ? value.split('\n') : [''];
  const lineCount = Math.max(lines.length, 1);

  // Sync scrolling between textarea and line number gutter
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus, textareaRef]);

  return (
    <div className={`relative flex rounded-2xl glass-input overflow-hidden border border-gray-300 dark:border-gray-800 ${className}`}>
      {/* Line Numbers Gutter */}
      <div
        ref={gutterRef}
        className="w-12 flex-shrink-0 bg-gray-100 dark:bg-gray-950/80 border-r border-gray-200 dark:border-gray-800 text-right py-4 pr-3 font-mono text-xs select-none overflow-hidden text-gray-400 dark:text-gray-600 space-y-0"
        aria-hidden="true"
      >
        {Array.from({ length: lineCount }).map((_, idx) => {
          const lineNumber = idx + 1;
          const isError = errorLine === lineNumber;
          return (
            <div
              key={idx}
              className={`leading-relaxed font-mono ${
                isError
                  ? 'text-red-500 font-bold bg-red-500/20 px-1 rounded -mr-2 text-red-600 dark:text-red-400'
                  : ''
              }`}
            >
              {lineNumber}
            </div>
          );
        })}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        autoFocus={autoFocus}
        className="w-full bg-transparent p-4 text-xs font-mono leading-relaxed resize-y focus:outline-none text-gray-900 dark:text-emerald-300 placeholder-gray-400 dark:placeholder-gray-600"
      />
    </div>
  );
};
