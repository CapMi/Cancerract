# AGENTS.md - Cancerract

Context file for AI coding agents working in this repository.

## What this app is

A **demo** web app (UI copy in Traditional Chinese) that mimics a skin-cancer screening
flow: log in -> upload a skin photo -> see a "chance of skin cancer" result.

It is **not** a medical device and performs **no** image analysis: no backend, no API
route, no model, no database, no authentication service. Every page is `"use client"`.
Read "Known gaps" before touching user-facing result copy.

## Stack

- Next.js 15.2.4 (App Router under `src/app`), Turbopack in dev
- React 19, TypeScript `strict`
- Tailwind CSS v4 via `@tailwindcss/postcss` (`globals.css` uses `@import "tailwindcss"` + `@theme`)
- **Static export** (`output: "export"`), deployed artefact is plain HTML in `out/`
- Declared but unused dependencies: `react-camera-pro`, `tesseract.js`, `styled-components` (nothing imports them)

## Commands

```bash
yarn install       # REQUIRED first; yarn.lock is the only in-sync lock file
yarn dev           # http://localhost:3000 (Turbopack)
yarn build         # static export -> out/
yarn lint
PAGES_BASE_PATH=/<repo> yarn build   # sub-path build for project-site hosting
```

Use **yarn**, not npm:

- `react-camera-pro@1.4.0` declares peer `react@^18.3.1` while this project runs React 19,
  so `npm install` / `npm ci` abort with `ERESOLVE`.
- `package-lock.json` is stale (missing `react-camera-pro`, `tesseract.js`,
  `styled-components`) and does not describe this project.

Two operational traps:

- Never run `next build` while `next dev` is running - they share `.next/`, and the dev
  server then answers **500 for every route** until restarted.
- `output: "export"` forbids server-only features (route handlers reading request data,
  ISR, middleware, `next/image` default loader - already set to `unoptimized`).

## Routes

| URL | File | Purpose |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | renders the login screen (`<Login/>`); a `<Homepage/>` alternative is commented out |
| `/login` | `src/app/login/page.tsx` | never linked; the login component is imported by `/` |
| `/home` | `src/app/home/page.tsx` | file picker + preview + 確定 submit |
| `/yes` | `src/app/yes/page.tsx` | result screen, driven by the `name` query parameter |

There is **no route guard**: `/home` and `/yes` are reachable by direct URL while logged out.


## The result contract (critical)

`/home` navigates to `/yes?name=<uploaded file name>` - it passes the **file name only**,
never the image data. `/yes` derives its result purely from that string:

| `?name=` | derived `percentage` | panel |
| --- | --- | --- |
| `a.png` | 90 | red, alarm wording |
| `b.png` | 20 | green, mild wording |
| anything else (incl. `c.png`) | 0 | cyan, reassuring wording |

The number shown adds `Math.random() * 5` jitter, so it changes on every render.

Keep the result **derived from the query parameter** (a plain `const`), never in React
state: the previous `useState` + `setPercentage(...)` called during render threw
`Too many re-renders. React limits the number of renders to prevent an infinite loop.`
and replaced the page with "Application error: a client-side exception has occurred"
for `a.png`, `b.png` and `c.png` - i.e. exactly the demo file names.

## Verified user workflow (headless Chrome)

1. `/` shows the login form (labels 您的電郵 或 帳號 / 密碼, button 登入).
2. Wrong credentials: `console.log` only, no navigation, no error message shown.
3. `cancerract` / `1234`: `router.push("/home")` -> client-side navigation to `/home/`.
   Credentials are hardcoded in `login/page.tsx`; anyone can read them in the JS bundle.
4. Pick a file: `<img>` preview plus a 確定 button appear (the preview is object-URL only,
   the file is never uploaded anywhere; the "檔案最大 10mb" text is not enforced).
5. Click 確定: navigates to `/yes/?name=<file name>`.
6. `/yes` renders the panel from the table above, then 確定 goes back to `/home`.
7. Direct loads of `/home/`, `/yes/?name=a.png` etc. render without logging in.

## Known gaps / quirks (ranked)

1. **Fabricated medical claim.** `yes/page.tsx` prints "這圖片有 X％ 機會是皮膚癌"
   where X is a hardcoded lookup + `Math.random()` jitter. Unknown file names land on the
   cyan "請放心" (reassuring) panel, so uploading a real photo produces confident
   reassurance with no analysis at all. Any change here should make the demo nature
   explicit (disclaimer / mock label) rather than look more authoritative.
2. Dead demo branches: only `a.png` / `b.png` produce distinct panels; `c.png` is
   indistinguishable from any random file name.
3. No route guard on `/home` or `/yes`; login is cosmetic.
4. `<img>` in `home/page.tsx` triggers two `next build` warnings (`@next/next/no-img-element`,
   `jsx-a11y/alt-text`).
5. `metadata.title` in `layout.tsx` is still the default "Create Next App".
6. `README.md` documents `npm run dev`, which cannot install dependencies here (see Commands).

## Invariants for agents

- Keep `output: "export"` working; nothing may require a Node server.
- Any component calling `useSearchParams()` (directly or via a helper hook) must stay
  inside a `<Suspense>` boundary, otherwise the build fails with
  `useSearchParams() should be wrapped in a suspense boundary`.
- Never call `setState` during render.
- Preserve Tailwind v4 usage: theme tokens via `@theme` in `globals.css`, class names inline.
- Match the existing 4-space indentation and single-quote className style in `src/app`.


## How to verify a change (runtime, not just HTTP 200)

`next dev` renders client components, so `curl` returning 200 proves nothing about React
errors. Drive the real UI headlessly and assert **zero console/page errors**:

```bash
mkdir -p /tmp/rt && cd /tmp/rt && npm init -y && npm i puppeteer-core
# launch Chrome from /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
#   puppeteer.launch({ executablePath: <above>, headless: true })
# then: goto BASE/, type cancerract/1234, click the submit button, uploadFile('a.png'),
#       click the confirm button, assert URL /yes/?name=a.png and the red panel,
#       and load /yes/?name=c.png directly.
# fail the run if any 'pageerror' or console 'error' event fires.
```

Expected: zero `pageerror`/console errors and panels matching the contract table.
Compile health is separate: `yarn build` must print `✓ Generating static pages (8/8)`
and `✓ Exporting (3/3)`.

## Deployment

- Live site: **https://automatoc-ti.github.io/Cancerract/** (GitHub Pages, `build_type: workflow`)
- Publishing source: the fork `AuTomatoc-Ti/Cancerract` (git remote `fork`). The upstream
  `CapMi/Cancerract` is an organization repo that this account can only read, so pushes and
  Pages settings happen on the fork.
- `.github/workflows/deploy-pages.yml` builds with `PAGES_BASE_PATH=/<repo>` and uploads `out/`.
  Push to the fork's `main` to redeploy.
- `next.config.ts` leaves `basePath` unset locally, so `yarn dev` still serves from the root.

## Next actions (unclaimed)

1. Make the demo honest: add a visible "demo / not medical advice" notice and label the
   result as a mock rather than a diagnosis (highest risk item).
2. Decide the behaviour for unrecognised file names: currently a reassuring 0% panel.
   Either restrict results to `a.png`/`b.png`/`c.png` with an explicit demo-file message,
   or wire up the already-declared `tesseract.js` / `react-camera-pro` for a real input.
3. Add a session guard (or drop the login screen) so `/home` and `/yes` are not reachable
   while logged out.
4. Dependency hygiene: remove the three unused packages from `package.json` and regenerate
   or delete the stale `package-lock.json` so `npm install` works too.
5. Set a real `metadata.title` / description in `layout.tsx`.
6. Clean up the two `next build` warnings in `home/page.tsx` (`<img>` without `alt`).
