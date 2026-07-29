import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Database, Wand2 } from 'lucide-react';
import { format as formatSql } from 'sql-formatter';

const SAMPLE_SQL = `select u.id, u.username, u.email, count(o.id) as total_orders, sum(o.amount) as total_spent from users u left join orders o on u.id = o.user_id where u.created_at >= '2024-01-01' and u.status = 'active' group by u.id, u.username, u.email having count(o.id) > 2 order by total_spent desc limit 50;`;

export const SqlFormatter: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [sqlInput, setSqlInput] = useState(SAMPLE_SQL);
  const [language, setLanguage] = useState<any>('postgresql');
  const [uppercase, setUppercase] = useState(true);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formatQuery = () => {
    if (!sqlInput.trim()) return '';
    try {
      return formatSql(sqlInput, {
        language,
        keywordCase: uppercase ? 'upper' : 'preserve',
        linesBetweenQueries: 2,
      });
    } catch (err: any) {
      return `-- Error formatting SQL: ${err.message}\n${sqlInput}`;
    }
  };

  const formattedResult = formatQuery();

  return (
    <div className="space-y-6">
      <ToolHeader
        title="SQL Formatter & Beautifier"
        description="Format and beautify SQL queries with dialect support for PostgreSQL, MySQL, SQLite, and T-SQL."
        onLoadSample={() => setSqlInput(SAMPLE_SQL)}
        onClear={() => setSqlInput('')}
        onCopy={() => navigator.clipboard.writeText(formattedResult)}
      />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" /> SQL Dialect:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
            <option value="tsql">T-SQL (SQL Server)</option>
            <option value="spark">Spark SQL</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-indigo-500"
          />
          <span>UPPERCASE Keywords</span>
        </label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300">Unformatted SQL</label>
          <textarea
            ref={inputRef}
            autoFocus
            rows={16}
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            placeholder="Paste raw unformatted SQL query here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" /> Formatted SQL Output
          </label>
          <textarea
            rows={16}
            readOnly
            value={formattedResult}
            placeholder="Formatted SQL query will appear here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-300 leading-relaxed bg-gray-950/90"
          />
        </div>
      </div>
    </div>
  );
};
