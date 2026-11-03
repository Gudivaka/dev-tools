# DevToolkit Studio (dev-tools)

Privacy-first, 100% client-side developer utilities. React 18 + TypeScript + Vite 6 + Tailwind 3, deployed as a static site to GitHub Pages (https://gudivaka.github.io/dev-tools/). **No backend, no database, no Firebase.**

See [docs/KNOWLEDGE_GRAPH.md](docs/KNOWLEDGE_GRAPH.md) for the architecture graph, tool→library map and data flows.

## Commands
- `npm run dev` – Vite dev server
- `npm run build` – `tsc && vite build` (type check is the only gate; output in `dist/`)
- `npm run preview` – serve built bundle
- `npm run deploy` – `gh-pages -d dist` (manual); CI also deploys on push to `main` (`.github/workflows/deploy.yml`, Node 22, `npm ci`, pushes `dist` to `gh-pages`)
- `npm run lint` is defined but **no ESLint config or dependency exists** – it will fail. Don't rely on it.
- There are no tests.

## Architecture in one paragraph
`src/main.tsx` → `App.tsx`. App owns theme, favorites, active tool id (synced to the URL path via History API), and Cmd/Ctrl+K palette state. It renders `Header`, `Sidebar`, `CommandPalette` and one active tool component picked from `TOOL_COMPONENTS` (id → component). Tool metadata (name, category, icon, keywords, badge) lives in `TOOLS` in `src/types/tools.ts`. Each tool in `src/tools/*.tsx` is a self-contained component with local state and no shared store.

## Adding a new tool (3 places must agree on the `id`)
1. Create `src/tools/MyTool.tsx` exporting a named component; start with `<ToolHeader .../>` from `../components/ToolHeader` (all tools do).
2. Add a `ToolDefinition` to `TOOLS` in `src/types/tools.ts` (`id`, `name`, `category`, `description`, `iconName`, `keywords`, optional `badge`).
3. Register in `TOOL_COMPONENTS` in `src/App.tsx`.
4. If using a new lucide icon, add it to **both** the import and `ICON_MAP` in `src/components/Sidebar.tsx` (unknown names silently fall back to `FileCode2`).
5. Update the tool list/count in `README.md`.
New category? Extend the `ToolCategory` union **and** the hard-coded `categories` array in `Sidebar.tsx`.

## Conventions
- Styling: Tailwind utility classes, `darkMode: 'class'`; always provide both light and `dark:` variants. Brand colour is indigo.
- Dependencies are minimal; prefer browser APIs (Web Crypto, `URL`, `Intl`, `FileReader`) over new packages.
- TS is `strict`; unused locals/params are allowed.
- Persistence is `localStorage` only: `devtoolkit_theme`, `devtoolkit_favorites`.
- Routing is path-based (`/jwt-decoder`) using `history.pushState` (no router lib). `/`, `/home`, unknown paths and legacy `#tool-id` links normalise to `/epoch-converter`; clicking the logo goes there too. Needs host fallback to `index.html`: Firebase uses `rewrites` in `firebase.json`; GitHub Pages uses a `404.html` copy of `index.html`. Vite `base` is `/` by default; GitHub Pages builds set `VITE_BASE=/dev-tools/` (CI and `npm run deploy` do this). Don't run a plain `npm run build` and push it to gh-pages.
- Keep the privacy promise: never send user input off-device.

## Known gotchas / inconsistencies
- Category names in `TOOLS` (e.g. "Time & Formatters") differ from the README headings (e.g. "Time & Data Converters"); `TOOLS` is the source of truth for the UI.
- `NetworkSpeedTest` calls `https://httpbin.org` (`/get`, `/bytes/N`, `/post`) – the only external network use; it sends random data, not user data, but the README's "zero external requests" wording is not literally true for this tool.
- `jwt-decode` is a dependency but `JwtDecoder.tsx` doesn't import it (decoding is done manually; `crypto-js` is used for HMAC verification).
- `App.tsx` theme default: `matchMedia(...) ? 'dark' : 'dark'` – always dark unless the user toggled.
- `localStorage.setItem` in the `App.tsx` effects is not wrapped in try/catch (reads are).
- `CommandPalette` ignores category icons (uses a generic Command icon).

## Firebase Hosting
Static hosting only (no SDK, Auth, Firestore, Analytics – Analytics would break the zero-telemetry promise). `firebase.json` serves `dist/` with long-cache for `/assets/**` and `no-cache` for `index.html`. No `.firebaserc` is committed because the project ID is unknown: run `firebase login && firebase use --add`, then `npm run deploy:firebase`. GitHub Pages deploy (CI) still works in parallel. Not yet deployed from this session.
