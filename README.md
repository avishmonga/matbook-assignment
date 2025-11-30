# MatBook – Dynamic Form Builder (Backend + Frontend)

A small, clean full‑stack app that serves a dynamic form schema and renders it on the frontend. Submissions are saved, listed, edited, deleted, and exported to CSV.

**Milestone Completion Status**
- Backend: REST API under `/rest/v1` with schema, submissions (create/list/update/delete), pagination, search, CSV export, and rate limiting.
- Frontend: Dynamic form (from schema), submissions table (view/edit/delete, search/sort/pagination), dark mode, CSV download.

**Tech Stack Used**
- Backend: Node.js, TypeScript, Express, SQLite (`better-sqlite3`), `cors`, `express-rate-limit`.
- Frontend: Vite, React, TypeScript, TanStack Query / Form / Table, Tailwind CSS.

**Setup & Run Instructions**
- Prerequisite: Node.js (LTS).
- Backend:
  - `cd backend`
  - `npm install`
  - `npm run dev` → `http://localhost:4000/rest/v1`
- Frontend:
  - `cd frontend`
  - `npm install`
  - Ensure `.env.local` has `VITE_API_URL=http://localhost:4000/rest/v1`
  - `npm run dev` → `http://localhost:5173/`

**Known Issues**
- UI is intentionally minimal (no heavy component library yet).
- Search is a simple text match over JSON; not optimized for very large datasets.
- CSV escaping is basic and works for common cases.
- Client validation is light; the backend is the source of truth.

**Assumptions**
- Single form (“Employee Onboarding”) and no authentication.
- Local SQLite DB file in `backend/` for simplicity.
- Versioned REST base path: `/rest/v1`.

---

## Project Map
- `backend/` → REST API + SQLite persistence
- `frontend/` → React app rendering the dynamic form and submissions