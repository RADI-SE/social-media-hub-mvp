"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardCard } from "@/components/growth/DashboardPrimitives";

type Account = {
  _id: string;
  name: string;
  ltv?: number;
  stage: string;
};

export default function LTVPage() {
  const t = useTranslations("growth.roleDashboards.cmo");
  const accounts = useQuery(api.growth.listAccounts);

  const totalLtv = accounts?.reduce((sum, a) => sum + (a.ltv ?? 0), 0) ?? 0;
  const avgLtv = accounts?.length ? totalLtv / accounts.length : 0;

  const columns: ColumnDef<Account, any>[] = [
    { accessorKey: "name", header: "Account" },
    { accessorKey: "stage", header: "Stage" },
    { accessorKey: "ltv", header: "LTV", cell: ({ row }) => `$${(row.original.ltv ?? 0).toLocaleString()}` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("accountLtv")}</h1>
        <p className="text-sm text-slate-500">{t("accountLtvDescription")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard icon={DollarSign} title={t("accountLtv")} description="" value={`$${totalLtv.toLocaleString()}`} />
        <DashboardCard icon={DollarSign} title="Average LTV" description="" value={`$${Math.round(avgLtv).toLocaleString()}`} />
      </div>
      <DataTable columns={columns} data={accounts ?? []} isLoading={!accounts} emptyMessage="No accounts" pageSize={8} />
    </div>
  );
}