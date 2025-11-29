export type SubmissionPayload = Record<string, unknown>;

export interface SubmissionResource {
  id: number;
  createdAt: string;
  data: SubmissionPayload;
}