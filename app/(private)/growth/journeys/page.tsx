"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { StageBadge, StageFunnel } from "@/components/growth/DashboardPrimitives";
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
  const accounts = useQuery(api.growth.listAccounts);

  const stageCounts = accounts?.reduce<Record<string, number>>((counts, acc) => {
    counts[acc.stage] = (counts[acc.stage] ?? 0) + 1;
    return counts;
  }, {});

  const columns: ColumnDef<Account, any>[] = [
    { accessorKey: "name", header: t("account") },
    { accessorKey: "stage", header: t("stage"), cell: ({ row }) => <StageBadge stage={row.original.stage} /> },
    { accessorKey: "intentScore", header: t("intent") },
    { accessorKey: "adoptionScore", header: t("adoption") },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="text-sm text-slate-500">{t("description")}</p>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="mb-5 flex items-center gap-3">
          <Route size={18} className="text-[#3156dc]" />
          <h2 className="font-semibold text-[#071e55]">{t("title")}</h2>
        </div>
        {accounts ? (
          stageCounts && Object.keys(stageCounts).length > 0 ? (
            <StageFunnel counts={stageCounts} />
          ) : (
            <p className="text-sm text-slate-500">{t("empty")}</p>
          )
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-2.5 w-full animate-pulse rounded-full bg-slate-100" />
            ))}
          </div>
        )}
      </div>

      <DataTable columns={columns} data={accounts ?? []} isLoading={!accounts} emptyMessage={t("empty")} pageSize={8} />
    </div>
  );
}
