# DevToolkit Studio ⚡

> **Privacy-First, 100% Client-Side Developer Tools Suite**

DevToolkit Studio is an open-source, ultra-fast, privacy-focused web application containing everyday developer utilities. All data conversions, cryptographic calculations, JSON parsing, diffs, Elasticsearch DSL generation, and formatting happen **100% locally inside your browser**. Zero data is sent to external servers or telemetry trackers.

Live Web App: **[https://gudivaka.github.io/dev-tools/](https://gudivaka.github.io/dev-tools/)**

---

## 🛠️ Included 23 Developer Tools

### 🕒 Time & Data Converters
1. **Epoch / Timestamp Converter**: Human date ↔ Unix Epoch (s/ms/µs), timezone conversion, live clock, relative duration parser.
2. **Base64 & Data Converter**: Text & File Base64 encode/decode, URL-safe Base64, Hex, Binary, HTML Entities with image/file previews.
3. **HTML Entity Converter**: Convert special characters & markup into HTML named (`&amp;`), decimal (`&#38;`), and hex (`&#x26;`) entities.
4. **YAML ↔ JSON ↔ CSV**: Bi-directional data converter with instant formatting & validation.
5. **PHP Serializer / Unserializer**: Convert PHP serialized data (`a:3:{...}`) ↔ formatted JSON objects.
6. **SQL Formatter**: Beautify raw SQL queries with dialect support (PostgreSQL, MySQL, SQLite, T-SQL, Spark SQL).
7. **cURL to Code**: Convert cURL command lines into JavaScript `fetch`, `axios`, Python `requests`, Go HTTP, Rust `reqwest`.

### 🔐 Security & Tokens
8. **JWT Decoder & Inspector**: Decode header, payload, signature, check expiration status, formatted JSON view, HMAC key verifier.
9. **Hash & Checksum Generator**: MD5, SHA-1, SHA-256, SHA-512, SHA-3 client-side text & local file hashing, HMAC keying.
10. **Password & Key Generator**: Cryptographically secure random passwords, API keys, secret key generator with entropy meter.

### 📦 JSON & Search Utilities
11. **JSON Formatter & Validator**: Beautify (2/4 spaces, tab, minified), syntax error highlighting, auto-fixer, TypeScript/Go/Python interface generator.
12. **JSON Interactive Tree**: Expandable/collapsible node tree view, key path copying, search & filter.
13. **JSON Object Diff**: Compare 2 JSON objects, highlight added/deleted/modified keys side-by-side.
14. **Elasticsearch Query Generator**: Interactively build ES bool DSL queries (`must`, `filter`, `should`, `must_not`), range filters, aggregations, and cURL requests.

### 📝 Diffs & Text Utilities
15. **Text & File Diff Visualizer**: Side-by-side & unified split view, char/line level diffing, file dropzone comparison.
16. **Backslash Escape / Unescape**: Escape/unescape backslashes (`\n`, `\t`, `\"`), JSON string literals, and regex special characters.
17. **Regex Tester & Visualizer**: Live regex evaluation against target strings, match group highlighting, common presets cheat sheet.
18. **String Inspector & Case Converter**: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, text metrics & word count.

### 🌐 Web & Generators
19. **HTML & CSS Live Sandbox Preview**: Write HTML, CSS, and JavaScript with live rendered sandbox preview in an isolated iframe.
20. **URL Encoder & Query Parser**: URL encode/decode and interactive query string parameter editor table.
21. **UUID / ULID Generator & Decoder**: Bulk generator for UUID v4, v1, NanoID, ULID + decode creation timestamps from ULIDs/UUIDs.
22. **Cron Expression Parser**: Cron breakdown into human readable sentence, schedule visualization for next 10 executions.
23. **Color Converter & WCAG**: HEX/RGB/HSL/CMYK conversion, visual color picker, WCAG AA/AAA contrast ratio validator.

---

## ⚡ Ergonomics & Features

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
