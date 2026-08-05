import React, { useState } from 'react';
import { Copy, Check, Trash2, Sparkles, Download } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  description: string;
  onLoadSample?: () => void;
  onClear?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  downloadFilename?: string;
  extraActions?: React.ReactNode;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  title,
  description,
  onLoadSample,
  onClear,
  onCopy,
  onDownload,
  downloadFilename,
  extraActions,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200/80 dark:border-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {extraActions}

        {onLoadSample && (
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 transition-all shadow-sm"
            title="Load sample test data"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Sample Data
          </button>
        )}

        {onCopy && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-700 transition-all shadow-sm"
            title="Copy output to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
                Copy Result
              </>
            )}
          </button>
        )}

        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-700 transition-all shadow-sm"
            title={downloadFilename ? `Download ${downloadFilename}` : 'Download output'}
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
            Download
          </button>
        )}

        {onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 transition-all shadow-sm"
            title="Clear all fields"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
