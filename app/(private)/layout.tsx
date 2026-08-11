import { auth } from "@clerk/nextjs/server";
import Sidebar from "@/components/layout/Sidebar";
import UserInitializer from "@/components/UserInitializer";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();

  return (
    <div className="flex min-h-screen">
      <UserInitializer />

      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}