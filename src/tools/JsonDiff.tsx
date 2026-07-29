import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { GitCompare, Plus, Minus, Edit3 } from 'lucide-react';

const JSON_A = `{
  "service": "user-service",
  "version": "1.4.0",
  "port": 8080,
  "features": {
    "auth": true,
    "metrics": true,
    "caching": false
  },
  "database": "postgres"
}`;

const JSON_B = `{
  "service": "user-service",
  "version": "1.5.0",
  "port": 8080,
  "features": {
    "auth": true,
    "metrics": true,
    "caching": true,
    "rateLimit": true
  },
  "database": "postgres",
  "replicas": 3
}`;

export const JsonDiff: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [leftJson, setLeftJson] = useState(JSON_A);
  const [rightJson, setRightJson] = useState(JSON_B);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Compute Object Diff
  const computeDiff = () => {
    try {
      const objA = JSON.parse(leftJson);
      const objB = JSON.parse(rightJson);

      const diffs: { type: 'added' | 'removed' | 'modified' | 'equal'; path: string; valA?: any; valB?: any }[] = [];

      const walk = (a: any, b: any, path: string) => {
        if (a === b) {
          diffs.push({ type: 'equal', path, valA: a, valB: b });
          return;
        }

        if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') {
          diffs.push({ type: 'modified', path, valA: a, valB: b });
          return;
        }

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        const allKeys = Array.from(new Set([...keysA, ...keysB]));

        for (const k of allKeys) {
          const currentPath = path ? `${path}.${k}` : k;
          if (!(k in b)) {
            diffs.push({ type: 'removed', path: currentPath, valA: a[k] });
          } else if (!(k in a)) {
            diffs.push({ type: 'added', path: currentPath, valB: b[k] });
          } else {
            walk(a[k], b[k], currentPath);
          }
        }
      };

      walk(objA, objB, '');
      return { diffs, error: null };
    } catch (err: any) {
      return { diffs: [], error: 'Invalid JSON syntax: ' + err.message };
    }
  };

  const { diffs, error } = computeDiff();

  const addedCount = diffs.filter((d) => d.type === 'added').length;
  const removedCount = diffs.filter((d) => d.type === 'removed').length;
  const modifiedCount = diffs.filter((d) => d.type === 'modified').length;

  return (
    <div className="space-y-6">
      <ToolHeader
        title="JSON Object Diff & Comparator"
        description="Compare two JSON objects and highlight structural differences, added keys, and modified values."
        onLoadSample={() => {
          setLeftJson(JSON_A);
          setRightJson(JSON_B);
        }}
        onClear={() => {
          setLeftJson('');
          setRightJson('');
        }}
      />

      {/* Input JSONs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300">Original JSON (Left / Base)</label>
          <textarea
            ref={inputRef}
            autoFocus
            rows={12}
            value={leftJson}
            onChange={(e) => setLeftJson(e.target.value)}
            placeholder="Paste base JSON here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300">Target JSON (Right / Modified)</label>
          <textarea
            rows={12}
            value={rightJson}
            onChange={(e) => setRightJson(e.target.value)}
            placeholder="Paste modified JSON here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Diff Result Breakdown */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <GitCompare className="w-4 h-4 text-indigo-400" /> Structural Comparison Results
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium">
              <Plus className="w-3.5 h-3.5" /> {addedCount} Added
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 font-medium">
              <Minus className="w-3.5 h-3.5" /> {removedCount} Removed
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-medium">
              <Edit3 className="w-3.5 h-3.5" /> {modifiedCount} Modified
            </span>
          </div>
        </div>

        {error ? (
          <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono">{error}</div>
        ) : (
          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 divide-y divide-gray-800/60 max-h-[450px] overflow-y-auto">
            {diffs
              .filter((d) => d.type !== 'equal')
              .map((diff, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    {diff.type === 'added' && <Plus className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {diff.type === 'removed' && <Minus className="w-4 h-4 text-red-400 flex-shrink-0" />}
                    {diff.type === 'modified' && <Edit3 className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                    <span className="text-gray-200 font-bold">{diff.path}</span>
                  </div>

                  <div className="text-right">
                    {diff.type === 'added' && (
                      <span className="text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                        + {JSON.stringify(diff.valB)}
                      </span>
                    )}
                    {diff.type === 'removed' && (
                      <span className="text-red-300 bg-red-500/10 px-2 py-0.5 rounded line-through">
                        - {JSON.stringify(diff.valA)}
                      </span>
                    )}
                    {diff.type === 'modified' && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-300 bg-red-500/10 px-2 py-0.5 rounded">
                          {JSON.stringify(diff.valA)}
                        </span>
                        <span className="text-gray-500">➔</span>
                        <span className="text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {JSON.stringify(diff.valB)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {diffs.filter((d) => d.type !== 'equal').length === 0 && (
              <div className="py-12 text-center text-gray-500 text-xs">
                Both JSON objects are identical!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
