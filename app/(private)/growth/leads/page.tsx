"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

type Contact = {
  _id: string;
  name?: string;
  email?: string;
  socialHandles?: Record<string, string>;
  accountId?: string;
  role?: string;
};

export default function LeadsPage() {
  const t = useTranslations("growth.leads");
  const contacts = useQuery(api.contacts.listMyContacts);
  const accounts = useQuery(api.growth.listAccountsForOwner);

  const columns: ColumnDef<Contact, any>[] = [
    { accessorKey: "name", header: t("person"), cell: ({ row }) => row.original.name ?? "—" },
    { accessorKey: "socialHandles", header: "Social", cell: ({ row }) => Object.entries(row.original.socialHandles ?? {}).map(([p, h]) => `${p}: ${h}`).join(", ") },
    { accessorKey: "role", header: t("role"), cell: ({ row }) => row.original.role ?? "—" },
    {
      id: "account",
      header: t("account"),
      cell: ({ row }) => {
        const acc = accounts?.find((a) => a._id === row.original.accountId);
        return acc?.name ?? "—";
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="text-sm text-slate-500">{t("description")}</p>
      </div>
      <DataTable columns={columns} data={contacts ?? []} isLoading={!contacts} emptyMessage={t("empty")} pageSize={8} />
    </div>
  );
}