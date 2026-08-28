"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import DataTable from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Contact = {
  _id: string;
  name?: string;
  email?: string;
  socialHandles?: Record<string, string>;
  accountId?: string;
  createdAt: number;
};

type Account = {
  _id: string;
  name: string;
};

export default function ContactsPage() {
  const t = useTranslations("growth.contacts");
  const contacts = useQuery(api.contacts.listContacts);
  const accounts = useQuery(api.growth.listAccounts);
  const updateContact = useMutation(api.contacts.updateContact);

  const [assigningId, setAssigningId] = useState<string | null>(null);

  const handleAssignAccount = async (contactId: string, accountId: string) => {
    setAssigningId(contactId);
    try {
      await updateContact({
        contactId,
        accountId: accountId || undefined,
      });
      toast.success(t("accountAssigned"));
    } catch (error) {
      toast.error(t("assignFailed"));
    } finally {
      setAssigningId(null);
    }
  };

  const columns: ColumnDef<Contact, any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name ?? "—",
    },
    {
      accessorKey: "socialHandles",
      header: "Social handles",
      cell: ({ row }) => {
        const handles = row.original.socialHandles;
        return handles ? (
          <span className="text-slate-500">
            {Object.entries(handles).map(([platform, handle]) => (
              <span key={platform} className="mr-2">
                {platform}: {handle}
              </span>
            ))}
          </span>
        ) : "—";
      },
    },
    {
      accessorKey: "accountId",
      header: "Linked account",
      cell: ({ row }) => {
        const account = accounts?.find((a) => a._id === row.original.accountId);
        return account ? account.name : "—";
      },
    },
    {
      id: "actions",
      header: "Assign account",
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <select
            value={contact.accountId ?? ""}
            disabled={assigningId === contact._id}
            onChange={(e) => handleAssignAccount(contact._id, e.target.value)}
            className="block w-48 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">{t("noAccount")}</option>
            {accounts?.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="text-sm text-slate-500">{t("description")}</p>
      </div>

      <DataTable
        columns={columns}
        data={contacts ?? []}
        isLoading={!contacts}
        emptyMessage={t("empty")}
        pageSize={8}
      />
    </div>
  );
}