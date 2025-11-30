import { useQuery } from "@tanstack/react-query";
import {
  listSubmissions,
  getFormSchema,
  type SubmissionsListResponse,
  type GetFormSchemaResponse,
} from "../lib/api";
import { useState } from "react";
import { useDebounce } from "../lib/useDebounce";
import SubmissionsTable from "../components/submissions/SubmissionsTable";
import SubmissionViewDialog from "../components/submissions/SubmissionViewDialog";
import SubmissionEditDialog from "../components/submissions/SubmissionEditDialog";
import { exportSubmissionsCsv } from "../lib/api";

export default function SubmissionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const q = useDebounce(search, 300);

  const { data: submissions, isLoading, isError } = useQuery<SubmissionsListResponse>({
    queryKey: ["submissions", { page, limit, sortOrder, search: q }],
    queryFn: () => listSubmissions({ page, limit, sortOrder, search: q }),
    placeholderData: (prev) => prev,
  });

  const { data: schemaData } = useQuery<GetFormSchemaResponse>({
    queryKey: ["formSchema"],
    queryFn: getFormSchema,
  });

  const [viewRow, setViewRow] = useState<any | null>(null);
  const [editRow, setEditRow] = useState<any | null>(null);

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold">Submissions</h1>
        <div className="flex-1" />
        <button
          className="btn"
          onClick={async () => {
            const blob = await exportSubmissionsCsv();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "submissions.csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}
        >
          Export CSV
        </button>
        <input className="input max-w-xs" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input w-24" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <button className="btn" onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}>
          Sort: {sortOrder === "asc" ? "Oldest" : "Newest"}
        </button>
      </div>

      <SubmissionsTable
        data={submissions?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        onView={(row) => setViewRow(row)}
        onEdit={(row) => setEditRow(row)}
      />

      {submissions && (
        <div className="flex items-center gap-2">
          <button className="btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
          <button className="btn" disabled={page >= submissions.totalPages} onClick={() => setPage((p) => Math.min(submissions.totalPages, p + 1))}>Next</button>
          <div className="text-sm text-muted">Page {submissions.page} of {submissions.totalPages}</div>
        </div>
      )}

      <SubmissionViewDialog open={!!viewRow} onClose={() => setViewRow(null)} row={viewRow} />
      <SubmissionEditDialog open={!!editRow} onClose={() => setEditRow(null)} row={editRow} schema={schemaData?.schema} />
    </div>
  );
}