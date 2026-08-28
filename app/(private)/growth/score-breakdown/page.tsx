"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

type Account = {
  _id: string;
  name: string;
  intentScore?: number;
  engagementScore?: number;
  adoptionScore?: number;
  score?: number;
};

export default function ScoreBreakdownPage() {
  const t = useTranslations("growth.roleDashboards.marketing_manager");
  const accounts = useQuery(api.growth.listAccounts);

  const columns: ColumnDef<Account, any>[] = [
    { accessorKey: "name", header: "Account" },
    { accessorKey: "intentScore", header: t("intentScore") },
    { accessorKey: "engagementScore", header: t("engagementScore") },
    { accessorKey: "adoptionScore", header: t("adoptionScore") },
    { accessorKey: "score", header: "Total", cell: ({ row }) => row.original.score?.toFixed(1) ?? "—" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("scoreBreakdown")}</h1>
        <p className="text-sm text-slate-500">{t("scoredAccounts")}</p>
      </div>
      <DataTable columns={columns} data={accounts ?? []} isLoading={!accounts} emptyMessage={t("empty")} pageSize={8} />
    </div>
  );
}