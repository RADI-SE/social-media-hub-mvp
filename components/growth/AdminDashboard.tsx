"use client";

import { UsersRound, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoleDashboardShell, DashboardCard } from "./DashboardPrimitives";

export default function AdminDashboard() {
  const t = useTranslations("growth.roleDashboards.admin");
  const users = useQuery(api.admin.listUsers);
  const logs = useQuery(api.admin.listLogs);

  return (
    <RoleDashboardShell role="admin">
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          icon={UsersRound}
          title={t("manageUsers")}
          description={t("manageUsersDescription")}
          value={users ? String(users.length) : "…"}
          href="/growth/team"
        />
        <DashboardCard
          icon={ScrollText}
          title={t("systemLogs")}
          description={t("systemLogsDescription")}
          value={logs ? String(logs.length) : "…"}
          href="/growth/activity"
        />
      </div>
    </RoleDashboardShell>
  );
}