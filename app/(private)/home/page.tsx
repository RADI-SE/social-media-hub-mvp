"use client";

import RoleDashboard from "@/components/growth/RoleDashboard";
import { useDashboardRole } from "@/lib/dashboard-access";

export default function HomePage() {
  const role = useDashboardRole();

  if (role === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <RoleDashboard role={role} />;
}