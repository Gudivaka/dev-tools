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
    id: 'base64-converter',
    name: 'Base64 & Data Converter',
    category: 'Time & Formatters',
    description: 'Text & File Base64 encode/decode, Hex, Binary, HTML Entities',
    iconName: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'hex', 'binary', 'html', 'entity', 'data uri']
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
    description: 'Format, minify, validate JSON syntax and generate TypeScript/Go/Python types',
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
    description: 'Semantic JSON object comparison highlighting added, removed & modified keys',
    iconName: 'GitCompare',
    keywords: ['json', 'diff', 'compare', 'delta', 'object', 'match']
  },

  // Diffs & Text
  {
    id: 'file-text-diff',
    name: 'Text & File Diff Visualizer',
    category: 'Diffs & Text',
    description: 'Side-by-side & unified split diff visualizer with line/char level highlighting',
    iconName: 'Split',
    badge: 'Popular',
    keywords: ['diff', 'file diff', 'text diff', 'compare', 'side by side', 'unified', 'changes', 'patch']
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
    id: 'url-encoder',
    name: 'URL Encoder & Query Parser',
    category: 'Generators & Web',
    description: 'Encode/decode URLs and edit query string key-value parameters interactively',
    iconName: 'Link',
    keywords: ['url', 'encode', 'decode', 'query', 'params', 'uri', 'search params']
  },
  {
    id: 'uuid-generator',
    name: 'UUID / ULID / NanoID Generator',
    category: 'Generators & Web',
    description: 'Bulk generate UUID v4, v1, NanoID, ULID with customizable formatting',
    iconName: 'Fingerprint',
    keywords: ['uuid', 'guid', 'ulid', 'nanoid', 'generator', 'v4', 'bulk']
  },
  {
    id: 'cron-parser',
    name: 'Cron Expression Parser',
    category: 'Generators & Web',
    description: 'Convert cron expressions to plain English and inspect future schedule execution dates',
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
