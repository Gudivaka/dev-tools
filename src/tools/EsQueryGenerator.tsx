import React, { useState, useEffect, useRef } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { Database, Plus, Trash2, Code2, Sparkles, Layers } from 'lucide-react';

interface Clause {
  id: string;
  boolType: 'must' | 'filter' | 'should' | 'must_not';
  queryType: 'term' | 'match' | 'match_phrase' | 'range' | 'wildcard' | 'exists' | 'terms';
  field: string;
  value: string;
  rangeGte?: string;
  rangeLte?: string;
}

export const EsQueryGenerator: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [indexName, setIndexName] = useState('app-logs-2026');
  const [size, setSize] = useState<number>(50);
  const [from, setFrom] = useState<number>(0);
  const [sortField, setSortField] = useState('@timestamp');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [clauses, setClauses] = useState<Clause[]>([
    {
      id: '1',
      boolType: 'filter',
      queryType: 'range',
      field: '@timestamp',
      value: '',
      rangeGte: 'now-24h',
      rangeLte: 'now',
    },
    {
      id: '2',
      boolType: 'must',
      queryType: 'match',
      field: 'level',
      value: 'ERROR',
    },
    {
      id: '3',
      boolType: 'must_not',
      queryType: 'term',
      field: 'env',
      value: 'test',
    },
  ]);

  // Aggregation State
  const [enableAgg, setEnableAgg] = useState(true);
  const [aggName, setAggName] = useState('top_error_services');
  const [aggType, setAggType] = useState<'terms' | 'date_histogram' | 'cardinality'>('terms');
  const [aggField, setAggField] = useState('service.keyword');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addClause = () => {
    setClauses((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        boolType: 'must',
        queryType: 'match',
        field: '',
        value: '',
      },
    ]);
  };

  const removeClause = (id: string) => {
    setClauses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateClause = (id: string, key: keyof Clause, val: any) => {
    setClauses((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: val } : c)));
  };

  // Generate Elasticsearch Query DSL Object
  const generateDsl = () => {
    const boolObj: any = {
      must: [],
      filter: [],
      should: [],
      must_not: [],
    };

    clauses.forEach((c) => {
      if (!c.field.trim()) return;

      let clauseBody: any = null;

      switch (c.queryType) {
        case 'term':
          clauseBody = { term: { [c.field]: c.value } };
          break;
        case 'terms': {
          const list = c.value.split(',').map((s) => s.trim()).filter(Boolean);
          clauseBody = { terms: { [c.field]: list } };
          break;
        }
        case 'match':
          clauseBody = { match: { [c.field]: c.value } };
          break;
        case 'match_phrase':
          clauseBody = { match_phrase: { [c.field]: c.value } };
          break;
        case 'wildcard':
          clauseBody = { wildcard: { [c.field]: { value: c.value } } };
          break;
        case 'exists':
          clauseBody = { exists: { field: c.field } };
          break;
        case 'range': {
          const rangeBody: any = {};
          if (c.rangeGte) rangeBody.gte = c.rangeGte;
          if (c.rangeLte) rangeBody.lte = c.rangeLte;
          clauseBody = { range: { [c.field]: rangeBody } };
          break;
        }
      }

      if (clauseBody) {
        boolObj[c.boolType].push(clauseBody);
      }
    });

    // Remove empty bool arrays
    Object.keys(boolObj).forEach((k) => {
      if (boolObj[k].length === 0) delete boolObj[k];
    });

    const dsl: any = {
      size,
      from,
      query: {
        bool: boolObj,
      },
    };

    if (sortField.trim()) {
      dsl.sort = [{ [sortField]: { order: sortOrder } }];
    }

    if (enableAgg && aggField.trim()) {
      if (aggType === 'terms') {
        dsl.aggs = {
          [aggName]: {
            terms: { field: aggField, size: 10 },
          },
        };
      } else if (aggType === 'date_histogram') {
        dsl.aggs = {
          [aggName]: {
            date_histogram: { field: aggField, fixed_interval: '1h' },
          },
        };
      } else if (aggType === 'cardinality') {
        dsl.aggs = {
          [aggName]: {
            cardinality: { field: aggField },
          },
        };
      }
    }

    return dsl;
  };

  const dslResult = JSON.stringify(generateDsl(), null, 2);

  // Curl snippet
  const generateCurl = () => {
    return `curl -X POST "http://localhost:9200/${indexName}/_search" \\
  -H "Content-Type: application/json" \\
  -d '${dslResult}'`;
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Elasticsearch Query DSL Generator"
        description="Interactively build complex Elasticsearch bool queries (must, filter, should, must_not), range filters, and aggregations."
        onLoadSample={() => {
          setIndexName('logs-prod-*');
          setSize(100);
          setSortField('@timestamp');
          setSortOrder('desc');
          setClauses([
            { id: '1', boolType: 'filter', queryType: 'range', field: '@timestamp', value: '', rangeGte: 'now-1h', rangeLte: 'now' },
            { id: '2', boolType: 'must', queryType: 'match_phrase', field: 'message', value: 'Connection refused' },
            { id: '3', boolType: 'filter', queryType: 'term', field: 'service.keyword', value: 'auth-service' },
          ]);
        }}
        onClear={() => {
          setClauses([]);
          setIndexName('');
        }}
        onCopy={() => navigator.clipboard.writeText(dslResult)}
        onDownload={() => {
          const blob = new Blob([dslResult], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `es_query_${indexName || 'search'}.json`;
          a.click();
        }}
      />

      {/* Index & Pagination Controls */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
        <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" /> Target Index & Pagination
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1 font-medium">Index Name / Pattern</label>
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={indexName}
              onChange={(e) => setIndexName(e.target.value)}
              placeholder="e.g. logs-app-*"
              className="w-full glass-input px-3 py-1.5 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-medium">Size (Limit)</label>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full glass-input px-3 py-1.5 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-medium">Sort Field</label>
            <input
              type="text"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              placeholder="@timestamp"
              className="w-full glass-input px-3 py-1.5 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-medium">Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              className="w-full glass-input px-3 py-1.5 rounded-xl font-medium"
            >
              <option value="desc">DESC (Descending)</option>
              <option value="asc">ASC (Ascending)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Query Clauses Builder */}
      <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" /> Bool Query Conditions ({clauses.length})
          </h3>
          <button
            onClick={addClause}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Condition
          </button>
        </div>

        <div className="space-y-3">
          {clauses.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex flex-wrap items-center gap-3 text-xs">
              {/* Bool Type Selector */}
              <select
                value={c.boolType}
                onChange={(e: any) => updateClause(c.id, 'boolType', e.target.value)}
                className={`px-2.5 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[11px] ${
                  c.boolType === 'must'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : c.boolType === 'filter'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : c.boolType === 'should'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                <option value="must">MUST (AND)</option>
                <option value="filter">FILTER (Cached)</option>
                <option value="should">SHOULD (OR)</option>
                <option value="must_not">MUST_NOT (NOT)</option>
              </select>

              {/* Query Type */}
              <select
                value={c.queryType}
                onChange={(e: any) => updateClause(c.id, 'queryType', e.target.value)}
                className="glass-input px-2.5 py-1.5 rounded-lg font-mono text-gray-300"
              >
                <option value="match">match</option>
                <option value="match_phrase">match_phrase</option>
                <option value="term">term</option>
                <option value="terms">terms (comma list)</option>
                <option value="range">range</option>
                <option value="wildcard">wildcard</option>
                <option value="exists">exists</option>
              </select>

              {/* Field Name */}
              <input
                type="text"
                placeholder="Field name (e.g. status)"
                value={c.field}
                onChange={(e) => updateClause(c.id, 'field', e.target.value)}
                className="glass-input px-3 py-1.5 rounded-lg font-mono text-indigo-300 w-44"
              />

              {/* Value / Range inputs */}
              {c.queryType === 'range' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="GTE (e.g. now-24h)"
                    value={c.rangeGte || ''}
                    onChange={(e) => updateClause(c.id, 'rangeGte', e.target.value)}
                    className="glass-input px-2.5 py-1.5 rounded-lg font-mono text-emerald-300 w-36"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="text"
                    placeholder="LTE (e.g. now)"
                    value={c.rangeLte || ''}
                    onChange={(e) => updateClause(c.id, 'rangeLte', e.target.value)}
                    className="glass-input px-2.5 py-1.5 rounded-lg font-mono text-emerald-300 w-36"
                  />
                </div>
              ) : c.queryType !== 'exists' ? (
                <input
                  type="text"
                  placeholder="Value to match"
                  value={c.value}
                  onChange={(e) => updateClause(c.id, 'value', e.target.value)}
                  className="glass-input px-3 py-1.5 rounded-lg font-mono text-emerald-300 flex-1 min-w-[180px]"
                />
              ) : null}

              {/* Delete */}
              <button
                onClick={() => removeClause(c.id)}
                className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg ml-auto"
                title="Remove clause"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {clauses.length === 0 && (
            <div className="py-8 text-center text-gray-500 text-xs">
              No conditions added. Click "+ Add Condition" to build your query.
            </div>
          )}
        </div>
      </div>

      {/* Aggregation Control */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={enableAgg}
              onChange={(e) => setEnableAgg(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-950 border-gray-700 text-indigo-500"
            />
            <span>Include Aggregations (aggs)</span>
          </label>
        </div>

        {enableAgg && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">Agg Name</label>
              <input
                type="text"
                value={aggName}
                onChange={(e) => setAggName(e.target.value)}
                className="w-full glass-input px-3 py-1.5 rounded-xl font-mono text-purple-300"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Agg Type</label>
              <select
                value={aggType}
                onChange={(e: any) => setAggType(e.target.value)}
                className="w-full glass-input px-3 py-1.5 rounded-xl font-medium"
              >
                <option value="terms">Terms (Group By Field)</option>
                <option value="date_histogram">Date Histogram (Time Buckets)</option>
                <option value="cardinality">Cardinality (Unique Count)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Target Field</label>
              <input
                type="text"
                value={aggField}
                onChange={(e) => setAggField(e.target.value)}
                className="w-full glass-input px-3 py-1.5 rounded-xl font-mono text-indigo-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" /> Generated ES Query DSL (JSON)
            </label>
            <button
              onClick={() => navigator.clipboard.writeText(dslResult)}
              className="text-[11px] text-indigo-400 hover:underline font-mono"
            >
              Copy JSON
            </button>
          </div>
          <textarea
            rows={16}
            readOnly
            value={dslResult}
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-emerald-300 leading-relaxed bg-gray-950/90"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Equivalent cURL Request Command
            </label>
            <button
              onClick={() => navigator.clipboard.writeText(generateCurl())}
              className="text-[11px] text-indigo-400 hover:underline font-mono"
            >
              Copy cURL
            </button>
          </div>
          <textarea
            rows={16}
            readOnly
            value={generateCurl()}
            className="w-full glass-input p-4 rounded-2xl text-xs font-mono text-indigo-300 leading-relaxed bg-gray-950/90"
          />
        </div>
      </div>
    </div>
  );
};
