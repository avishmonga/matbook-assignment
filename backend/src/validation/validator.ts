import { employeeOnboardingSchema } from "../formSchema/employeeOnboarding";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

function toStringValue(v: unknown): string {
  return typeof v === "string" ? v : String(v ?? "");
}

function toNumberValue(v: unknown): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toBooleanValue(v: unknown): boolean | null {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    if (s === "true") return true;
    if (s === "false") return false;
  }
  return null;
}

function tryParseDate(v: unknown): Date | null {
  if (typeof v === "string") {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function makeRegex(pattern: unknown): RegExp | null {
  if (typeof pattern !== "string" || !pattern) return null;
  // Support "^...$" or "/.../flags"
  if (pattern.startsWith("/") && pattern.lastIndexOf("/") > 0) {
    const last = pattern.lastIndexOf("/");
    const body = pattern.slice(1, last);
    const flags = pattern.slice(last + 1);
    try {
      return new RegExp(body, flags);
    } catch {
      return null;
    }
  }
  try {
    return new RegExp(pattern);
  } catch {
    return null;
  }
}

export function validateSubmission(payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  const fields = employeeOnboardingSchema.fields as ReadonlyArray<any>;
  if (!fields || fields.length === 0) {
    return {
      isValid: false,
      errors: { _schema: "Schema not configured. Please provide form fields." },
    };
  }

  for (const field of fields) {
    const name: string = field.name;
    const label: string = field.label || name;
    const type: string = field.type;
    const rules = field.validation || {};
    const raw = payload[name];

    if (type === "text" || type === "textarea") {
      const val = typeof raw === "string" ? raw : toStringValue(raw).trim();
      if (rules.required && (!val || val.length === 0)) {
        errors[name] = `${label} is required`;
        continue;
      }
      if (rules.minLength && val.length < rules.minLength) {
        errors[name] = `${label} must be at least ${rules.minLength} characters`;
        continue;
      }
      if (rules.maxLength && val.length > rules.maxLength) {
        errors[name] = `${label} must be at most ${rules.maxLength} characters`;
        continue;
      }
      if (rules.regex) {
        const re = makeRegex(rules.regex);
        if (re && !re.test(val)) {
          errors[name] = `${label} is invalid`;
          continue;
        }
      }
    } else if (type === "number") {
      const val = toNumberValue(raw);
      if (rules.required && val === null) {
        errors[name] = `${label} is required`;
        continue;
      }
      if (val !== null) {
        if (typeof rules.min === "number" && val < rules.min) {
          errors[name] = `${label} must be at least ${rules.min}`;
          continue;
        }
        if (typeof rules.max === "number" && val > rules.max) {
          errors[name] = `${label} must be at most ${rules.max}`;
          continue;
        }
      }
    } else if (type === "date") {
      const val = tryParseDate(raw);
      if (rules.required && !val) {
        errors[name] = `${label} is required`;
        continue;
      }
      if (val && rules.minDate) {
        const min = tryParseDate(rules.minDate);
        if (min && val.getTime() < min.getTime()) {
          errors[name] = `${label} must be on or after ${rules.minDate}`;
          continue;
        }
      }
    } else if (type === "select") {
      const val = typeof raw === "string" ? raw : toStringValue(raw);
      if (rules.required && (!val || val.trim() === "")) {
        errors[name] = `${label} is required`;
        continue;
      }
      const optionsRaw: any[] = Array.isArray(field.options) ? field.options : [];
      if (val && optionsRaw.length > 0) {
        const set = new Set(
          optionsRaw.map((o) => (typeof o === "string" ? String(o) : String(o?.value)))
        );
        if (!set.has(String(val))) {
          errors[name] = `Please select a valid ${label.toLowerCase()}`;
          continue;
        }
      }
    } else if (type === "multi-select") {
      const arr = Array.isArray(raw) ? raw : [];
      const optionsRaw: any[] = Array.isArray(field.options) ? field.options : [];
      if (rules.required && arr.length === 0) {
        errors[name] = `${label} requires at least one selection`;
        continue;
      }
      if (typeof rules.minSelected === "number" && arr.length < rules.minSelected) {
        errors[name] = `${label} must have at least ${rules.minSelected} selections`;
        continue;
      }
      if (typeof rules.maxSelected === "number" && arr.length > rules.maxSelected) {
        errors[name] = `${label} must have at most ${rules.maxSelected} selections`;
        continue;
      }
      if (optionsRaw.length > 0 && arr.length > 0) {
        const set = new Set(
          optionsRaw.map((o) => (typeof o === "string" ? String(o) : String(o?.value)))
        );
        const allValid = arr.every((v) => set.has(String(v)));
        if (!allValid) {
          errors[name] = `Please select valid options for ${label.toLowerCase()}`;
          continue;
        }
      }
    } else if (type === "switch") {
      const val = toBooleanValue(raw);
      if (rules.required && val === null) {
        errors[name] = `${label} is required`;
        continue;
      }
    } else {
      // Unknown field type — skip validation but do not error
      continue;
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}