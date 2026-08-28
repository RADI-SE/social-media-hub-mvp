import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { DashboardRole } from "@/types/dashboard";

type DashboardNavLabel =
  | "growthDashboard"
  | "growthTeam"
  | "growthActivity"
  | "growthAccounts"
  | "growthRevenue"
  | "growthLeads"
  | "growthJourneys"
  | "growthPipeline"
  | "growthROI"
  | "growthLTV"
  | "growthAlerts"
  | "growthScoreBreakdown"
  | "growthContacts"
  | "growthFlagged"
  | "growthTasks"
  | "posts"
  | "calendar"
  | "comments"
  | "tasks";

export const dashboardNavigation: Record<
  DashboardRole,
  { label: DashboardNavLabel; href: string }[]
> = {
  admin: [
    { label: "growthDashboard", href: "/home" },
    { label: "growthTeam", href: "/growth/team" },
    { label: "growthActivity", href: "/growth/activity" },
    { label: "growthTasks", href: "/growth/tasks" },
    { label: "tasks", href: "/tasks" },
  ],
  cmo: [
    { label: "growthDashboard", href: "/home" },
    { label: "growthPipeline", href: "/growth/pipeline" },
    { label: "growthROI", href: "/growth/roi" },
    { label: "growthLTV", href: "/growth/ltv" },
    { label: "growthAlerts", href: "/growth/alerts" },
    { label: "comments", href: "/comments" },
    { label: "growthTasks", href: "/growth/tasks" },
    { label: "tasks", href: "/tasks" },
  ],
  marketing_manager: [
    { label: "growthDashboard", href: "/home" },
    { label: "growthAccounts", href: "/growth/accounts" },
    { label: "growthLeads", href: "/growth/leads" },
    { label: "growthJourneys", href: "/growth/journeys" },
    { label: "growthScoreBreakdown", href: "/growth/score-breakdown" },
    { label: "comments", href: "/comments" },
    { label: "growthTasks", href: "/growth/tasks" },
    { label: "tasks", href: "/tasks" },
  ],
  social_media_user: [
    { label: "growthDashboard", href: "/home" },
    { label: "posts", href: "/posts" },
    { label: "calendar", href: "/schedule" },
    { label: "comments", href: "/comments" },
    { label: "growthContacts", href: "/growth/contacts" },
    { label: "growthFlagged", href: "/growth/flagged" },
    { label: "tasks", href: "/tasks" },
  ],
};

export function useDashboardRole(): DashboardRole | null {
  const user = useQuery(api.users.current);
  return user ? (user.role as DashboardRole) : null;
}