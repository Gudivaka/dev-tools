import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Link, Plus, Trash2, Globe } from 'lucide-react';

const SAMPLE_URL = `https://api.github.com/search/repositories?q=dev-tools+language:typescript&sort=stars&order=desc&page=1`;

export const UrlEncoder: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState(SAMPLE_URL);
  const [encodeMode, setEncodeMode] = useState<'component' | 'uri'>('component');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Parse URL components and Query Params
  const parseUrl = (raw: string) => {
    try {
      const parsed = new URL(raw.trim());
      const params: { key: string; value: string }[] = [];
      parsed.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      return {
        protocol: parsed.protocol,
        host: parsed.host,
        pathname: parsed.pathname,
        params,
        error: null,
      };
    } catch (err: any) {
      return { protocol: '', host: '', pathname: '', params: [], error: 'Invalid URL string' };
    }
  };

  const parsedInfo = parseUrl(urlInput);

  // Encode / Decode Text Functions
  const encodeText = (text: string) => {
    try {
      return encodeMode === 'component' ? encodeURIComponent(text) : encodeURI(text);
    } catch (err: any) {
      return text;
    }
  };

  const decodeText = (text: string) => {
    try {
      return encodeMode === 'component' ? decodeURIComponent(text) : decodeURI(text);
    } catch (err: any) {
      return text;
    }
  };

  // Add parameter to URL
  const handleAddParam = () => {
    try {
      const u = new URL(urlInput);
      u.searchParams.append('new_param', 'value');
      setUrlInput(u.toString());
    } catch (err) {
      setUrlInput(urlInput + (urlInput.includes('?') ? '&' : '?') + 'new_param=value');
    }
  };

  // Update query param
  const handleUpdateParam = (index: number, newKey: string, newVal: string) => {
    try {
      const u = new URL(urlInput);
      const params: { key: string; value: string }[] = [];
      u.searchParams.forEach((v, k) => params.push({ key: k, value: v }));

      params[index] = { key: newKey, value: newVal };

      const newUrl = `${u.origin}${u.pathname}`;
      const search = params.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
      setUrlInput(`${newUrl}?${search}`);
    } catch (err) {
      // Fallback
    }
  };

  // Delete parameter
  const handleDeleteParam = (index: number) => {
    try {
      const u = new URL(urlInput);
      const params: { key: string; value: string }[] = [];
      u.searchParams.forEach((v, k) => params.push({ key: k, value: v }));
      params.splice(index, 1);

      const search = params.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
      setUrlInput(`${u.origin}${u.pathname}${search ? '?' + search : ''}`);
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="URL Encoder / Decoder & Query String Parser"
        description="Encode/decode URLs and inspect or edit query string parameters interactively."
        onLoadSample={() => setUrlInput(SAMPLE_URL)}
        onClear={() => setUrlInput('')}
        onCopy={() => navigator.clipboard.writeText(urlInput)}
      />

      {/* URL Input Bar */}
      <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-3 shadow-sm">
        <label className="block text-xs font-semibold text-slate-800 dark:text-gray-300 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Enter Full URL or String
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/api?param=value"
            className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono"
          />
          <button
            onClick={() => setUrlInput(encodeText(urlInput))}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm whitespace-nowrap"
          >
            Encode
          </button>
          <button
            onClick={() => setUrlInput(decodeText(urlInput))}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-700 whitespace-nowrap shadow-sm"
          >
            Decode
          </button>
        </div>
      </div>

      {/* Query Parameters Table */}
      {parsedInfo.params.length > 0 && (
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-800 dark:text-gray-200 flex items-center gap-2">
              <Link className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Query String Parameters ({parsedInfo.params.length})
            </h3>
            <button
              onClick={handleAddParam}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Param
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 font-sans">
                  <th className="py-2 px-3">Key</th>
                  <th className="py-2 px-3">Value</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60">
                {parsedInfo.params.map((param, index) => (
                  <tr key={index}>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={param.key}
                        onChange={(e) => handleUpdateParam(index, e.target.value, param.value)}
                        className="w-full glass-input px-2 py-1 rounded text-xs font-mono text-indigo-700 dark:text-indigo-300"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={param.value}
                        onChange={(e) => handleUpdateParam(index, param.key, e.target.value)}
                        className="w-full glass-input px-2 py-1 rounded text-xs font-mono text-emerald-700 dark:text-emerald-300"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => handleDeleteParam(index)}
                        className="p-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20"
                        title="Delete parameter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
