import { useMutation } from "@tanstack/react-query";
import { createSubmission } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";

type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "multi-select" | "date" | "textarea" | "switch";
  placeholder?: string;
  options?: string[] | { value: string; label?: string }[];
  validation?: any;
};

export default function DynamicForm({
  schema,
  initialValues,
  onSubmit: onSubmitOverride,
  onCancel,
}: {
  schema: { title: string; description?: string; fields: Field[] };
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const defaults = useMemo(() => {
    const obj: Record<string, any> = {};
    for (const f of schema.fields) {
      switch (f.type) {
        case "text":
        case "textarea":
        case "date":
        case "select":
          obj[f.name] = "";
          break;
        case "number":
          obj[f.name] = ""; // keep string for controlled input, cast on submit
          break;
        case "multi-select":
          obj[f.name] = [];
          break;
        case "switch":
          obj[f.name] = false;
          break;
      }
    }
    return obj;
  }, [schema.fields]);

  const form = useForm<Record<string, any>>({
    defaultValues: { ...(defaults || {}), ...(initialValues || {}) },
    onSubmit: async ({ value }) => {
      const payload: Record<string, any> = {};
      for (const f of schema.fields) {
        const v = value[f.name];
        if (f.type === "number") {
          const n = typeof v === "number" ? v : Number(String(v ?? "").trim());
          payload[f.name] = Number.isFinite(n) ? n : undefined;
        } else {
          payload[f.name] = v;
        }
      }

      if (onSubmitOverride) {
        try {
          await Promise.resolve(onSubmitOverride(payload));
        } catch (err: any) {
          const status = err?.response?.status;
          const data = err?.response?.data;
          if (status === 400 && data?.errors) {
            setErrors(data.errors);
          } else {
            alert("Unexpected error. Please try again.");
          }
        }
        return;
      }

      try {
        const res = await mutateAsync(payload);
        if (res?.success) {
          navigate("/submissions");
        }
      } catch (err: any) {
        const status = err?.response?.status;
        const data = err?.response?.data;
        if (status === 400 && data?.errors) {
          setErrors(data.errors);
        } else {
          alert("Unexpected error. Please try again.");
        }
      }
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (val: any) => createSubmission(val),
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    await form.handleSubmit();
  }

  function renderField(f: Field) {
    const req = f.validation?.required;
    const err = errors[f.name];
    const labelText = `${f.label}${req ? " *" : ""}`;
    const options = (f.options || []).map((o: any) => (typeof o === "string" ? { value: o, label: o } : { value: o.value, label: o.label ?? o.value }));

    switch (f.type) {
      case "text":
        return (
          <form.Field name={f.name}>
            {(field) => (
              <div>
                <label className="label" htmlFor={f.name}>{labelText}</label>
                <input
                  id={f.name}
                  className="input"
                  type="text"
                  placeholder={f.placeholder}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.setValue(e.target.value)}
                />
                {(err || field.state.meta.errors?.[0]) && (
                  <div className="error-text">{err || field.state.meta.errors?.[0]}</div>
                )}
              </div>
            )}
          </form.Field>
        );
      case "textarea":
        return (
          <form.Field name={f.name}>
            {(field) => (
              <div>
                <label className="label" htmlFor={f.name}>{labelText}</label>
                <textarea
                  id={f.name}
                  className="input"
                  placeholder={f.placeholder}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.setValue(e.target.value)}
                />
                {(err || field.state.meta.errors?.[0]) && (
                  <div className="error-text">{err || field.state.meta.errors?.[0]}</div>
                )}
              </div>
            )}
          </form.Field>
        );
      case "number":
        return (
          <form.Field name={f.name}>
            {(field) => (
              <div>
                <label className="label" htmlFor={f.name}>{labelText}</label>
                <input
                  id={f.name}
                  className="input"
                  type="number"
                  placeholder={f.placeholder}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.setValue(e.target.value)}
                />
                {(err || field.state.meta.errors?.[0]) && (
                  <div className="error-text">{err || field.state.meta.errors?.[0]}</div>
                )}
              </div>
            )}
          </form.Field>
        );
      case "date":
        return (
          <form.Field name={f.name}>
            {(field) => (
              <div>
                <label className="label" htmlFor={f.name}>{labelText}</label>
                <input
                  id={f.name}
                  className="input"
                  type="date"
                  placeholder={f.placeholder}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.setValue(e.target.value)}
                />
                {(err || field.state.meta.errors?.[0]) && (
                  <div className="error-text">{err || field.state.meta.errors?.[0]}</div>
                )}
              </div>
            )}
          </form.Field>
        );
      case "select":
        return (
          <form.Field name={f.name}>
            {(field) => (
              <div>
                <label className="label" htmlFor={f.name}>{labelText}</label>
                <select
                  id={f.name}
                  className="input"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.setValue(e.target.value)}
                >
                  <option value="">{f.placeholder ?? "Select"}</option>
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {(err || field.state.meta.errors?.[0]) && (
                  <div className="error-text">{err || field.state.meta.errors?.[0]}</div>
                )}
              </div>
            )}
          </form.Field>
        );
      case "multi-select":
        return (
          <form.Field name={f.name}>
            {(field) => (
              <div>
                <div className="label">{labelText}</div>
                <div className="grid grid-cols-2 gap-2">
                  {options.map((o) => {
                    const arr: string[] = (field.state.value as string[]) ?? [];
                    const checked = arr.includes(o.value);
                    return (
                      <label key={o.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const cur = Array.isArray(field.state.value) ? (field.state.value as string[]) : [];
                            const next = e.target.checked ? [...cur, o.value] : cur.filter((x) => x !== o.value);
                            field.setValue(next);
                          }}
                        />
                        {o.label}
                      </label>
                    );
                  })}
                </div>
                {(err || field.state.meta.errors?.[0]) && (
                  <div className="error-text">{err || field.state.meta.errors?.[0]}</div>
                )}
              </div>
            )}
          </form.Field>
        );
      case "switch":
        return (
          <form.Field name={f.name}>
            {(field) => (
              <div className="flex items-center gap-2">
                <span className="label m-0">{labelText}</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={Boolean(field.state.value)}
                    onChange={(e) => field.setValue(e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-checked:bg-blue-500 rounded-full relative transition-colors">
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>
                {(err || field.state.meta.errors?.[0]) && (
                  <div className="error-text">{err || field.state.meta.errors?.[0]}</div>
                )}
              </div>
            )}
          </form.Field>
        );
      default:
        return null;
    }
  }

  return (
    <form className="card p-6 space-y-5" onSubmit={onSubmit}>
      <div>
        <h1 className="text-xl font-semibold mb-1">{schema.title}</h1>
        {schema.description && <p className="text-sm text-muted">{schema.description}</p>}
      </div>

      {schema.fields.map((f) => (
        <div key={f.name}>{renderField(f)}</div>
      ))}

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn"
          onClick={() => {
            form.reset();
            onCancel?.();
          }}
          disabled={isPending}
        >
          Cancel
        </button>
        <button type="submit" className="btn" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}