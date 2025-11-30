import { useQuery } from "@tanstack/react-query";
import { getFormSchema } from "../lib/api";
import DynamicForm from "../components/form/DynamicForm";

export default function FormPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["formSchema"], queryFn: getFormSchema });
  if (isLoading) return <div className="card p-6">Loading form…</div>;
  if (isError || !data) return <div className="card p-6">Failed to load form schema.</div>;
  return <DynamicForm schema={data.schema} />;
}