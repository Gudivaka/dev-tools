import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Regex, CheckCircle2, AlertCircle } from 'lucide-react';

const SAMPLE_REGEX = `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}`;
const SAMPLE_TEST_TEXT = `Reach out to support@example.com or john.doe123@dev-toolkit.org for assistance.
Invalid emails: plainaddress, @missinguser.com, user@.com`;

export const RegexTester: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pattern, setPattern] = useState(SAMPLE_REGEX);
  const [testText, setTestText] = useState(SAMPLE_TEST_TEXT);
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Compute Regex Matches
  const testRegex = () => {
    if (!pattern) return { matches: [], error: null };

    try {
      const flagStr = Object.entries(flags)
        .filter(([, active]) => active)
        .map(([flag]) => flag)
        .join('');

      const regex = new RegExp(pattern, flagStr);
      const matches: { index: number; text: string; groups: string[] }[] = [];

      if (flags.g) {
        let match;
        while ((match = regex.exec(testText)) !== null) {
          matches.push({
            index: match.index,
            text: match[0],
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          matches.push({
            index: match.index,
            text: match[0],
            groups: match.slice(1),
          });
        }
      }

      return { matches, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  };

  const { matches, error } = testRegex();

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Regex Tester & Visualizer"
        description="Test regular expression patterns against target text with live match highlights, capture groups, and presets."
        onLoadSample={() => {
          setPattern(SAMPLE_REGEX);
          setTestText(SAMPLE_TEST_TEXT);
        }}
        onClear={() => {
          setPattern('');
          setTestText('');
        }}
      />

      {/* Pattern & Flags Bar */}
      <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-3 shadow-sm">
        <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300 flex items-center gap-2">
          <Regex className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Regular Expression Pattern
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-slate-400 dark:text-gray-500 font-mono text-sm">/</span>
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. [a-z]+"
              className="w-full glass-input pl-6 pr-3 py-2 rounded-xl text-sm font-mono text-indigo-700 dark:text-indigo-300"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 dark:text-gray-500 font-mono text-sm">
              /{Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('')}
            </span>
          </div>

          {/* Flags Toggles */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-950 p-1.5 rounded-xl border border-slate-200 dark:border-gray-800 text-xs">
            {Object.keys(flags).map((flag) => (
              <label key={flag} className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={(flags as any)[flag]}
                  onChange={(e) => setFlags({ ...flags, [flag]: e.target.checked })}
                  className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-gray-900 border-slate-300 dark:border-gray-700 text-indigo-600 focus:ring-0"
                />
                <span className="font-mono text-slate-700 dark:text-gray-300 uppercase">{flag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Common Presets Cheat Sheet */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-slate-500 dark:text-gray-400 font-medium py-1">Presets:</span>
        {[
          { name: 'Email Address', regex: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}` },
          { name: 'IPv4 Address', regex: `(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)` },
          { name: 'URL', regex: `https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)` },
          { name: 'Hex Color', regex: `#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})` },
          { name: 'UUID v4', regex: `[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}` },
        ].map((p) => (
          <button
            key={p.name}
            onClick={() => setPattern(p.regex)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 transition-all shadow-sm"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300">Test Target Text</label>
          <textarea
            rows={12}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Paste text to test pattern against..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed shadow-sm"
          />
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300">Match Results</label>
            {error ? (
              <span className="flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Pattern Error
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> {matches.length} Matches Found
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-950 border border-slate-200/80 dark:border-gray-800 space-y-2 max-h-[350px] overflow-y-auto font-mono text-xs shadow-sm">
            {error ? (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-mono">{error}</div>
            ) : matches.length === 0 ? (
              <div className="text-slate-400 dark:text-gray-500 py-12 text-center">No matches found for current pattern</div>
            ) : (
              matches.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-[11px]">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Match #{idx + 1}</span>
                    <span>Index: {m.index}</span>
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-300 font-bold break-all bg-white dark:bg-gray-950 p-2 rounded-lg border border-slate-200 dark:border-gray-800">
                    "{m.text}"
                  </div>
                  {m.groups.length > 0 && (
                    <div className="text-[11px] text-purple-700 dark:text-purple-300 pt-1">
                      Groups: {m.groups.map((g, gi) => `$${gi + 1}: "${g}"`).join(', ')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
