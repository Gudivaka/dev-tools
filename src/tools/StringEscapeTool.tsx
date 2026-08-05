import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';

const SAMPLE_ESCAPE_TEXT = `Line 1 with "double quotes" & 'single quotes'.\nLine 2 with \t tabs & \\ backslashes.`;

export const StringEscapeTool: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputText, setInputText] = useState(SAMPLE_ESCAPE_TEXT);
  const [direction, setDirection] = useState<'escape' | 'unescape'>('escape');
  const [mode, setMode] = useState<'backslash' | 'json' | 'regex'>('backslash');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const escapeString = (str: string) => {
    if (!str) return '';
    if (mode === 'json') {
      return JSON.stringify(str);
    }
    if (mode === 'regex') {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    // Standard backslash escape
    return str
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'");
  };

  const unescapeString = (str: string) => {
    if (!str) return '';
    if (mode === 'json') {
      try {
        return JSON.parse(str);
      } catch (err) {
        return str;
      }
    }
    // Standard backslash unescape
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\');
  };

  const outputText = direction === 'escape' ? escapeString(inputText) : unescapeString(inputText);

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Backslash Escape & Unescape Tool"
        description='Escape or unescape special characters, newlines (\n), tabs (\t), quotes ("), and JSON string literals.'
        onLoadSample={() => {
          setDirection('escape');
          setInputText(SAMPLE_ESCAPE_TEXT);
        }}
        onClear={() => setInputText('')}
        onCopy={() => navigator.clipboard.writeText(outputText)}
      />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection('escape')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              direction === 'escape' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
            }`}
          >
            Escape String
          </button>
          <button
            onClick={() => setDirection('unescape')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              direction === 'unescape' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
            }`}
          >
            Unescape String
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-950 p-1 rounded-xl border border-slate-200 dark:border-gray-800 text-xs">
          <button
            onClick={() => setMode('backslash')}
            className={`px-3 py-1 rounded-lg transition-all ${mode === 'backslash' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400'}`}
          >
            Backslash (\n, \t, \")
          </button>
          <button
            onClick={() => setMode('json')}
            className={`px-3 py-1 rounded-lg transition-all ${mode === 'json' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400'}`}
          >
            JSON String Literal
          </button>
          <button
            onClick={() => setMode('regex')}
            className={`px-3 py-1 rounded-lg transition-all ${mode === 'regex' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400'}`}
          >
            Regex Special Characters
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300">
            Input ({direction === 'escape' ? 'Raw String' : 'Escaped String'})
          </label>
          <textarea
            ref={inputRef}
            autoFocus
            rows={14}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste string here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300">
            Result ({direction === 'escape' ? 'Escaped String' : 'Unescaped Raw Text'})
          </label>
          <textarea
            rows={14}
            readOnly
            value={outputText}
            placeholder="Result will appear here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-700 dark:text-emerald-300 leading-relaxed bg-slate-50/90 dark:bg-gray-950/90 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
