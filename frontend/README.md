# Frontend – MatBook Assignment

A Vite + React app that fetches a dynamic schema and renders the form. Submissions are listed in a table with view/edit/delete, search, sort, pagination, and CSV export.

**Milestone Completion Status**
- Dynamic form rendering from backend schema.
- Submissions table with actions and CSV download.
- Dark mode toggle.

**Tech Stack Used**
- Vite, React, TypeScript
- TanStack Query / Form / Table
- Tailwind CSS

**Setup & Run**
- `cd frontend`
- `npm install`
- Ensure `.env.local` has: `VITE_API_URL=http://localhost:4000/rest/v1`
- `npm run dev` → `http://localhost:5173/`

**Known Issues**
- Minimal UI elements; can be enhanced with ShadCN.
- Client-side validation is light; backend provides authoritative errors.

**Assumptions**
- Backend is running locally on port 4000.
- Schema remains stable; edits happen via backend.