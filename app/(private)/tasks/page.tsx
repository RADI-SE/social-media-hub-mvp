import TaskList from "@/components/tasks/TaskList";
import { useDashboardRole } from "@/lib/dashboard-access";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TasksPage() {
  const role = useDashboardRole();
  const router = useRouter();
 
  useEffect(() => {
    if (role !== null && role !== "social_media_user") {
      router.push("/home");
    }
  }, [role, router]);
 
  if (role === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }
 
  if (role !== "social_media_user") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-red-600">Access Denied</p>
      </div>
    );
  }
 
  return <TaskList />;
}