import {
  getAllSubmissions,
  getSubmissionById,
  insertSubmission,
  updateSubmission,
  deleteSubmission,
  type SubmissionRow,
} from "../db";
import type { SubmissionResource } from "../types/submission";

export interface ListParams {
  page: number;
  limit: number;
  sortBy: "createdAt";
  sortOrder: "asc" | "desc";
  search?: string;
}

function parseRow(row: SubmissionRow): SubmissionResource {
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(row.data);
  } catch {
    parsed = {};
  }
  return { id: row.id, createdAt: row.createdAt, data: parsed };
}

export function listSubmissions(params: ListParams) {
  const all = getAllSubmissions(); // DB-level sorted DESC by createdAt
  let rows = all;
  if (params.sortOrder === "asc") {
    rows = [...rows].reverse();
  }
  if (params.search && params.search.trim() !== "") {
    const q = params.search.toLowerCase();
    rows = rows.filter((r) => {
      try {
        const obj = JSON.parse(r.data);
        return JSON.stringify(obj).toLowerCase().includes(q);
      } catch {
        return false;
      }
    });
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  const page = Math.min(Math.max(1, params.page), totalPages);
  const start = (page - 1) * params.limit;
  const pageRows = rows.slice(start, start + params.limit);
  const data = pageRows.map(parseRow);

  return { data, page, limit: params.limit, total, totalPages };
}

export function listAllSubmissionsResources() {
  const rows = getAllSubmissions();
  return rows.map(parseRow);
}

export function createSubmission(payload: Record<string, unknown>) {
  const createdAt = new Date().toISOString();
  const id = insertSubmission(JSON.stringify(payload), createdAt);
  return { id, createdAt };
}

export function findSubmission(id: number): SubmissionResource | undefined {
  const row = getSubmissionById(id);
  return row ? parseRow(row) : undefined;
}

export function modifySubmission(id: number, payload: Record<string, unknown>) {
  updateSubmission(id, JSON.stringify(payload));
}

export function removeSubmission(id: number) {
  deleteSubmission(id);
}