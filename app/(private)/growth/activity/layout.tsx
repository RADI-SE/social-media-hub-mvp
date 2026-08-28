import AdminGuard from "@/components/AdminGuard";

export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}