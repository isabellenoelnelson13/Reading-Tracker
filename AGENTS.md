# Repository Guidelines

## Project Structure & Module Organization
- `api/` holds the Express + TypeScript backend, with source in `api/src/`, Prisma schema and migrations in `api/prisma/`, and generated Prisma client in `api/generated/`.
- `web/` holds the React + Vite frontend, with source in `web/src/` and static assets in `web/public/`.
- Root `package.json` only contains shared dev tooling; install and run commands from each package directory.

## Build, Test, and Development Commands
Backend (run from `api/`):
- `npm run dev` — start the API with hot-reload via nodemon + tsx.
- `npm run build` — compile TypeScript to `api/dist/`.
- `npm start` — run the compiled server from `api/dist/index.js`.
- `npm test` — currently exits with an error (no tests configured).

Frontend (run from `web/`):
- `npm run dev` — start Vite dev server.
- `npm run build` — typecheck and build the production bundle.
- `npm run lint` — run ESLint over the frontend code.
- `npm run preview` — preview the production build locally.

## Coding Style & Naming Conventions
- Language: TypeScript in both `api/` and `web/`.
- Linting: ESLint is configured for the frontend in `web/eslint.config.js`; no formatter is configured.
- Prefer clarity over brevity; write code for the next person to read it.
- Use descriptive, intention-revealing names (e.g., `ReadingList.tsx`, `books.router.ts`, `fetchBooks.ts`).
- Break features into small, focused modules; avoid large files and multi-responsibility functions.
- Keep concerns separated: UI components (rendering), logic (state/transformations), and data fetching (API calls) should live in distinct modules.

## Testing Guidelines
- No automated tests are configured yet for either package.
- If you add tests, keep them close to the module under test (e.g., `web/src/__tests__/...` or `api/src/__tests__/...`) and add a runnable script to the relevant `package.json`.

## Commit & Pull Request Guidelines
- No commit history exists yet, so no message convention is established.
- For new PRs, include: a short summary, how to run/verify changes, and screenshots for UI updates.

## Configuration & Data Notes
- The API uses Prisma with SQLite (`api/dev.db`); treat local databases as disposable and avoid committing sensitive data.
- If you update Prisma schema, regenerate the client in the `api/` package as part of your changes.
