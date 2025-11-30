/// <reference types="vite/client" />
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/rest/v1";
export const api = axios.create({ baseURL });

export type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "multi-select" | "date" | "textarea" | "switch";
  placeholder?: string;
  options?: string[] | { value: string; label?: string }[];
  validation?: Record<string, unknown>;
};

export type FormSchema = {
  title: string;
  description?: string;
  fields: Field[];
};

export interface GetFormSchemaResponse {
  schema: FormSchema;
}

export interface SubmissionRow {
  id: number;
  createdAt: string;
  data: Record<string, any>;
}

export interface SubmissionsListResponse {
  data: SubmissionRow[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function getFormSchema(): Promise<GetFormSchemaResponse> {
  return api.get("/form-schema").then((r) => r.data as GetFormSchemaResponse);
}

export function createSubmission(data: any) {
  return api.post("/submissions", data).then((r) => r.data);
}

export function listSubmissions(params: {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
}): Promise<SubmissionsListResponse> {
  return api.get("/submissions", { params }).then((r) => r.data as SubmissionsListResponse);
}

export function updateSubmission(id: number, data: any) {
  return api.put(`/submissions/${id}`, data).then((r) => r.data);
}

export function deleteSubmission(id: number) {
  return api.delete(`/submissions/${id}`).then((r) => r.data);
}

export function exportSubmissionsCsv(): Promise<Blob> {
  return api
    .get("/submissions/export", { responseType: "blob" })
    .then((r) => r.data as Blob);
}