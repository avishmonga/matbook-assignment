import DynamicForm from "../form/DynamicForm";
import { useMutation } from "@tanstack/react-query";
import { updateSubmission } from "../../lib/api";
import { queryClient } from "../../lib/queryClient";

export default function SubmissionEditDialog({ open, onClose, row, schema }: { open: boolean; onClose: () => void; row: any; schema: any; }) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (vals: any) => updateSubmission(row.id, vals),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["submissions"] }),
  });

  if (!open) return null;

  const initialValues = (() => {
    const d = row?.data || {};
    if (d.workLocation && !d.workMode) {
      d.workMode = d.workLocation;
    }
    return d;
  })();

  return (
    <div className="fixed inset-0 bg-black/40 overflow-auto py-10 z-50">
      <div className="mx-auto max-w-2xl w-full px-4">
        <div className="card p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Edit Submission</h2>
          <DynamicForm
            schema={schema}
            initialValues={initialValues}
            onCancel={onClose}
            onSubmit={async (vals) => {
              await mutateAsync(vals);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}