"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";

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
  const columns: ColumnDef<Account, any>[] = [
    { accessorKey: "name", header: "Account" },
    { accessorKey: "domain", header: "Domain" },
    { accessorKey: "stage", header: "Stage" },
    { accessorKey: "intentScore", header: "Intent" },
    { accessorKey: "pipeline", header: "Pipeline" },
    { accessorKey: "ltv", header: "LTV" },
  ];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Accounts</h1>
      <DataTable columns={columns} data={accounts ?? []} isLoading={!accounts} />
    </div>
  );
}