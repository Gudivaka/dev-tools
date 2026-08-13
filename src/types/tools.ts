import React from 'react';

export type ToolCategory = 'Time & Formatters' | 'Tokens & Security' | 'JSON Utilities' | 'Diffs & Text' | 'Generators & Web';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  iconName: string;
  badge?: string;
  keywords: string[];
}

export const TOOLS: ToolDefinition[] = [
  // Time & Formatters
  {
    id: 'epoch-converter',
    name: 'Epoch Converter',
    category: 'Time & Formatters',
    description: 'Human readable date-time ↔ Unix Epoch (s/ms/µs), live clock, timezone parser',
    iconName: 'Clock',
    badge: 'Popular',
    keywords: ['epoch', 'timestamp', 'date', 'time', 'utc', 'iso', 'unix', 'clock']
  },
  {
    id: 'world-clock-tool',
    name: 'World Clock & Timezone Inspector',
    category: 'Time & Formatters',
    description: 'Analog & Digital clock visualizer with multi-timezone selection and time travel slider',
    iconName: 'Globe',
    keywords: ['clock', 'world clock', 'timezone', 'analog', 'digital', 'est', 'pst', 'ist', 'utc', 'gmt']
  },
  {
    id: 'csv-editor-tool',
    name: 'CSV Data Grid & Table Editor',
    category: 'Time & Formatters',
    description: 'Interactive CSV spreadsheet editor, upload CSV files, add/edit rows & columns, search, and download',
    iconName: 'FileSpreadsheet',
    badge: 'New',
    keywords: ['csv', 'excel', 'table', 'editor', 'spreadsheet', 'grid', 'upload', 'download', 'export', 'rows']
  },
  {
    id: 'base64-converter',
    name: 'Base64 & Data Converter',
    category: 'Time & Formatters',
    description: 'Text & File Base64 encode/decode, Hex, Binary, HTML Entities',
    iconName: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'hex', 'binary', 'html', 'entity', 'data uri']
  },
  {
    id: 'html-entity-converter',
    name: 'HTML Entity Converter',
    category: 'Time & Formatters',
    description: 'Encode/decode special characters to HTML named (&lt;), decimal, and hex entities',
    iconName: 'Code',
    keywords: ['html', 'entity', 'encode', 'decode', 'escape', 'markup', 'special characters']
  },
  {
    id: 'yaml-converter',
    name: 'YAML ↔ JSON ↔ CSV',
    category: 'Time & Formatters',
    description: 'Bi-directional YAML, JSON, and CSV format converter',
    iconName: 'FileCode2',
    keywords: ['yaml', 'json', 'csv', 'converter', 'transform', 'parse']
  },
  {
    id: 'php-serializer',
    name: 'PHP Serializer / Unserializer',
    category: 'Time & Formatters',
    description: 'Convert PHP serialized data strings to JSON objects and vice versa',
    iconName: 'RefreshCcw',
    keywords: ['php', 'serialize', 'unserialize', 'json', 'converter', 'array']
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Time & Formatters',
    description: 'Beautify & format SQL queries (PostgreSQL, MySQL, SQLite, T-SQL)',
    iconName: 'Database',
    keywords: ['sql', 'format', 'beautify', 'postgres', 'mysql', 'query', 'database']
  },
  {
    id: 'curl-converter',
    name: 'cURL to Code',
    category: 'Time & Formatters',
    description: 'Convert cURL commands into JavaScript fetch, Axios, Python, Go, Rust',
    iconName: 'Terminal',
    keywords: ['curl', 'fetch', 'axios', 'python', 'requests', 'go', 'rust', 'http', 'api']
  },

  // Tokens & Security
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Tokens & Security',
    description: 'Decode Header, Payload, Signature, Expiration status & HMAC verifier',
    iconName: 'KeyRound',
    badge: 'Essential',
    keywords: ['jwt', 'token', 'decode', 'auth', 'bearer', 'signature', 'claim', 'header', 'payload']
  },
  {
    id: 'hash-generator',
    name: 'Hash & Checksum Generator',
    category: 'Tokens & Security',
    description: 'Compute MD5, SHA-1, SHA-256, SHA-512, SHA-3 for text and local files',
    iconName: 'ShieldCheck',
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'sha512', 'checksum', 'hmac', 'digest']
  },
  {
    id: 'password-generator',
    name: 'Password & Key Generator',
    category: 'Tokens & Security',
    description: 'Generate secure random passwords, API keys & secrets with custom entropy',
    iconName: 'Lock',
    keywords: ['password', 'key', 'secret', 'entropy', 'random', 'generator', 'api key']
  },

  // JSON Utilities
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'JSON Utilities',
    description: 'Format, minify, validate JSON syntax with line numbers and generate TypeScript/Go/Python types',
    iconName: 'FileJson',
    badge: 'Popular',
    keywords: ['json', 'format', 'beautify', 'minify', 'validate', 'syntax', 'typescript', 'go', 'python']
  },
  {
    id: 'json-viewer',
    name: 'JSON Interactive Tree',
    category: 'JSON Utilities',
    description: 'Expandable/collapsible JSON node tree with key path copying and search',
    iconName: 'FolderTree',
    keywords: ['json', 'tree', 'viewer', 'nodes', 'collapse', 'expand', 'path']
  },
  {
    id: 'json-diff',
    name: 'JSON Object Diff',
    category: 'JSON Utilities',
    description: 'Semantic JSON object comparison with line numbers highlighting added, removed & modified keys',
    iconName: 'GitCompare',
    keywords: ['json', 'diff', 'compare', 'delta', 'object', 'match']
  },
  {
    id: 'es-query-generator',
    name: 'ES Query Generator',
    category: 'JSON Utilities',
    description: 'Interactively build Elasticsearch bool DSL queries, range filters, and aggregations',
    iconName: 'Layers',
    keywords: ['elasticsearch', 'es', 'query', 'dsl', 'search', 'bool', 'must', 'filter', 'aggs']
  },

  // Diffs & Text
  {
    id: 'file-text-diff',
    name: 'Text & File Diff Visualizer',
    category: 'Diffs & Text',
    description: 'Side-by-side & unified split diff visualizer with line/char level highlighting',
    iconName: 'Split',
    keywords: ['diff', 'file diff', 'text diff', 'compare', 'side by side', 'unified', 'changes', 'patch']
  },
  {
    id: 'string-escape',
    name: 'Backslash Escape / Unescape',
    category: 'Diffs & Text',
    description: 'Escape or unescape backslashes (\\n, \\t, \\"), JSON string literals & regex',
    iconName: 'FileCode2',
    keywords: ['escape', 'unescape', 'backslash', 'newline', 'quote', 'string', 'json']
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester & Visualizer',
    category: 'Diffs & Text',
    description: 'Interactive regex pattern evaluator with group capture highlighting & cheat sheet',
    iconName: 'Regex',
    keywords: ['regex', 'pattern', 'match', 'regular expression', 'test', 'replace', 'groups']
  },
  {
    id: 'string-converter',
    name: 'String Inspector & Case Converter',
    category: 'Diffs & Text',
    description: 'camelCase, snake_case, kebab-case, CONSTANT_CASE, URL encode & text stats',
    iconName: 'Type',
    keywords: ['string', 'case', 'camelcase', 'snake_case', 'kebab-case', 'uppercase', 'stats', 'count']
  },

  // Generators & Web
  {
    id: 'network-speed-test',
    name: 'Network Speed Test',
    category: 'Generators & Web',
    description: 'Measure download throughput (Mbps), upload speed, ping latency, and jitter variance',
    iconName: 'Gauge',
    keywords: ['speed', 'network', 'speedtest', 'download', 'upload', 'ping', 'latency', 'mbps', 'bandwidth']
  },
  {
    id: 'html-preview',
    name: 'HTML & CSS Live Preview',
    category: 'Generators & Web',
    description: 'Write HTML, CSS, and JavaScript with live rendered sandbox preview in an iframe',
    iconName: 'Eye',
    keywords: ['html', 'preview', 'css', 'live', 'sandbox', 'editor', 'iframe', 'render']
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder & Query Parser',
    category: 'Generators & Web',
    description: 'Encode/decode URLs and edit query string key-value parameters interactively',
    iconName: 'Link',
    keywords: ['url', 'encode', 'decode', 'query', 'params', 'uri', 'search params']
  },
  {
    id: 'uuid-generator',
    name: 'UUID / ULID Generate & Decode',
    category: 'Generators & Web',
    description: 'Bulk generate UUID v4, v1, NanoID, ULID and decode creation timestamps',
    iconName: 'Fingerprint',
    keywords: ['uuid', 'guid', 'ulid', 'nanoid', 'generator', 'v4', 'bulk', 'decode', 'timestamp']
  },
  {
    id: 'cron-parser',
    name: 'Cron Expression Parser',
    category: 'Generators & Web',
    description: 'Convert cron expressions to plain English and inspect future schedule execution dates in any timezone',
    iconName: 'CalendarClock',
    keywords: ['cron', 'schedule', 'parser', 'cronstrue', 'expression', 'job', 'timer']
  },
  {
    id: 'color-converter',
    name: 'Color Converter & WCAG Checker',
    category: 'Generators & Web',
    description: 'HEX/RGB/HSL/CMYK conversion, visual picker & WCAG AA/AAA contrast calculator',
    iconName: 'Palette',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'cmyk', 'contrast', 'wcag', 'picker', 'accessibility']
  }
];
