# Backend – MatBook Assignment

A small TypeScript + Express API that serves a dynamic form schema and handles submissions with SQLite storage.

**Milestone Completion Status**
- Implemented `/rest/v1/form-schema` and submissions CRUD.
- Pagination, sorting, search on list.
- CSV export of all submissions.
- Basic rate limiting applied.

**Tech Stack Used**
- Node.js, TypeScript, Express
- SQLite via `better-sqlite3`
- `cors`, `express-rate-limit`

**Setup & Run**
- `cd backend`
- `npm install`
- `npm run dev` → `http://localhost:4000/rest/v1`

**Deployment**
- Live API (GCP Cloud Run): `https://matbook-assignment-579945683822.europe-west1.run.app/rest/v1`

**Known Issues**
- Search is simple (string match).
- CSV escaping is pragmatic, not exhaustive.
- No authentication or RBAC.

**Assumptions**
- One form (“Employee Onboarding”).
- Local SQLite file `matbook.db` for development.
- Versioned base path: `/rest/v1`.