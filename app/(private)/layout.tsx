import { auth } from "@clerk/nextjs/server";
import Sidebar from "@/components/layout/Sidebar";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}