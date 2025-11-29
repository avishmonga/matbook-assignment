import Database from "better-sqlite3";
import { env } from "../config/env";

const db = new Database(env.dbFile);

db.pragma("journal_mode = WAL");

db.prepare(
  `CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )`
).run();

export interface SubmissionRow {
  id: number;
  data: string; // JSON string
  createdAt: string; // ISO string
}

export function insertSubmission(dataJson: string, createdAt: string): number {
  const stmt = db.prepare(
    "INSERT INTO submissions (data, createdAt) VALUES (?, ?)"
  );
  const info = stmt.run(dataJson, createdAt);
  return Number(info.lastInsertRowid);
}

export function getAllSubmissions(): SubmissionRow[] {
  const stmt = db.prepare(
    "SELECT id, data, createdAt FROM submissions ORDER BY datetime(createdAt) DESC"
  );
  return stmt.all() as SubmissionRow[];
}

export function getSubmissionById(id: number): SubmissionRow | undefined {
  const stmt = db.prepare(
    "SELECT id, data, createdAt FROM submissions WHERE id = ?"
  );
  return stmt.get(id) as SubmissionRow | undefined;
}

export function updateSubmission(id: number, dataJson: string): void {
  const stmt = db.prepare("UPDATE submissions SET data = ? WHERE id = ?");
  stmt.run(dataJson, id);
}

export function deleteSubmission(id: number): void {
  const stmt = db.prepare("DELETE FROM submissions WHERE id = ?");
  stmt.run(id);
}