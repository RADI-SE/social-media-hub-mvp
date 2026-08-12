"use client";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import PageHeader from "@/components/hub/PageHeader";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import type { SocialAccount } from "@/types/social-account";
import SocialAccountCard from "./SocialAccountCard";
import SocialAccountForm from "./SocialAccountForm";

export default function SocialAccountsManager() {
  const { accounts: backendAccounts, isLoading, error } = useSocialAccounts();
  const [addedAccounts, setAddedAccounts] = useState<SocialAccount[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const accounts = [
    ...backendAccounts.filter((account) => !removedIds.includes(account._id)),
    ...addedAccounts,
  ];

  function connect(platform: string, accountName: string) {
    setAddedAccounts((items) => [
      ...items,
      {
        _id: `demo-${Date.now()}`,
        userId: backendAccounts[0]?.userId ?? "current-user",
        platform,
        accountName,
      },
    ]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Social accounts"
        title="Connected channels"
        description="Accounts owned by the signed-in user and available when creating a post."
      />
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs leading-5 text-blue-800">
        <ShieldCheck size={17} className="mt-0.5 shrink-0" />
        <span>
          The current backend exposes mock account reads. Connect and disconnect
          actions stay in the browser for this MVP and do not publish to real
          platforms.
        </span>
      </div>
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Could not load social accounts: {error.message}
        </div>
      )}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? [1, 2].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-3xl bg-white/55"
              />
            ))
          : accounts.map((account) => (
              <SocialAccountCard
                key={account._id}
                account={account}
                onDisconnect={() =>
                  account._id.startsWith("demo-")
                    ? setAddedAccounts((items) =>
                        items.filter((item) => item._id !== account._id),
                      )
                    : setRemovedIds((items) => [...items, account._id])
                }
              />
            ))}
      </section>
      <div className="mt-6">
        <SocialAccountForm onConnect={connect} />
      </div>
    </>
  );
}
