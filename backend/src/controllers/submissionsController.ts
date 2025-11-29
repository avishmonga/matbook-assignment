import { Request, Response } from "express";
import { validateSubmission } from "../validation/validator";
import {
  createSubmission,
  listSubmissions,
  findSubmission,
  modifySubmission,
  removeSubmission,
  listAllSubmissionsResources,
} from "../services/submissionsService";
import { employeeOnboardingSchema } from "../formSchema/employeeOnboarding";

export function createSubmissionHandler(req: Request, res: Response) {
  const payload = req.body ?? {};
  const result = validateSubmission(payload);
  if (!result.isValid) {
    return res.status(400).json({ success: false, errors: result.errors });
  }
  const { id, createdAt } = createSubmission(payload);
  return res.status(201).json({ success: true, id, createdAt });
}

export function listSubmissionsHandler(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1) || 1;
  const limit = Number(req.query.limit ?? 10) || 10;
  const sortBy = (req.query.sortBy as string) === "createdAt" ? "createdAt" : "createdAt";
  const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";
  const search = (req.query.search as string) || undefined;

  const out = listSubmissions({ page, limit, sortBy, sortOrder, search });
  return res.status(200).json(out);
}

export function updateSubmissionHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: "Invalid submission id" });
  }
  const payload = req.body ?? {};
  const result = validateSubmission(payload);
  if (!result.isValid) {
    return res.status(400).json({ success: false, errors: result.errors });
  }

  const existing = findSubmission(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Submission not found" });
  }
  modifySubmission(id, payload);
  const updated = findSubmission(id)!;
  return res.status(200).json({ success: true, id: updated.id, createdAt: updated.createdAt, data: updated.data });
}

export function deleteSubmissionHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: "Invalid submission id" });
  }
  const existing = findSubmission(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Submission not found" });
  }
  removeSubmission(id);
  return res.status(204).send();
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  let str = Array.isArray(value) ? value.join("|") : String(value);
  // Escape quotes and wrap if needed
  str = str.replace(/"/g, '""');
  if (/[",\n]/.test(str)) {
    str = `"${str}"`;
  }
  return str;
}

export function exportSubmissionsCsvHandler(_req: Request, res: Response) {
  const resources = listAllSubmissionsResources();
  const fieldNames = employeeOnboardingSchema.fields.map((f: any) => f.name);
  const header = ["id", "createdAt", ...fieldNames].join(",");
  const lines = resources.map((r) => {
    const rowValues = [r.id, r.createdAt, ...fieldNames.map((name) => escapeCsv((r.data as any)[name]))];
    return rowValues.join(",");
  });
  const csv = [header, ...lines].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="submissions.csv"');
  return res.status(200).send(csv);
}