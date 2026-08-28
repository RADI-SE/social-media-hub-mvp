"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Building2, DollarSign } from "lucide-react";
import { DashboardCard, StageBadge } from "@/components/growth/DashboardPrimitives";

type Account = {
  _id: string;
  name: string;
  domain?: string;
  stage: string;
  intentScore?: number;
  pipeline?: number;
  ltv?: number;
};

export default function AccountsPage() {
  const accounts = useQuery(api.growth.listAccounts);
  const totalPipeline = accounts?.reduce((sum, a) => sum + (a.pipeline ?? 0), 0) ?? 0;

  const columns: ColumnDef<Account, any>[] = [
    { accessorKey: "name", header: "Account", cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.name}</span> },
    { accessorKey: "domain", header: "Domain", cell: ({ row }) => row.original.domain ?? "—" },
    { accessorKey: "stage", header: "Stage", cell: ({ row }) => <StageBadge stage={row.original.stage} /> },
    { accessorKey: "intentScore", header: "Intent", cell: ({ row }) => row.original.intentScore ?? "—" },
    { accessorKey: "pipeline", header: "Pipeline", cell: ({ row }) => row.original.pipeline ? `$${row.original.pipeline.toLocaleString()}` : "—" },
    { accessorKey: "ltv", header: "LTV", cell: ({ row }) => row.original.ltv ? `$${row.original.ltv.toLocaleString()}` : "—" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
        <p className="text-sm text-slate-500">Every B2B account shared across the workspace.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard icon={Building2} title="Total accounts" description="" value={String(accounts?.length ?? 0)} isLoading={!accounts} />
        <DashboardCard icon={DollarSign} title="Total pipeline" description="" value={`$${totalPipeline.toLocaleString()}`} isLoading={!accounts} />
      </div>
      <DataTable columns={columns} data={accounts ?? []} isLoading={!accounts} emptyMessage="No accounts yet" pageSize={8} />
    </div>
  );
}
