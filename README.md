# DevToolkit Studio ⚡

> **Privacy-First, 100% Client-Side Developer Tools Suite**

DevToolkit Studio is an open-source, ultra-fast, privacy-focused web application containing everyday developer utilities. All data conversions, cryptographic calculations, JSON parsing, diffs, Elasticsearch DSL generation, world clocks, CSV editing, network speed tests, and formatting happen **100% locally inside your browser**. Zero data is sent to external servers or telemetry trackers.

Live Web App: **[https://gudivaka.github.io/dev-tools/](https://gudivaka.github.io/dev-tools/)**

---

## 🛠️ Included 26 Developer Tools

### 🕒 Time & Data Converters
1. **Epoch / Timestamp Converter**: Human date ↔ Unix Epoch (s/ms/µs), timezone conversion, live clock, relative duration parser.
2. **World Clock & Timezone Inspector**: Analog & Digital clock visualizer with multi-timezone selection, sun/moon indicators, and time travel slider.
3. **CSV Data Grid & Table Editor**: Interactive CSV spreadsheet editor, upload CSV files, add/edit rows & columns, search, and download.
4. **Base64 & Data Converter**: Text & File Base64 encode/decode, URL-safe Base64, Hex, Binary, HTML Entities with image/file previews.
5. **HTML Entity Converter**: Convert special characters & markup into HTML named (`&amp;`), decimal (`&#38;`), and hex (`&#x26;`) entities.
6. **YAML ↔ JSON ↔ CSV**: Bi-directional data converter with instant formatting & validation.
7. **PHP Serializer / Unserializer**: Convert PHP serialized data (`a:3:{...}`) ↔ formatted JSON objects.
8. **SQL Formatter**: Beautify raw SQL queries with dialect support (PostgreSQL, MySQL, SQLite, T-SQL, Spark SQL).
9. **cURL to Code**: Convert cURL command lines into JavaScript `fetch`, `axios`, Python `requests`, Go HTTP, Rust `reqwest`.

### 🔐 Security & Tokens
10. **JWT Decoder & Inspector**: Decode header, payload, signature, check expiration status, formatted JSON view, HMAC key verifier.
11. **Hash & Checksum Generator**: MD5, SHA-1, SHA-256, SHA-512, SHA-3 client-side text & local file hashing, HMAC keying.
12. **Password & Key Generator**: Cryptographically secure random passwords, API keys, secret key generator with entropy meter.

### 📦 JSON & Search Utilities
13. **JSON Formatter & Validator**: Beautify (2/4 spaces, tab, minified), syntax error highlighting with line-number gutter, auto-fixer, TypeScript/Go/Python interface generator.
14. **JSON Interactive Tree**: Expandable/collapsible node tree view, key path copying, search & filter.
15. **JSON Object Diff**: Compare 2 JSON objects with line-number gutter, highlight added/deleted/modified keys side-by-side.
16. **Elasticsearch Query Generator**: Interactively build ES bool DSL queries (`must`, `filter`, `should`, `must_not`), range filters, aggregations, and cURL requests.

### 📝 Diffs & Text Utilities
17. **Text & File Diff Visualizer**: Side-by-side & unified split view, char/line level diffing, file dropzone comparison.
18. **Backslash Escape / Unescape**: Escape/unescape backslashes (`\n`, `\t`, `\"`), JSON string literals, and regex special characters.
19. **Regex Tester & Visualizer**: Live regex evaluation against target strings, match group highlighting, common presets cheat sheet.
20. **String Inspector & Case Converter**: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, text metrics & word count.

### 🌐 Web & Generators
21. **Network Speed Test**: Real-time browser download speed (Mbps), upload throughput, ping latency, and jitter variance inspector.
22. **HTML & CSS Live Sandbox Preview**: Write HTML, CSS, and JavaScript with live rendered sandbox preview in an isolated iframe.
23. **URL Encoder & Query Parser**: URL encode/decode and interactive query string parameter editor table.
24. **UUID / ULID Generator & Decoder**: Bulk generator for UUID v4, v1, NanoID, ULID + decode creation timestamps from ULIDs/UUIDs.
25. **Cron Expression Parser**: Cron breakdown into human readable sentence, schedule visualization for next 10 executions in any timezone.
26. **Color Converter & WCAG**: HEX/RGB/HSL/CMYK conversion, visual picker & WCAG AA/AAA contrast ratio validator.

---

## ⚡ Ergonomics & Features

- **Interactive CSV Editor**: Upload `.csv` files, add/edit/delete rows and columns inline, sort by column, filter rows, and download updated CSV.
- **Line-Numbered Editor Gutter & Error Pinpointing**: Textareas in JSON Formatter and JSON Diff display line numbers and highlight failing syntax lines in red.
- **Auto-Active Cursor Focus**: Instant focus on primary input fields when opening any tool.
- **Global Command Palette (`Cmd+K` / `Ctrl+K`)**: Search and jump to any developer tool instantly.
- **Favorites Pinning**: Star your most used tools to keep them pinned to top sidebar navigation.
- **Zero Server Telemetry**: All data remains 100% private inside your browser.

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/Gudivaka/dev-tools.git
cd dev-tools

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## 📦 Publishing to GitHub Pages

```bash
# Push latest code to main and deploy build to gh-pages branch
npm run build && git add . && git commit -m "feat: updates" && git push origin main && npm run deploy
```

---

## 🛡️ Privacy Guarantee

All processing is executed entirely in your browser using standard JavaScript & Web Crypto APIs. Your tokens, JSON payloads, passwords, and private keys never leave your machine.
