export default function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>;
}