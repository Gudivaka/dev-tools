import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Table, Plus, Trash2, Download, Upload, Search, FileSpreadsheet, ArrowUpDown, Copy, Code } from 'lucide-react';

interface CsvData {
  headers: string[];
  rows: string[][];
}

const SAMPLE_CSV = `id,name,email,role,status
101,Alice Johnson,alice@example.com,Software Engineer,Active
102,Bob Smith,bob@devtoolkit.org,Product Manager,Active
103,Charlie Davis,charlie@company.com,DevOps Specialist,On Leave
104,Diana Prince,diana@hero.io,Security Analyst,Active`;

// Simple robust CSV parser handling quoted fields & commas
const parseCsvString = (text: string): CsvData => {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentVal.trim());
      if (currentRow.some((c) => c.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some((c) => c.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) {
    return { headers: ['Column 1', 'Column 2'], rows: [['', '']] };
  }

  const headers = lines[0].map((h, i) => h || `Header ${i + 1}`);
  const rows = lines.slice(1).map((r) => {
    // Fill missing column values with empty string
    while (r.length < headers.length) r.push('');
    return r.slice(0, headers.length);
  });

  return { headers, rows };
};

// Escape values into proper CSV format
const stringifyCsv = (headers: string[], rows: string[][]): string => {
  const escapeField = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const headerLine = headers.map(escapeField).join(',');
  const rowLines = rows.map((r) => r.map(escapeField).join(','));
  return [headerLine, ...rowLines].join('\n');
};

export const CsvEditorTool: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<CsvData>(() => parseCsvString(SAMPLE_CSV));
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'code'>('grid');
  const [rawText, setRawText] = useState(() => SAMPLE_CSV);

  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Synchronize rawText when data changes in grid mode
  useEffect(() => {
    if (viewMode === 'grid') {
      setRawText(stringifyCsv(data.headers, data.rows));
    }
  }, [data, viewMode]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setRawText(content);
        setData(parseCsvString(content));
      }
    };
    reader.readAsText(file);
  };

  // Add new column
  const handleAddColumn = () => {
    const newColName = `Column ${data.headers.length + 1}`;
    setData((prev) => ({
      headers: [...prev.headers, newColName],
      rows: prev.rows.map((r) => [...r, '']),
    }));
  };

  // Delete column
  const handleDeleteColumn = (colIdx: number) => {
    if (data.headers.length <= 1) return;
    setData((prev) => ({
      headers: prev.headers.filter((_, idx) => idx !== colIdx),
      rows: prev.rows.map((r) => r.filter((_, idx) => idx !== colIdx)),
    }));
  };

  // Add new row
  const handleAddRow = () => {
    const emptyRow = new Array(data.headers.length).fill('');
    setData((prev) => ({
      ...prev,
      rows: [...prev.rows, emptyRow],
    }));
  };

  // Delete row
  const handleDeleteRow = (rowIdx: number) => {
    setData((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, idx) => idx !== rowIdx),
    }));
  };

  // Edit Header Name
  const handleHeaderChange = (colIdx: number, val: string) => {
    setData((prev) => {
      const nextHeaders = [...prev.headers];
      nextHeaders[colIdx] = val;
      return { ...prev, headers: nextHeaders };
    });
  };

  // Edit Cell Value
  const handleCellChange = (rowIdx: number, colIdx: number, val: string) => {
    setData((prev) => {
      const nextRows = prev.rows.map((r, rI) => {
        if (rI !== rowIdx) return r;
        const nextR = [...r];
        nextR[colIdx] = val;
        return nextR;
      });
      return { ...prev, rows: nextRows };
    });
  };

  // Sort rows
  const handleSort = (colIdx: number) => {
    const asc = sortCol === colIdx ? !sortAsc : true;
    setSortCol(colIdx);
    setSortAsc(asc);

    setData((prev) => {
      const sortedRows = [...prev.rows].sort((a, b) => {
        const valA = a[colIdx] || '';
        const valB = b[colIdx] || '';
        return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
      return { ...prev, rows: sortedRows };
    });
  };

  // Filtered rows for search
  const filteredRows = data.rows.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return r.some((cell) => cell.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Interactive CSV Data Grid & Table Editor"
        description="Create, view, edit, search, and download CSV spreadsheets with inline cell editing and file import/export."
        onLoadSample={() => {
          setRawText(SAMPLE_CSV);
          setData(parseCsvString(SAMPLE_CSV));
        }}
        onClear={() => {
          setData({ headers: ['Header 1', 'Header 2'], rows: [['', '']] });
          setRawText('Header 1,Header 2\n,');
        }}
        onCopy={() => navigator.clipboard.writeText(stringifyCsv(data.headers, data.rows))}
        onDownload={() => {
          const csvContent = stringifyCsv(data.headers, data.rows);
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'edited_dataset.csv';
          link.click();
        }}
      />

      {/* Toolbar Controls */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => {
                setViewMode('grid');
                setData(parseCsvString(rawText));
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" /> Data Grid View
            </button>
            <button
              onClick={() => {
                setViewMode('code');
                setRawText(stringifyCsv(data.headers, data.rows));
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'code' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" /> Raw CSV Text
            </button>
          </div>

          {/* Search Filter */}
          {viewMode === 'grid' && (
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                placeholder="Search rows across table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input pl-8 pr-3 py-1.5 rounded-xl text-xs"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 cursor-pointer font-semibold transition-all border border-gray-700">
              <Upload className="w-3.5 h-3.5 text-indigo-400" /> Upload CSV
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
            </label>

            {viewMode === 'grid' && (
              <>
                <button
                  onClick={handleAddColumn}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Column
                </button>
                <button
                  onClick={handleAddRow}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold border border-emerald-500/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Row
                </button>
              </>
            )}

            <button
              onClick={() => {
                const csvContent = stringifyCsv(data.headers, data.rows);
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'data.csv';
                link.click();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Grid Mode View */}
      {viewMode === 'grid' ? (
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 space-y-3 overflow-x-auto shadow-2xl">
          <div className="flex items-center justify-between text-xs text-gray-400 px-1 font-mono">
            <span>
              Total Rows: <strong className="text-white">{data.rows.length}</strong> | Columns: <strong className="text-white">{data.headers.length}</strong>
            </span>
            {searchQuery && (
              <span className="text-indigo-400 font-semibold">
                Showing {filteredRows.length} matching rows
              </span>
            )}
          </div>

          <table className="w-full border-collapse text-xs font-mono text-left">
            <thead>
              <tr className="bg-gray-950 border-b border-gray-800 text-gray-300">
                <th className="p-2 w-10 text-center text-gray-600 select-none">#</th>
                {data.headers.map((header, colIdx) => (
                  <th key={colIdx} className="p-2 min-w-[150px] border-r border-gray-800/80">
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                        className="bg-transparent font-bold text-indigo-300 focus:outline-none focus:bg-gray-900 px-1.5 py-0.5 rounded w-full"
                      />
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleSort(colIdx)}
                          className="p-1 hover:text-white text-gray-500 rounded"
                          title="Sort Column"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                        {data.headers.length > 1 && (
                          <button
                            onClick={() => handleDeleteColumn(colIdx)}
                            className="p-1 hover:text-red-400 text-gray-600 rounded"
                            title="Delete Column"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
                <th className="p-2 w-12 text-center text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-950/60 transition-colors">
                  <td className="p-2 text-center text-gray-600 select-none">{rowIdx + 1}</td>
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="p-1.5 border-r border-gray-800/60">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                        className="w-full bg-transparent px-2 py-1 text-gray-200 focus:outline-none focus:bg-gray-950 focus:ring-1 focus:ring-indigo-500/50 rounded"
                      />
                    </td>
                  ))}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDeleteRow(rowIdx)}
                      className="p-1 text-gray-600 hover:text-red-400 rounded"
                      title="Delete Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRows.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-xs font-mono">
              No matching CSV rows found for "{searchQuery}".
            </div>
          )}
        </div>
      ) : (
        /* Raw CSV Code Mode */
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 flex items-center justify-between">
            <span>Raw CSV Text Input / Output</span>
            <button
              onClick={() => {
                setData(parseCsvString(rawText));
                setViewMode('grid');
              }}
              className="text-[11px] text-indigo-400 hover:underline"
            >
              Parse & Sync to Grid View ➔
            </button>
          </label>
          <textarea
            rows={18}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setData(parseCsvString(e.target.value));
            }}
            placeholder="Paste or type CSV content here..."
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono leading-relaxed bg-gray-950/90 text-emerald-300"
          />
        </div>
      )}
    </div>
  );
};
