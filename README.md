# DevToolkit Studio ⚡

> **Privacy-First, 100% Client-Side Developer Tools Suite**

DevToolkit Studio is an open-source, ultra-fast web application containing everyday developer utilities. All data conversions, cryptographic calculations, JSON parsing, diffs, and formatting happen **100% locally inside your browser**. Zero data is sent to external servers or telemetry trackers.

Live Demo: [https://praveengudivaka.github.io/dev-tools/](https://praveengudivaka.github.io/dev-tools/)

---

## 🛠️ Included Developer Tools

1. **Epoch / Timestamp Converter**: Human date ↔ Unix Epoch (s/ms/µs), timezone conversion, live clock, relative duration parser.
2. **JWT Decoder & Inspector**: Decode header, payload, signature, check expiration status, formatted JSON view, HMAC key verifier.
3. **Base64 & Data Converter**: Text & File Base64 encode/decode, URL-safe Base64, Hex, Binary, HTML Entities.
4. **JSON Formatter & Validator**: Beautify (2/4 spaces, tab, minified), syntax error highlighting, auto-fixer, TypeScript/Go/Python interface generator.
5. **JSON Interactive Tree**: Expandable/collapsible node tree view, key path copying, search & filter.
6. **JSON Object Diff**: Compare 2 JSON objects, highlight added/deleted/modified keys side-by-side.
7. **Text & File Diff Visualizer**: Side-by-side & unified split view, char/line level diffing, file dropzone comparison.
8. **URL Encoder & Query Parser**: URL encode/decode and interactive query string parameter editor.
9. **Hash & Checksum Generator**: MD5, SHA-1, SHA-256, SHA-512, SHA-3 client-side text & file hashing, HMAC keying.
10. **UUID / ULID / NanoID Generator**: Bulk generator for UUID v4, v1, NanoID, ULID with customizable formatting.
11. **Cron Expression Parser**: Cron breakdown into human readable sentence, schedule visualization for next 10 executions.
12. **YAML ↔ JSON ↔ CSV**: Bi-directional data converter with instant formatting.
13. **SQL Formatter**: Beautifies raw SQL queries with dialect support (PostgreSQL, MySQL, SQLite, T-SQL).
14. **cURL to Code**: Convert cURL requests into JavaScript fetch, Node.js Axios, Python requests, Go HTTP, Rust reqwest.
15. **Regex Tester & Visualizer**: Live regex evaluation against target strings, match group highlighting, common presets cheat sheet.
16. **Color Converter & WCAG**: HEX/RGB/HSL/CMYK conversion, visual color picker, WCAG AA/AAA contrast ratio validator.
17. **String Inspector & Case Converter**: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, URL encode/decode, word/char metrics.
18. **Password & Key Generator**: Random passwords, API keys, secret key generator with customizable entropy & character sets.

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/praveengudivaka/dev-tools.git
cd dev-tools

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## 📦 Publishing to GitHub Pages

### Option 1: Automated GitHub Actions
Pushing to the `main` branch automatically triggers the `.github/workflows/deploy.yml` workflow, building and publishing the site to GitHub Pages.

### Option 2: Manual Deployment Script
```bash
npm run deploy
```

---

## 🛡️ Privacy Guarantee

All processing is executed entirely in your browser using standard JavaScript & Web Crypto APIs. Your tokens, JSON payloads, passwords, and private keys never leave your machine.
