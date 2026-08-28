"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { TrendingUp, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardCard, StageBadge, StageFunnel } from "@/components/growth/DashboardPrimitives";

type Account = {
  _id: string;
  name: string;
  stage: string;
  pipeline?: number;
  intentScore?: number;
};

export default function PipelinePage() {
  const t = useTranslations("growth.roleDashboards.cmo");
  const accounts = useQuery(api.growth.listAccounts);

  const totalPipeline = accounts?.reduce((sum, acc) => sum + (acc.pipeline ?? 0), 0) ?? 0;
  const stageCounts = accounts?.reduce<Record<string, number>>((counts, acc) => {
    counts[acc.stage] = (counts[acc.stage] ?? 0) + 1;
    return counts;
  }, {});

  const columns: ColumnDef<Account, any>[] = [
    { accessorKey: "name", header: "Account" },
    { accessorKey: "stage", header: "Stage", cell: ({ row }) => <StageBadge stage={row.original.stage} /> },
    { accessorKey: "intentScore", header: "Intent" },
    { accessorKey: "pipeline", header: "Pipeline", cell: ({ row }) => `$${(row.original.pipeline ?? 0).toLocaleString()}` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("pipeline")}</h1>
        <p className="text-sm text-slate-500">{t("pipelineDescription")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard icon={TrendingUp} title={t("pipeline")} description="" value={`$${totalPipeline.toLocaleString()}`} isLoading={!accounts} />
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-[#3156dc]" />
            <span className="text-sm font-semibold text-[#071e55]">Accounts by stage</span>
          </div>
          {accounts && stageCounts ? (
            <StageFunnel counts={stageCounts} />
          ) : (
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-2.5 w-full animate-pulse rounded-full bg-slate-100" />
              ))}
            </div>
          )}
        </div>
      </div>
      <DataTable columns={columns} data={accounts ?? []} isLoading={!accounts} emptyMessage="No accounts" pageSize={8} />
    </div>
  );
}
