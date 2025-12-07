# HealthMath (React + Vite)

An interactive health routine tracker with animated cyber-UI, task completion confetti, live clock, creator footer, and protocol guidance. Data definitions live in `src/data/content.js`.

## Quick Start
- Install: `npm install`
- Develop: `npm run dev` then open the shown local URL (default http://localhost:5173)
- Build: `npm run build` (outputs to `dist/`)
- Preview build: `npm run preview`

## Project Structure
- `src/App.jsx`: Main app shell, tabs, confetti, live clock, creator footer, and state (localStorage `healthMateTasks_v2`).
- `src/data/content.js`: Task schedule, medicine info, and behavior rules (keep stable as requested; noon tasks are part of the core data).
- `src/index.css`: Tailwind base and global theming; extra animations/styles defined inline in `App.jsx`.
- `tailwind.config.js`: JIT config with safelisted gradient classes and custom `spin-slow`.
- `public/logos/`: Social icons used in the footer (GitHub, B 站、小红书、抖音、自定义头像).

## Coding Notes
- React 18 + Vite 5 with Tailwind 3.4; ESLint flat config in `eslint.config.js`.
- Confetti renders on a full-screen canvas; it clears automatically after each trigger. The creator badge links to MediaCrawler on GitHub.
- Tasks marked `important` show a warning icon; state persists via localStorage.

## Contributing
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).
- Run `npm run build` before PRs; add linting/tests if you expand the codebase.
- Keep `src/data/content.js` as the single source of task/plan data; adjust UI only through components unless content changes are required.
