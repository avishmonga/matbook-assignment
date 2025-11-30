import { useMutation } from "@tanstack/react-query";
import { deleteSubmission } from "../../lib/api";
import { queryClient } from "../../lib/queryClient";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

export default function SubmissionsTable({
  data,
  isLoading,
  isError,
  onView,
  onEdit,
}: {
  data: Array<{ id: number; createdAt: string; data: Record<string, any> }>;
  isLoading?: boolean;
  isError?: boolean;
  onView: (row: any) => void;
  onEdit: (row: any) => void;
}) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: number) => deleteSubmission(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["submissions"] }),
  });

  const columns: ColumnDef<{ id: number; createdAt: string; data: Record<string, any> }>[] = [
    {
      accessorKey: "id",
      header: () => "ID",
      cell: (info) => info.getValue() as number,
    },
    {
      accessorKey: "createdAt",
      header: () => "Created At",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
    },
    {
      id: "actions",
      header: () => "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button className="btn" onClick={() => onView(row.original)}>View</button>
          <button className="btn" onClick={() => onEdit(row.original)}>Edit</button>
          <button
            className="btn"
            disabled={isPending}
            onClick={() => {
              if (confirm("Delete this submission?")) mutateAsync(row.original.id);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  if (isLoading) {
    return <div className="card p-6">Loading submissions…</div>;
  }

  if (isError) {
    return <div className="card p-6">Failed to load submissions.</div>;
  }

  if (!data || data.length === 0) {
    return <div className="card p-6">No submissions yet. Go to the Form page to create one.</div>;
  }

  return (
    <div className="card p-4 overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-left border-b border-slate-200 dark:border-slate-700">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="py-2">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}