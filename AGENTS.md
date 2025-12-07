# Repository Guidelines

## Project Structure & Module Organization
- `demo.jsx`: Single-page React UI (health routine tracker) using Tailwind utility classes, `lucide-react` icons, localStorage state, and inline animation keyframes. Treat it as the source of truth for UI/logic when refactoring into a larger app.
- `LICENSE`: MIT license; keep headers intact in new files.
- When adding files, mirror the current approach: colocate small view logic with components, and keep shared styles/utilities in adjacent modules or a `src/` folder if you introduce a bundler.

## Build, Test, and Development Commands
- Install deps (once you add `package.json`): `npm install` (or `pnpm install`, `yarn install`).
- Run dev server (Vite/CRA-style): `npm run dev` to hot-reload the React view. If wiring into another host app, import `demo.jsx` into that app’s entry point.
- Lint/format (recommended): `npm run lint` using ESLint + Prettier; add a config before first run.
- Bundle for deploy: `npm run build` (configure via Vite/CRA). Keep tree-shaking intact; avoid global side effects outside React hooks.

## Coding Style & Naming Conventions
- Use 2-space indentation, functional React components, and hooks for state/effects; avoid class components.
- Prefer descriptive, kebab-case file names (e.g., `daily-schedule.jsx`) and `PascalCase` for components.
- Keep Tailwind utility strings readable: group layout → color → effects; extract repeated clusters into helper classes when they grow.
- Persist state via `localStorage` keys with version suffixes (e.g., `*_v2`) to allow migrations.

## Testing Guidelines
- No tests exist yet; add `*.test.jsx` under the same folder or `__tests__/`.
- Use `vitest` + `@testing-library/react` for component behavior (checkbox toggles, progress calculation, reset flow).
- Target at least smoke coverage on critical flows: toggle tasks, reset state, confetti trigger guard when canvas missing.

## Commit & Pull Request Guidelines
- Prefer Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`) for clarity; keep scope small.
- In PRs, include: goal/behavior summary, before/after notes or screenshots for UI tweaks, testing notes (`npm test`/`npm run lint`), and any data-migration steps (e.g., localStorage key changes).
- Keep diffs focused; separate stylistic refactors from behavioral changes.

## Security & Configuration Tips
- Do not store secrets or PII in localStorage; the current usage is limited to completion state.
- Pin front-end dependencies (`lucide-react`, React, bundler) to avoid breakage; prefer exact or caret versions with lockfiles committed.
- Keep animations and DOM access inside hooks to prevent SSR/hydration issues when integrating into Next.js or similar frameworks.
