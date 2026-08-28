"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatter } from "next-intl";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import PageHeader from "@/components/hub/PageHeader";
import StatusPill from "@/components/hub/StatusPill";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useDashboardRole } from "@/lib/dashboard-access";

const ALLOWED_ROLES = ["admin", "cmo", "marketing_manager"] as const;

type TeamTask = {
  _id: Id<"followUpTasks">;
  title: string;
  userId: Id<"users">;
  assignedByUserId?: Id<"users">;
  status: "Todo" | "InProgress" | "Completed";
  createdAt: number;
};

export default function GrowthTasksPage() {
  const t = useTranslations("growth.tasks");
  const role = useDashboardRole();
  const router = useRouter();

  useEffect(() => {
    if (role !== null && !ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])) {
      router.push("/home");
    }
  }, [role, router]);

  const teammates = useQuery(api.admin.listTeammates);
  const tasks = useQuery(api.followUpTasks.listTeamTasks);
  const assignTask = useMutation(api.followUpTasks.assignFollowUpTask);
  const formatter = useFormatter();

  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const teammateName = useMemo(() => {
    const map = new Map<string, string>();
    for (const teammate of teammates ?? []) {
      map.set(teammate._id, teammate.name ?? teammate.email ?? teammate._id);
    }
    return map;
  }, [teammates]);

  const columns: ColumnDef<TeamTask, any>[] = [
    { accessorKey: "title", header: t("taskTitle") },
    {
      id: "assignee",
      header: t("assignee"),
      cell: ({ row }) => teammateName.get(row.original.userId) ?? "—",
    },
    {
      id: "assignedBy",
      header: t("assignedBy"),
      cell: ({ row }) =>
        row.original.assignedByUserId
          ? (teammateName.get(row.original.assignedByUserId) ?? "—")
          : "—",
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => <StatusPill value={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: t("created"),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-slate-500">
          {formatter.dateTime(row.original.createdAt, { dateStyle: "medium", timeStyle: "short" })}
        </span>
      ),
    },
  ];

  if (role !== null && !ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])) {
    return null;
  }

  async function handleAssign(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !assigneeId) return;
    setSubmitting(true);
    try {
      await assignTask({
        assigneeUserId: assigneeId as Id<"users">,
        title: title.trim(),
      });
      toast.success(t("assignSuccess"));
      setTitle("");
      setAssigneeId("");
    } catch {
      toast.error(t("assignFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <form
        onSubmit={handleAssign}
        className="glass-card mb-6 grid gap-4 rounded-3xl p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            {t("taskTitle")}
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("taskTitlePlaceholder")}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            {t("assignee")}
          </label>
          <select
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">{t("selectAssignee")}</option>
            {teammates?.map((teammate) => (
              <option key={teammate._id} value={teammate._id}>
                {teammate.name ?? teammate.email ?? teammate._id} ({teammate.role})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting || !title.trim() || !assigneeId}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173b9a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0f2e7d] disabled:opacity-50"
        >
          <UserPlus size={16} />
          {t("assignAction")}
        </button>
      </form>

      <div className="glass-card rounded-3xl p-6">
        <h2 className="mb-4 font-semibold text-[#071e55]">{t("teamTasks")}</h2>
        <DataTable
          columns={columns}
          data={tasks ?? []}
          isLoading={!tasks}
          emptyMessage={t("empty")}
          pageSize={10}
        />
      </div>
    </>
  );
}
