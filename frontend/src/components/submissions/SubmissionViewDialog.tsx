export default function SubmissionViewDialog({ open, onClose, row }: { open: boolean; onClose: () => void; row: any; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 overflow-auto py-10 z-50">
      <div className="mx-auto max-w-lg w-full px-4">
        <div className="card p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">View Submission</h2>
          <div className="text-sm whitespace-pre-wrap">
            <code className="block bg-slate-100 dark:bg-slate-800 p-3 rounded">
              {JSON.stringify(row?.data, null, 2)}
            </code>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}