"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PieChart, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardCard } from "@/components/growth/DashboardPrimitives";

type Account = {
  _id: string;
  name: string;
  pipeline?: number;
  ltv?: number;
};

export default function ROIPage() {
  const t = useTranslations("growth.roleDashboards.cmo");
  const accounts = useQuery(api.growth.listAccountsForOwner);

  const totalPipeline = accounts?.reduce((sum, a) => sum + (a.pipeline ?? 0), 0) ?? 0;
  const totalLtv = accounts?.reduce((sum, a) => sum + (a.ltv ?? 0), 0) ?? 0;
  const roi = totalPipeline > 0 ? Math.round((totalLtv / totalPipeline) * 100) : 0;

  const columns: ColumnDef<Account, any>[] = [
    { accessorKey: "name", header: "Account" },
    { accessorKey: "pipeline", header: "Pipeline", cell: ({ row }) => `$${(row.original.pipeline ?? 0).toLocaleString()}` },
    { accessorKey: "ltv", header: "LTV", cell: ({ row }) => `$${(row.original.ltv ?? 0).toLocaleString()}` },
    { header: "ROI", cell: ({ row }) => {
        const r = (row.original.pipeline && row.original.ltv) ? Math.round((row.original.ltv / row.original.pipeline) * 100) : 0;
        return `${r}%`;
      }
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("campaignRoi")}</h1>
        <p className="text-sm text-slate-500">{t("campaignRoiDescription")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard icon={BarChart3} title={t("pipeline")} description="" value={`$${totalPipeline.toLocaleString()}`} />
        <DashboardCard icon={PieChart} title={t("accountLtv")} description="" value={`$${totalLtv.toLocaleString()}`} />
        <DashboardCard icon={PieChart} title="ROI" description="" value={`${roi}%`} />
      </div>
      <DataTable columns={columns} data={accounts ?? []} isLoading={!accounts} emptyMessage="No accounts" pageSize={8} />
    </div>
  );
}