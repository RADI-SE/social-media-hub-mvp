"use client";

import { useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { RoleDashboardShell, DashboardCard } from "./DashboardPrimitives";
import { UsersRound, Target, Lightbulb, CalendarDays } from "lucide-react";
import { toast } from "sonner";

type Account = {
  _id: string;
  name: string;
  stage: string;
  intentScore?: number;
  engagementScore?: number;
  adoptionScore?: number;
  pipeline?: number;
};

type Contact = {
  _id: string;
  name?: string;
  email?: string;
  socialHandles?: Record<string, string>;
  accountId?: string;
  role?: string;
};

export default function MarketingManagerDashboard() {
  const t = useTranslations("growth.roleDashboards.marketing_manager");
  const accounts = useQuery(api.growth.listAccountsForOwner);
  const contacts = useQuery(api.contacts.listMyContacts);
  const updateStage = useMutation(api.journey.manualSetStage);

  const highIntentAccounts = accounts?.filter((a) => (a.intentScore ?? 0) > 70) ?? [];
  const leads = contacts ?? [];

  const recommendations = useMemo(() => {
    if (!accounts) return [];
    const recs: { accountName: string; action: string; reason: string }[] = [];
    for (const acc of accounts) {
      if ((acc.intentScore ?? 0) > 80 && acc.stage !== "Customer") {
        recs.push({
          accountName: acc.name,
          action: t("recommendationDemo"),
          reason: t("recommendationDemoReason"),
        });
      } else if ((acc.adoptionScore ?? 0) > 50 && acc.stage === "Lead") {
        recs.push({
          accountName: acc.name,
          action: t("recommendationNurture"),
          reason: t("recommendationNurtureReason"),
        });
      }
    }
    return recs;
  }, [accounts, t]);

  const accountColumns: ColumnDef<Account, any>[] = [
    { accessorKey: "name", header: t("account"), cell: ({ row }) => <span className="font-semibold">{row.original.name}</span> },
    { accessorKey: "intentScore", header: t("intentScore"), cell: ({ row }) => row.original.intentScore ?? "—" },
    { accessorKey: "engagementScore", header: t("engagementScore"), cell: ({ row }) => row.original.engagementScore ?? "—" },
    { accessorKey: "adoptionScore", header: t("adoptionScore"), cell: ({ row }) => row.original.adoptionScore ?? "—" },
    { accessorKey: "stage", header: t("journeyStage"), cell: ({ row }) => <span className="capitalize">{row.original.stage}</span> },
    {
      id: "actions",
      header: t("moveStage"),
      cell: ({ row }) => {
        const account = row.original;
        return (
          <select
            value={account.stage}
            onChange={async (e) => {
              try {
                await updateStage({ accountId: account._id, stage: e.target.value as any });
                toast.success(t("stageUpdated"));
              } catch {
                toast.error(t("stageUpdateFailed"));
              }
            }}
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
          >
            <option value="Visitor">Visitor</option>
            <option value="Lead">Lead</option>
            <option value="MQL">MQL</option>
            <option value="Customer">Customer</option>
            <option value="Churned">Churned</option>
          </select>
        );
      },
    },
  ];

  const leadColumns: ColumnDef<Contact, any>[] = [
    { accessorKey: "name", header: "Name", cell: ({ row }) => row.original.name ?? "—" },
    { accessorKey: "socialHandles", header: "Social", cell: ({ row }) => Object.entries(row.original.socialHandles ?? {}).map(([p, h]) => `${p}: ${h}`).join(", ") },
    { accessorKey: "role", header: "Role", cell: ({ row }) => row.original.role ?? "—" },
    {
      id: "account",
      header: "Account",
      cell: ({ row }) => {
        const acc = accounts?.find((a) => a._id === row.original.accountId);
        return acc?.name ?? "—";
      },
    },
  ];

  return (
    <RoleDashboardShell role="marketing_manager">
      <div className="space-y-6">
        {/* Top metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard icon={Target} title={t("prioritizeLeads")} description={t("prioritizeLeadsDescription")} value={String(highIntentAccounts.length)} />
          <DashboardCard icon={UsersRound} title={t("totalLeads")} description="" value={String(leads.length)} />
          <DashboardCard icon={Lightbulb} title={t("recommendedActions")} description={t("recommendedActionsDescription")} value={String(recommendations.length)} />
          <DashboardCard icon={CalendarDays} title={t("activeAccounts")} description="" value={String(accounts?.length ?? 0)} />
        </div>

        {/* Account table */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Target size={18} className="text-[#3156dc]" />
            <h2 className="font-semibold text-[#071e55]">{t("scoredAccounts")}</h2>
          </div>
          <DataTable columns={accountColumns} data={accounts ?? []} isLoading={!accounts} emptyMessage={t("empty")} pageSize={8} />
        </div>

        {/* Leads table */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <UsersRound size={18} className="text-[#3156dc]" />
            <h2 className="font-semibold text-[#071e55]">{t("priorityLeadList")}</h2>
          </div>
          <DataTable columns={leadColumns} data={leads} isLoading={!contacts} emptyMessage={t("noLeads")} pageSize={5} />
        </div>

        {/* Recommendations */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Lightbulb size={18} className="text-[#3156dc]" />
            <h2 className="font-semibold text-[#071e55]">{t("recommendedActions")}</h2>
          </div>
          {recommendations.length === 0 ? (
            <p className="text-sm text-slate-500">{t("noRecommendations")}</p>
          ) : (
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="rounded-2xl border border-slate-100 bg-white/70 p-4">
                  <p className="text-sm font-semibold">{rec.accountName}: {rec.action}</p>
                  <p className="mt-1 text-xs text-slate-500">{rec.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </RoleDashboardShell>
  );
}