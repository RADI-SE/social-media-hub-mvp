"use client";

import { useMemo } from "react";
import { BarChart3, Building2, DollarSign, TrendingUp, Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { RoleDashboardShell, DashboardCard, StageBadge, StageFunnel } from "./DashboardPrimitives";

type AccountRow = {
  _id: string;
  name: string;
  intentScore?: number;
  stage: string;
  ltv?: number;
  pipeline?: number;
  spend?: number;
};

export default function CMODashboard() {
  const t = useTranslations("growth.roleDashboards.cmo");
  const accounts = useQuery(api.growth.listAccounts);

  const metrics = useMemo(() => {
    if (!accounts || accounts.length === 0) {
      return { avgIntent: 0, totalPipeline: 0, totalLtv: 0, conversionRate: 0, roi: 0 };
    }
    const intentSum = accounts.reduce((sum, acc) => sum + (acc.intentScore ?? 0), 0);
    const pipelineSum = accounts.reduce((sum, acc) => sum + (acc.pipeline ?? 0), 0);
    const ltvSum = accounts.reduce((sum, acc) => sum + (acc.ltv ?? 0), 0);
    const spendSum = accounts.reduce((sum, acc) => sum + (acc.spend ?? 0), 0);
    const customerCount = accounts.filter((acc) => acc.stage === "Customer").length;

    const roi = spendSum > 0 ? Math.round(((pipelineSum - spendSum) / spendSum) * 100) : 0;

    return {
      avgIntent: Math.round(intentSum / accounts.length),
      totalPipeline: pipelineSum,
      totalLtv: ltvSum,
      conversionRate: Math.round((customerCount / accounts.length) * 100),
      roi,
    };
  }, [accounts]);

  const stageCounts = useMemo(() => {
    if (!accounts) return {};
    return accounts.reduce<Record<string, number>>((counts, acc) => {
      counts[acc.stage] = (counts[acc.stage] ?? 0) + 1;
      return counts;
    }, {});
  }, [accounts]);

  const accountColumns: ColumnDef<AccountRow, any>[] = [
    { accessorKey: "name", header: "Account", cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.name}</span> },
    { accessorKey: "intentScore", header: "Intent score", cell: ({ row }) => row.original.intentScore ?? "—" },
    { accessorKey: "stage", header: "Stage", cell: ({ row }) => <StageBadge stage={row.original.stage} /> },
    { accessorKey: "ltv", header: "Projected LTV", cell: ({ row }) => row.original.ltv ? `$${row.original.ltv.toLocaleString()}` : "—" },
  ];

  return (
    <RoleDashboardShell role="cmo">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DashboardCard icon={BarChart3} title={t("accountScores")} description={t("accountScoresDescription")} value={String(metrics.avgIntent)} isLoading={!accounts} />
          <DashboardCard icon={DollarSign} title={t("pipeline")} description={t("pipelineDescription")} value={`$${metrics.totalPipeline.toLocaleString()}`} isLoading={!accounts} />
          <DashboardCard icon={TrendingUp} title={t("conversion")} description={t("conversionDescription")} value={`${metrics.conversionRate}%`} isLoading={!accounts} />
          <DashboardCard icon={BarChart3} title={t("campaignRoi")} description={t("campaignRoiDescription")} value={`${metrics.roi}%`} isLoading={!accounts} />
          <DashboardCard icon={DollarSign} title={t("accountLtv")} description={t("accountLtvDescription")} value={`$${metrics.totalLtv.toLocaleString()}`} isLoading={!accounts} />
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <TrendingUp size={18} className="text-[#3156dc]" />
            <h2 className="font-semibold text-[#071e55]">Pipeline by stage</h2>
          </div>
          {accounts ? (
            <StageFunnel counts={stageCounts} />
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-2.5 w-full animate-pulse rounded-full bg-slate-100" />
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Building2 size={18} className="text-[#3156dc]" />
            <h2 className="font-semibold text-[#071e55]">{t("accountPortfolio")}</h2>
          </div>
          <DataTable columns={accountColumns} data={accounts ?? []} isLoading={!accounts} emptyMessage={t("noAccounts")} pageSize={8} />
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell size={18} className="text-[#3156dc]" />
            <h2 className="font-semibold text-[#071e55]">{t("executiveAlerts")}</h2>
          </div>
          <ul className="space-y-3">
            {!accounts && Array.from({ length: 2 }).map((_, i) => (
              <li key={`skeleton-${i}`} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ))}
            {accounts?.filter((acc) => (acc.intentScore ?? 0) > 80).map((acc) => (
              <li
                key={acc._id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-semibold text-[#071e55]">{acc.name} intent reached {acc.intentScore}</p>
                  <p className="mt-1 text-xs text-slate-500">A decision-maker requested a workflow demonstration.</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">High intent</span>
              </li>
            ))}
            {!accounts || accounts.filter((acc) => (acc.intentScore ?? 0) > 80).length === 0 && (
              <li className="text-sm text-slate-500">{t("noAlerts")}</li>
            )}
          </ul>
        </div>
      </div>
    </RoleDashboardShell>
  );
}