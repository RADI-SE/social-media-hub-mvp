"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { DashboardCard } from "@/components/growth/DashboardPrimitives";
import { Route } from "lucide-react";

type Account = {
  _id: string;
  name: string;
  stage: string;
  intentScore?: number;
  adoptionScore?: number;
};

export default function JourneysPage() {
  const t = useTranslations("growth.journeys");
  const accounts = useQuery(api.growth.listAccountsForOwner);

  const stageCounts = accounts?.reduce<Record<string, number>>((counts, acc) => {
    counts[acc.stage] = (counts[acc.stage] ?? 0) + 1;
    return counts;
  }, {});

  const columns: ColumnDef<Account, any>[] = [
    { accessorKey: "name", header: t("account") },
    { accessorKey: "stage", header: t("stage"), cell: ({ row }) => <span className="capitalize">{row.original.stage}</span> },
    { accessorKey: "intentScore", header: t("intent") },
    { accessorKey: "adoptionScore", header: t("adoption") },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="text-sm text-slate-500">{t("description")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stageCounts &&
          Object.entries(stageCounts).map(([stage, count]) => (
            <DashboardCard key={stage} icon={Route} title={stage} description="" value={String(count)} />
          ))}
      </div>

      <DataTable columns={columns} data={accounts ?? []} isLoading={!accounts} emptyMessage={t("empty")} pageSize={8} />
    </div>
  );
}