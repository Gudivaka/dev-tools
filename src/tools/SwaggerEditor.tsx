import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ToolHeader } from '../components/ToolHeader';
import { AlertTriangle, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import YAML from 'yaml';

const SAMPLE_SPEC = `openapi: 3.0.3
info:
  title: Pet Store API
  version: 1.0.0
  description: A sample API for managing pets.
servers:
  - url: https://api.example.com/v1
tags:
  - name: pets
    description: Everything about pets
paths:
  /pets:
    get:
      tags: [pets]
      summary: List all pets
      operationId: listPets
      parameters:
        - name: limit
          in: query
          description: Max items to return
          required: false
          schema:
            type: integer
      responses:
        '200':
          description: A list of pets
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
    post:
      tags: [pets]
      summary: Create a pet
      operationId: createPet
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
      responses:
        '201':
          description: Created
  /pets/{petId}:
    get:
      tags: [pets]
      summary: Get a pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: The pet
        '404':
          description: Not found
components:
  schemas:
    Pet:
      type: object
      required: [id, name]
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
`;

const METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
const METHOD_COLORS: Record<string, string> = {
  get: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30',
  post: 'bg-green-500/15 text-green-600 dark:text-green-300 border-green-500/30',
  put: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30',
  patch: 'bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/30',
  delete: 'bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30',
};

const parseSpec = (text: string): { spec: any; error: string | null } => {
  if (!text.trim()) return { spec: null, error: null };
  try {
    return { spec: YAML.parse(text), error: null };
  } catch (e: any) {
    return { spec: null, error: e.message || 'Invalid YAML/JSON' };
  }
};

const validate = (spec: any): string[] => {
  const issues: string[] = [];
  if (!spec || typeof spec !== 'object') return ['Spec must be an object'];
  const isV3 = typeof spec.openapi === 'string';
  const isV2 = spec.swagger === '2.0';
  if (!isV3 && !isV2) issues.push("Missing 'openapi' (3.x) or 'swagger: \"2.0\"' version field");
  if (!spec.info) issues.push("Missing required 'info' object");
  else {
    if (!spec.info.title) issues.push("'info.title' is required");
    if (!spec.info.version) issues.push("'info.version' is required");
  }
  if (!spec.paths || typeof spec.paths !== 'object') issues.push("Missing required 'paths' object");
  const ids = new Set<string>();
  Object.entries(spec.paths || {}).forEach(([path, item]: [string, any]) => {
    if (!path.startsWith('/')) issues.push(`Path '${path}' must start with '/'`);
    const tmpl = (path.match(/\{([^}]+)\}/g) || []).map((p) => p.slice(1, -1));
    METHODS.forEach((m) => {
      const op = item?.[m];
      if (!op) return;
      if (!op.responses) issues.push(`${m.toUpperCase()} ${path}: 'responses' is required`);
      if (op.operationId) {
        if (ids.has(op.operationId)) issues.push(`Duplicate operationId '${op.operationId}'`);
        ids.add(op.operationId);
      }
      const params = [...(item.parameters || []), ...(op.parameters || [])];
      tmpl.forEach((name) => {
        if (!params.some((p: any) => p.name === name && p.in === 'path'))
          issues.push(`${m.toUpperCase()} ${path}: path parameter '${name}' not declared`);
      });
    });
  });
  // Unresolved local $refs
  const walk = (node: any) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') {
      if (typeof node.$ref === 'string' && node.$ref.startsWith('#/')) {
        let cur: any = spec;
        for (const seg of node.$ref.slice(2).split('/')) cur = cur?.[seg.replace(/~1/g, '/').replace(/~0/g, '~')];
        if (cur === undefined) issues.push(`Unresolved $ref ${node.$ref}`);
      }
      Object.values(node).forEach(walk);
    }
  };
  walk(spec);
  return issues;
};

const refName = (s: any): string => {
  if (!s) return '';
  if (s.$ref) return s.$ref.split('/').pop();
  if (s.type === 'array') return `${refName(s.items) || 'any'}[]`;
  return s.type ? `${s.type}${s.format ? `(${s.format})` : ''}` : 'object';
};

export const SwaggerEditor: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(SAMPLE_SPEC);
  useEffect(() => inputRef.current?.focus(), []);

  const { spec, error } = useMemo(() => parseSpec(text), [text]);
  const issues = useMemo(() => (spec ? validate(spec) : []), [spec]);

  const operations = useMemo(() => {
    const groups: Record<string, any[]> = {};
    Object.entries(spec?.paths || {}).forEach(([path, item]: [string, any]) =>
      METHODS.forEach((m) => {
        const op = item?.[m];
        if (!op) return;
        const params = [...(item.parameters || []), ...(op.parameters || [])];
        (op.tags?.length ? op.tags : ['default']).forEach((t: string) =>
          (groups[t] ||= []).push({ method: m, path, op, params })
        );
      })
    );
    return groups;
  }, [spec]);

  const convert = () => {
    if (!spec) return;
    const t = text.trim();
    setText(t.startsWith('{') ? YAML.stringify(spec) : JSON.stringify(spec, null, 2));
  };

  const schemas = spec?.components?.schemas || spec?.definitions || {};

  return (
    <div className="space-y-4">
      <ToolHeader
        title="Swagger / OpenAPI Editor"
        description="Edit OpenAPI 3.x / Swagger 2.0 specs in YAML or JSON with live validation and documentation preview"
        onLoadSample={() => setText(SAMPLE_SPEC)}
        onClear={() => setText('')}
        onCopy={() => navigator.clipboard.writeText(text)}
        onDownload={() => {
          const isJson = text.trim().startsWith('{');
          const blob = new Blob([text], { type: 'text/plain' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = isJson ? 'openapi.json' : 'openapi.yaml';
          a.click();
          URL.revokeObjectURL(a.href);
        }}
        extraActions={
          <button
            onClick={convert}
            disabled={!spec}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white disabled:opacity-40"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> YAML ⇄ JSON
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            className="w-full h-[70vh] font-mono text-xs p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
            placeholder="Paste an OpenAPI / Swagger spec (YAML or JSON)..."
          />
          <div
            className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${
              error || issues.length
                ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300'
                : 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-300'
            }`}
          >
            {error || issues.length ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <div className="min-w-0">
              {error ? (
                <span className="break-words">Parse error: {error}</span>
              ) : issues.length ? (
                <ul className="list-disc pl-4">{issues.map((i, k) => <li key={k}>{i}</li>)}</ul>
              ) : (
                <span>{spec ? 'Spec looks valid (structural checks)' : 'Waiting for input'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="h-[70vh] overflow-y-auto rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 space-y-5">
          {!spec ? (
            <p className="text-sm text-gray-400">Preview appears here.</p>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-bold">
                  {spec.info?.title || 'Untitled'}{' '}
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{spec.info?.version}</span>
                </h2>
                {spec.info?.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{spec.info.description}</p>}
                {(spec.servers || []).map((s: any, i: number) => (
                  <div key={i} className="text-xs font-mono text-gray-500 mt-1">{s.url}</div>
                ))}
                {spec.host && <div className="text-xs font-mono text-gray-500 mt-1">{spec.host}{spec.basePath}</div>}
              </div>

              {Object.entries(operations).map(([tag, ops]) => (
                <section key={tag}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{tag}</h3>
                  <div className="space-y-2">
                    {ops.map(({ method, path, op, params }, i) => (
                      <details key={i} className={`rounded-lg border ${METHOD_COLORS[method] || 'border-gray-500/30'}`}>
                        <summary className="cursor-pointer px-3 py-2 flex items-center gap-2 text-xs">
                          <span className="font-bold uppercase w-14">{method}</span>
                          <span className="font-mono">{path}</span>
                          <span className="text-gray-500 dark:text-gray-400 truncate">{op.summary}</span>
                        </summary>
                        <div className="px-3 pb-3 text-xs space-y-2 text-gray-700 dark:text-gray-300">
                          {op.description && <p>{op.description}</p>}
                          {params.length > 0 && (
                            <div>
                              <div className="font-semibold">Parameters</div>
                              {params.map((p: any, k: number) => (
                                <div key={k} className="font-mono">
                                  {p.name} <span className="text-gray-400">({p.in}{p.required ? ', required' : ''}) {refName(p.schema || p)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {op.requestBody && (
                            <div>
                              <div className="font-semibold">Request body</div>
                              {Object.entries(op.requestBody.content || {}).map(([mt, v]: [string, any]) => (
                                <div key={mt} className="font-mono">{mt} → {refName(v.schema)}</div>
                              ))}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold">Responses</div>
                            {Object.entries(op.responses || {}).map(([code, r]: [string, any]) => (
                              <div key={code} className="font-mono">
                                {code} <span className="text-gray-400">{r?.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              ))}

              {Object.keys(schemas).length > 0 && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Schemas</h3>
                  {Object.entries(schemas).map(([name, s]: [string, any]) => (
                    <details key={name} className="mb-2 rounded-lg border border-gray-200 dark:border-gray-800">
                      <summary className="cursor-pointer px-3 py-2 text-xs font-mono font-semibold">{name}</summary>
                      <div className="px-3 pb-3 text-xs font-mono space-y-0.5">
                        {Object.entries(s.properties || {}).map(([pn, ps]: [string, any]) => (
                          <div key={pn}>
                            {pn}{(s.required || []).includes(pn) ? '*' : ''}: <span className="text-gray-400">{refName(ps)}</span>
                          </div>
                        ))}
                        {!s.properties && <div className="text-gray-400">{refName(s)}</div>}
                      </div>
                    </details>
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
