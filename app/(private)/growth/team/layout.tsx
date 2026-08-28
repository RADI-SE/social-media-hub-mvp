import AdminGuard from "@/components/AdminGuard";

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}